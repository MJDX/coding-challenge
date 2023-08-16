import { createRouter, createWebHistory } from 'vue-router';
import HomeVue from '../components/home/Home.vue';
import LoginVue from '../components/login/Login.vue';
import RegisterVue from '../components/register/Register.vue';
import QuestionnaireListVue from '../components/questionnaire/QuestionnaireList.vue';
import QuestionnaireSessionListVue from '../components/questionnaire/session/QuestionnaireSessionList.vue';
import QuestionnaireSessionViewVue from '../components/questionnaire/session/QuestionnaireSessionView.vue';
import QuestionnaireSessionEditVue from '../components/questionnaire/session/QuestionnaireSessionEdit.vue';



const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeVue,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginVue,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterVue,
  },
  {
    path: '/questionnaire',
    name: 'QuestionnaireList',
    component: QuestionnaireListVue,
  },
  {
    path: '/questionnaire/:questionnaireId',
    name: 'QuestionnaireSessionList',
    component: QuestionnaireSessionListVue,
    props: true,
  },
  {
    path: '/questionnaire/:questionnaireId/session/:sessionId/view',
    name: 'QuestionnaireSessionView',
    component: QuestionnaireSessionViewVue,
    props: true,
  },
  {
    path: '/questionnaire/:questionnaireId/session/:sessionId/edit',
    name: 'QuestionnaireSessionEdit',
    component: QuestionnaireSessionEditVue,
    props: true,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;