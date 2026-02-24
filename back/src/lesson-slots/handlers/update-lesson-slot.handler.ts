import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateLessonSlotCommand } from "../commands/update-lesson-slot.command";
import { InjectRepository } from "@nestjs/typeorm";
import { LessonSlots } from "../entities/lesson-slot.entity";
import { EntityManager, Repository } from "typeorm";
import { HttpException } from "@nestjs/common";
import { Lesson, LESSON_TYPES } from "src/lesson/entities/lesson.entity";
import { CreateMentorPayoutCommand } from "src/mentor-payout/commands/create-mentor-payout.command";
import { RoleList } from "src/user/types";
import { MENTOR_TYPES } from "src/mentor_profile/types";
import { LESSON_DURATION } from "src/payment/types";
import { User } from "src/user/entities/user.entity";
import { LessonPackage } from "src/lesson-package/entities/lesson-package.entity";
import { LessonParticipant } from "src/lesson-participant/entities/lesson-participant.entity";

export enum LESSON_STATUS_CHANGE_REASON {
    COMPLETED_SUCCESSFULLY = 'completed_successfully',
    SCHEDULED_RESCHEDULE = 'scheduled_reschedule',
    DISRESPECTFUL_STUDENT = 'disrespectful_student',
    RESPECTFUL_STUDENT = 'respectful_student',
    DISRESPECTFUL_MENTOR = 'disrespectful_mentor',
    RESPECTFUL_MENTOR = 'respectful_mentor'
}

interface PayoutCalculation {
    amount: number;
    fineAmount: number;
    finalAmount: number;
    payoutStatus: string;
}


@CommandHandler(UpdateLessonSlotCommand)
export class UpdateLessonSlotHandler implements ICommandHandler<UpdateLessonSlotCommand> {
    constructor(
        @InjectRepository(LessonSlots) private readonly lessonSlotRepo: Repository<LessonSlots>,
        // Важно: используем EntityManager напрямую для транзакции
        private entityManager: EntityManager,
        private commandBus: CommandBus,
        // Инжектим репозитории, которые будут использоваться внутри транзакции
        @InjectRepository(LessonParticipant) private readonly lessonParticipantRepo: Repository<LessonParticipant>,
        @InjectRepository(LessonPackage) private readonly lessonPackageRepo: Repository<LessonPackage>,
    ) { }

    async execute(command: UpdateLessonSlotCommand): Promise<LessonSlots> {
        const { lessonId, dto } = command;
        const { status, reason } = dto;

        // Валидация входных данных
        if (!reason) {
            throw new HttpException('Reason for status change is required', 400);
        }

        // Загружаем слот и связанную информацию
        const lessonSlot = await this.entityManager.findOne(LessonSlots, {
            where: { lesson: { id: lessonId } },
            relations: {
                lesson: {
                    participants: { user: { mentor_profile: true }, lessonPackage: true },
                    studentGroup: { students: true },
                },
            },
        });

        if (!lessonSlot) {
            throw new HttpException('Lesson slot not found', 404);
        }

        const isGroupLesson = lessonSlot.lesson.isGroupLesson;

        // Находим ментора и учеников
        const mentorParticipant = lessonSlot.lesson.participants.find(p => p.role === RoleList.MENTOR);
        const studentParticipants = lessonSlot.lesson.participants.filter(p => p.role === RoleList.STUDENT);

        if (!mentorParticipant) {
            throw new HttpException('Mentor not found for the lesson', 404);
        }

        if (studentParticipants.length === 0) {
            throw new HttpException('No students found for the lesson', 404);
        }

        if (!mentorParticipant.user?.mentor_profile) {
            throw new HttpException('Mentor profile not found', 404);
        }

        // Для групповых занятий разрешаем только завершение
        if (isGroupLesson && reason !== LESSON_STATUS_CHANGE_REASON.COMPLETED_SUCCESSFULLY) {
            throw new HttpException(
                'Group lessons can only be completed successfully. Cancellation or rescheduling is not supported.',
                400
            );
        }

        // Начинаем транзакцию
        return await this.entityManager.transaction(async transactionalEntityManager => {
            // Обновляем статус слота
            lessonSlot.status = status;
            lessonSlot.expiresAt = new Date();

            // Сохраняем обновлённые сущности
            await transactionalEntityManager.save([lessonSlot.lesson, lessonSlot]);

            // Обрабатываем изменение статуса в зависимости от причины
            if (isGroupLesson) {
                // Для групповых занятий
                await this.handleGroupLessonCompletion(
                    transactionalEntityManager,
                    lessonSlot,
                    mentorParticipant,
                    studentParticipants
                );
            } else {
                // Для индивидуальных занятий
                await this.handleStatusChangeByReason(
                    transactionalEntityManager,
                    lessonSlot,
                    reason,
                    mentorParticipant,
                    studentParticipants[0]
                );
            }

            return lessonSlot;
        });
    }

