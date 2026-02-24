import { Navigation } from '@/shared/constants/navigation';
import type { RouteRecordRaw } from 'vue-router';


const Auth = () => import('@/layouts/AuthLayout.vue');
const Home = () => import('@/layouts/MainLayout.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
    children: [{ path: '', component: () => import('@/pages/IndexPage.vue') }],
    meta: { requiresAuth: true },
  },

  {
    path: '/auth',
    component: Auth,
    children: [{ path: '', component: () => import('@/pages/AuthPage.vue') }],
  },

  {
    path: Navigation.LEARN_DIRECTIONS,
    component: Home,
    children: [{ path: '', component: () => import('@/pages/LearnDirections.vue') }],
    meta: { requiresAuth: true },
  },

  {
    path: Navigation.MENTORS,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/persons/MentorsPage.vue') },
      { path: ':id', component: () => import('@/pages/persons/MentorPage.vue') },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: Navigation.STUDENTS,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/persons/StudentsPage.vue') },
      { path: ':id', component: () => import('@/pages/persons/StudentPage.vue') },
    ],
    meta: { requiresAuth: true },
  },

  {
    path: Navigation.SLOTS,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/MentorSlots.vue') },
    ],
    meta: { requiresAuth: true },
  },

  {
    path: Navigation.LESSONS,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/lessons/LessonsPage.vue') },
      { path: ':id', component: () => import('@/pages/lessons/LessonPage.vue') },
    ],
    meta: { requiresAuth: true },
  },

  {
    path: Navigation.CHATS,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/chats/ChatsPage.vue') },
      { path: ':id', component: () => import('@/pages/chats/ChatPage.vue') },
    ],
    meta: { requiresAuth: true },
  },

  {
    path: Navigation.MENTOR_PAYOUTS,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/payouts/MentorPayoutsPage.vue') },

    ],
    meta: { requiresAuth: true },
  },

  {
    path: Navigation.STUDENT_PAYOUTS,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/payouts/StudentPayoutsPage.vue') },

    ],
    meta: { requiresAuth: true },
  },

  {
    path: Navigation.HOMEWORKS,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/homeworks/HomeWorksPage.vue') },
      { path: ':id', component: () => import('@/pages/homeworks/HomeWorkPage.vue') },
      { path: 'create', component: () => import('@/pages/homeworks/CreateHomeWorkPage.vue') },

    ],
    meta: { requiresAuth: true },
  },

  {
    path: Navigation.PROFILE,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/persons/ProfilePage.vue') },
    ],
    meta: { requiresAuth: true },
  },

  {
    path: Navigation.GROUPS,
    component: Home,
    children: [
      { path: '', component: () => import('@/pages/persons/GroupsPage.vue') },
    ],
    meta: { requiresAuth: true },
  },


];

export default routes;
