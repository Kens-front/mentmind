import { Navigation } from "@/shared/constants/navigation";
import { RoleList } from "../users/types";
import { Avatar, Calendar, ChatRound, CreditCard, DocumentAdd, House, Reading, School, Suitcase, Tickets, TrendCharts, UserFilled, Wallet } from "@element-plus/icons-vue";


export const NAVIGATION_LINKS = [
    { label: 'Главная', href: Navigation.HOME, roles: [], icon: House },
    { label: 'Мой профиль', href: Navigation.PROFILE, roles: [], icon: Tickets },
    { label: 'Учебные направления', href: Navigation.LEARN_DIRECTIONS, roles: [RoleList.ADMIN], icon: TrendCharts },
    { label: 'Менторы', href: Navigation.MENTORS, roles: [RoleList.ADMIN], icon: Avatar },
    { label: 'Студенты', href: Navigation.STUDENTS, roles: [RoleList.ADMIN], icon: School },
    { label: 'Группы', href: Navigation.GROUPS, roles: [RoleList.ADMIN, RoleList.MENTOR], icon: School },
    { label: 'Мои студенты', href: Navigation.STUDENTS, roles: [RoleList.MENTOR], icon: UserFilled },
    { label: 'Рабочий график', href: Navigation.SLOTS, roles: [RoleList.MENTOR], icon: Calendar },
    { label: 'Занятия', href: Navigation.LESSONS, roles: [], icon: Suitcase },
    { label: 'Чаты', href: Navigation.CHATS, roles: [], icon: ChatRound },
    { label: 'Выплаты', href: Navigation.MENTOR_PAYOUTS, roles: [RoleList.ADMIN, RoleList.MENTOR], icon: CreditCard },
    { label: 'Оплаты', href: Navigation.STUDENT_PAYOUTS, roles: [RoleList.ADMIN, RoleList.STUDENT], icon: Wallet },
    { label: 'Домашние занятия', href: Navigation.HOMEWORKS, roles: [], icon: Reading },
    { label: 'Создание домашнего занятия', href: Navigation.CREATE_HOMEWORKS, roles: [RoleList.MENTOR], icon: DocumentAdd },
];