    /**
     * Обрабатывает завершение группового занятия
     * @param entityManager - менеджер транзакций
     * @param lessonSlot - слот занятия
     * @param mentorParticipant - участник-ментор
     * @param studentParticipants - массив участников-студентов
     */
    private async handleGroupLessonCompletion(
        entityManager: EntityManager,
        lessonSlot: LessonSlots,
        mentorParticipant: LessonParticipant,
        studentParticipants: LessonParticipant[]
    ) {
        const mentor = mentorParticipant.user;
        const lesson = lessonSlot.lesson;

        // Списываем занятия у всех студентов из их пакетов
        for (const studentParticipant of studentParticipants) {
            const lessonPackage = studentParticipant.lessonPackage;
            console.log('lessonPackage', lessonPackage);
            if (lessonPackage) {
                // Для групповых занятий также списываем 1 занятие
                lessonPackage.usedCount = (lessonPackage.usedCount || 0) + 1;
                console.log(`lessonPackage usedCount: ${lessonPackage.usedCount}`);
                if (lessonPackage.totalCount - lessonPackage.usedCount <=0) {
                    console.log(`lessonPackage total: ${lessonPackage.totalCount}`);
                    lessonPackage.status = 'exhausted';
                }
                
                await entityManager.save(LessonPackage, lessonPackage);
            }
        }

        // Рассчитываем выплату ментору
        // Для групповых занятий можно использовать коэффициент за количество студентов
        const studentCount = studentParticipants.length;
        await this.createMentorPayoutForGroupLesson(
            entityManager,
            lesson,
            mentor,
            studentCount
        );

        console.log('Group lesson completed:', {
            lessonId: lesson.id,
            mentorId: mentor.id,
            studentCount,
            studentsProcessed: studentParticipants.map(sp => sp.userId),
        });
    }

    private async handleStatusChangeByReason(
        entityManager: EntityManager,
        lessonSlot: LessonSlots,
        reason: LESSON_STATUS_CHANGE_REASON,
        mentorParticipant: LessonParticipant,
        studentParticipant: LessonParticipant
    ) {
        const lessonPackage = studentParticipant.lessonPackage;
        const mentor = mentorParticipant.user;

        switch (reason) {
            case LESSON_STATUS_CHANGE_REASON.COMPLETED_SUCCESSFULLY:
                // Занятие проведено успешно
                // Ментор получает полную оплату (с учетом штрафа, если есть)
                if (lessonPackage && (lessonPackage.totalCount - lessonPackage.usedCount <=0)) {
                    console.log(`lessonPackage total: ${lessonPackage.totalCount}`);
                    lessonPackage.status = 'exhausted';
                    
                    await entityManager.save(LessonPackage, lessonPackage);
                }

                
                await this.createMentorPayout(
                    entityManager,
                    lessonSlot.lesson,
                    mentor,
                    reason
                );
                break;

            case LESSON_STATUS_CHANGE_REASON.DISRESPECTFUL_STUDENT:
                // Ученик не пришёл - не вина ментора
                // Ментор получает полную оплату
                await this.createMentorPayout(
                    entityManager,
                    lessonSlot.lesson,
                    mentor,
                    reason
                );
                break;

            case LESSON_STATUS_CHANGE_REASON.DISRESPECTFUL_MENTOR:
                // Ментор не пришёл - вина ментора
                // Возвращаем занятие в пакет ученика
                if (lessonPackage) {
                    lessonPackage.usedCount = Math.max(0, (lessonPackage.usedCount || 0) - 1);
                    await entityManager.save(LessonPackage, lessonPackage);
                }
                // Ментор НЕ получает оплату и получает штраф
                await this.createMentorPayout(
                    entityManager,
                    lessonSlot.lesson,
                    mentor,
                    reason
                );
                break;

            case LESSON_STATUS_CHANGE_REASON.RESPECTFUL_STUDENT:
            case LESSON_STATUS_CHANGE_REASON.RESPECTFUL_MENTOR:
                // Плановый перенос занятия
                // Возвращаем занятие в пакет ученика
                if (lessonPackage) {
                    lessonPackage.usedCount = Math.max(0, (lessonPackage.usedCount || 0) - 1);
                    await entityManager.save(LessonPackage, lessonPackage);
                }
                // Ментор не получает оплату (перенос без штрафа)
                await this.createMentorPayout(
                    entityManager,
                    lessonSlot.lesson,
                    mentor,
                    reason
                );
                break;

            default:
                throw new HttpException(`Unknown reason for status change: ${reason}`, 400);
        }
    }

