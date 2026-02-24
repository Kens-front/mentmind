<template>
    <el-form 
        @submit.prevent="onSubmit" 
        class="form"
        label-position="top"
    >
        <div class="inputs">
            <el-form-item v-if="hasVisibleField('lesson-link')" label="Ссылка на занятие">
                <el-input 
                    v-model="lessonStore.updateLesson.lessonLink"
                    :readonly="!setVisibleElement([RoleList.ADMIN, RoleList.MENTOR])"
                    placeholder="https://"
                    label="link"
                    data-cy="lesson-link"
                    @click="handleClickLink(lessonStore.updateLesson.lessonLink)"
                />
            </el-form-item>

            <el-form-item v-if="hasVisibleField('duration')" label="Длительность">
                <el-input 
                    v-model="lessonStore.updateLesson.duration"
                    readonly
                    placeholder="Длительность"
                    data-cy="duration"
                />
            </el-form-item>

            <el-form-item v-if="hasVisibleField('record-link')" label="Ссылка на запись">
                <el-input 
                    v-model="lessonStore.updateLesson.recordLink"
                    placeholder="Ссылка на запись"
                    data-cy="record-link"
                    :readonly="!setVisibleElement([RoleList.ADMIN, RoleList.MENTOR])"
                    @click="handleClickLink(lessonStore.updateLesson.recordLink)"
                />
            </el-form-item>

            <el-form-item v-if="hasVisibleField('price')" label="Стоимость">
                <el-input 
                    v-model="lessonStore.updateLesson.price"
                    placeholder="Цена за час"
                    data-cy="price"
                />
            </el-form-item>

            <el-form-item v-if="hasVisibleField('finePercent')" label="Процент штрафа">
                <el-input 
                    v-model="lessonStore.updateLesson.finePercent"
                    placeholder="0"
                    data-cy="finePercent"
                />
            </el-form-item>


            <el-form-item v-if="hasVisibleField('status')" label="Статус занятия">
                <el-select v-model="lessonStore.updateLesson.status"  data-cy="status">
                    <el-option
                        v-for="status of LESSONS_STATUSES"
                        :key="status.label"
                        :value="status.value"
                        :label="status.label"
                    />
                </el-select>
            </el-form-item>

            <el-form-item v-if="hasVisibleField('date')" label="Дата">
                <el-input v-model="dateTime" readonly placeholder="Дата"/>
            </el-form-item>

            <el-form-item v-if="hasVisibleField('lessonType')" label="Тип занятия">
                <el-input v-model="lessonStore.updateLesson.lessonType" readonly placeholder="Пробное"/>
            </el-form-item>

            <el-form-item v-if="hasVisibleField('notes')" label="Комментарий">
                <el-input v-model="lessonStore.updateLesson.notes" type="textarea" placeholder="Комментарий"   data-cy="notes"/>
            </el-form-item>


            <el-form-item v-if="hasVisibleField('mentor')" label="Ментор">
                <el-input v-model="lessonStore.updateLesson.mentorFullname" readonly placeholder="Абрам Исакович"/>
            </el-form-item>
 
    
            <el-form-item v-if="hasVisibleField('student')" label="Студент">
                <el-input v-model="lessonStore.updateLesson.studentFullname" readonly placeholder="Абрам Исакович"/>
            </el-form-item>
        
            <el-form-item v-if="hasVisibleField('rating')" label="Оценка">
                <el-rate v-model="lessonStore.updateLesson.rating" :readonly="hasVisibleField('rating')"   data-cy="rating" />
            </el-form-item>

            <el-form-item label="Действия">
                <el-button 
                    native-type="submit" 
                    data-cy="submit"
                >
                    Сохранить
                </el-button>

                <OpenCloseLessonSlotModal v-if="setVisibleElement([RoleList.ADMIN])" :lesson-id="lessonId"/>
            </el-form-item>
        </div>
    </el-form>
</template>

<script lang="ts" setup>
 
import { useLessonStore } from '../store';
 
import { computed } from 'vue';
import { LESSONS_STATUSES } from '../constants';
import { notifySuccess } from '@/shared/config/notifications';
import { RoleList } from '@/features/users/types';
 
import { useSetVisibleElement } from '@/features/common/composables/set-visible-element';
import OpenCloseLessonSlotModal from '@/features/lesson-slots/components/OpenCloseLessonSlotModal.vue';
import { saveClipboard } from '@/shared/helpers';

interface IProps {
    role: RoleList
    lessonId: number
    formFields: string []
}

interface IRoleData {
    title: string
    messageSuccess: string
    callback: (lessonId: number) => void
}
const {role, lessonId, formFields = []} = defineProps<IProps>()
 
const {setVisibleElement} = useSetVisibleElement()
const lessonStore = useLessonStore()
 
const dateTime = computed(() => `${lessonStore.updateLesson.date} ${lessonStore.updateLesson.start_time}`)

function handleClickLink(text: string | undefined) {
    if (role !== RoleList.STUDENT) {
        return;
    }
    
    saveClipboard(text)
}

function hasVisibleField(field:string) {
    if (!formFields.length) {
        return true;
    }

    return formFields.includes(field)
}

async function onSubmit() {
 
    try {
        if (!lessonId) {
            return
        }

        await lessonStore.update(Number(lessonId))
        notifySuccess('Занятие успешно обновлено')
    } catch {

    }
}


</script>

<style lang="scss" scoped>
    .date {
        display: grid;
        row-gap: 1rem;
    }

    .form {
        display: grid;
        grid-template-columns: 1fr max-content;
        gap: 1rem;
        justify-content: space-between;
    }
    
    .inputs {
        display: grid;
        grid-auto-rows: max-content;
        grid-template-columns: 1fr 1fr;
        gap: 0 2rem;
    }
    
    .time {
        width: 100%;
    }
</style>
    