    /**
     * Создает выплату для ментора за групповое занятие
     * @param entityManager - менеджер транзакций
     * @param lesson - занятие
     * @param mentor - пользователь-ментор с профилем
     * @param studentCount - количество студентов в группе
     */
    private async createMentorPayoutForGroupLesson(
        entityManager: EntityManager,
        lesson: Lesson,
        mentor: User,
        studentCount: number
    ) {
        if (!mentor.mentor_profile) {
            throw new HttpException('Mentor profile not found', 404);
        }

        const mentorLevel = mentor.mentor_profile.level as MENTOR_TYPES;
        const baseAmount = lesson.price;

        // Для групповых занятий используем множитель по количеству студентов
        // Базовый коэффициент: 1.0 за первого студента, +0.3 за каждого последующего
        const groupMultiplier = 1.0;

        // Рассчитываем выплату для группового занятия
        const payoutCalculation = this.calculatePayoutForGroupLesson(
            baseAmount,
            mentorLevel,
            lesson.duration,
            lesson.finePercent,
            studentCount,
            groupMultiplier
        );

        // Создаем выплату
        await this.commandBus.execute(
            new CreateMentorPayoutCommand({
                userId: mentor.id,
                amount: payoutCalculation.amount,
                fineAmount: payoutCalculation.fineAmount,
                finalAmount: payoutCalculation.finalAmount,
                lessonId: lesson.id,
            })
        );
    }

    /**
     * Создает выплату для ментора с учетом всех факторов
     * @param entityManager - менеджер транзакций
     * @param lesson - занятие
     * @param mentor - пользователь-ментор с профилем
     * @param scenario - сценарий завершения занятия
     */
    private async createMentorPayout(
        entityManager: EntityManager,
        lesson: Lesson,
        mentor: User,
        scenario: LESSON_STATUS_CHANGE_REASON
    ) {
        if (!mentor.mentor_profile) {
            throw new HttpException('Mentor profile not found', 404);
        }

        const mentorLevel = mentor.mentor_profile.level as MENTOR_TYPES;
        const baseAmount = lesson.price;

        // Рассчитываем выплату в зависимости от сценария
        const payoutCalculation = this.calculatePayoutByScenario(
            baseAmount,
            mentorLevel,
            lesson.duration,
            lesson.finePercent,
            scenario
        );

        // Создаем выплату
        await this.commandBus.execute(
            new CreateMentorPayoutCommand({
                userId: mentor.id,
                amount: payoutCalculation.amount,
                fineAmount: payoutCalculation.fineAmount,
                finalAmount: payoutCalculation.finalAmount,
                lessonId: lesson.id,
            })
        );
    }

    /**
     * Рассчитывает выплату для ментора за групповое занятие
     * @param baseAmount - базовая цена занятия
     * @param mentorLevel - уровень ментора
     * @param duration - длительность занятия
     * @param finePercent - процент штрафа из lesson
     * @param studentCount - количество студентов
     * @param groupMultiplier - множитель за групповое занятие
     * @returns объект с расчетом выплаты
     */
    private calculatePayoutForGroupLesson(
        baseAmount: number,
        mentorLevel: MENTOR_TYPES,
        duration: LESSON_DURATION,
        finePercent: number,
        studentCount: number,
        groupMultiplier: number
    ): PayoutCalculation {
        // Коэффициенты для разных уровней менторов
        const MENTOR_COEFFICIENTS = {
            [MENTOR_TYPES.JUNIOR]: 0.5,
            [MENTOR_TYPES.MIDDLE]: 0.6,
            [MENTOR_TYPES.SENIOR]: 0.7,
            [MENTOR_TYPES.BASE]: 0.6,
            [MENTOR_TYPES.PREMIUM]: 0.75,
        };

        // Корректировка по длительности занятия
        const DURATION_COEFFICIENTS = {
            [LESSON_DURATION.MIN]: 1.0,      // 60 минут - базовая ставка
            [LESSON_DURATION.AVERAGE]: 0.95, // 90 минут - небольшая скидка
            [LESSON_DURATION.MAX]: 0.9,      // 120 минут - большая скидка
        };

        const mentorCoef = MENTOR_COEFFICIENTS[mentorLevel] || MENTOR_COEFFICIENTS[MENTOR_TYPES.BASE];
        const durationCoef = DURATION_COEFFICIENTS[duration] || 1.0;

        // Базовый расчет оплаты ментора с учетом группового множителя
        const basePayoutAmount = baseAmount * mentorCoef * durationCoef * groupMultiplier;

        let amount = baseAmount * studentCount; // Общая цена = цена за студента * количество студентов
        let fineAmount = 0;
        let finalAmount = 0;

        // Для групповых занятий всегда успешное завершение
        if (finePercent > 0) {
            fineAmount = Math.round(basePayoutAmount * (finePercent / 100));
            finalAmount = Math.round(basePayoutAmount - fineAmount);
        } else {
            finalAmount = Math.round(basePayoutAmount);
        }

        return {
            amount,
            fineAmount,
            finalAmount,
            payoutStatus: 'pending',
        };
    }

    /**
     * Рассчитывает выплату для ментора в зависимости от сценария
     * @param baseAmount - базовая цена занятия
     * @param mentorLevel - уровень ментора
     * @param duration - длительность занятия
     * @param finePercent - процент штрафа из lesson
     * @param scenario - сценарий завершения занятия
     * @returns объект с расчетом выплаты
     */
    private calculatePayoutByScenario(
        baseAmount: number,
        mentorLevel: MENTOR_TYPES,
        duration: LESSON_DURATION,
        finePercent: number,
        scenario: LESSON_STATUS_CHANGE_REASON
    ): PayoutCalculation {
        // Коэффициенты для разных уровней менторов
        const MENTOR_COEFFICIENTS = {
            [MENTOR_TYPES.JUNIOR]: 0.4,
            [MENTOR_TYPES.MIDDLE]: 0.5,
            [MENTOR_TYPES.SENIOR]: 0.6,
            [MENTOR_TYPES.BASE]: 0.65,
            [MENTOR_TYPES.PREMIUM]: 0.75,
        };

        // Корректировка по длительности занятия
        const DURATION_COEFFICIENTS = {
            [LESSON_DURATION.MIN]: 1.0,      // 60 минут - базовая ставка
            [LESSON_DURATION.AVERAGE]: 0.95, // 90 минут - небольшая скидка
            [LESSON_DURATION.MAX]: 0.9,      // 120 минут - большая скидка
        };

        const mentorCoef = MENTOR_COEFFICIENTS[mentorLevel] || MENTOR_COEFFICIENTS[MENTOR_TYPES.BASE];
        const durationCoef = 1.0;

        // Базовый расчет оплаты ментора
        const basePayoutAmount = baseAmount * mentorCoef * durationCoef;

        let amount = baseAmount;
        let fineAmount = 0;
        let finalAmount = 0;

        switch (scenario) {
            case LESSON_STATUS_CHANGE_REASON.COMPLETED_SUCCESSFULLY:
                // Занятие проведено успешно
                // Применяем штраф, если он есть (finePercent - это процент от 0 до 100)
                if (finePercent > 0) {
                    fineAmount = Math.round(basePayoutAmount * (finePercent / 100));
                    finalAmount = basePayoutAmount - fineAmount;
                } else {
                    finalAmount = basePayoutAmount;
                }
                break;

            case LESSON_STATUS_CHANGE_REASON.DISRESPECTFUL_STUDENT:
                // Ученик не пришел - не вина ментора
                // Ментор получает полную оплату
                finalAmount = basePayoutAmount * 0.3;
                break;

            case LESSON_STATUS_CHANGE_REASON.DISRESPECTFUL_MENTOR:
                // Ментор не пришел - серьезное нарушение
                // Ментор НЕ получает оплату и получает штраф (50% от цены занятия)
                fineAmount = baseAmount;
                finalAmount = 0;
                break;

            case LESSON_STATUS_CHANGE_REASON.RESPECTFUL_MENTOR:
            case LESSON_STATUS_CHANGE_REASON.RESPECTFUL_STUDENT:
                // Плановый перенос - штрафов нет
                // Ментор не получает оплату (занятие не состоялось)
                finalAmount = 0;
                break;

            default:
                throw new HttpException(`Unknown scenario: ${scenario}`, 400);
        }

        return {
            amount,
            fineAmount,
            finalAmount,
            payoutStatus: 'pending',
        };
    }
}