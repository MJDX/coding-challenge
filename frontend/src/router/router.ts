import { createRouter, createWebHistory } from 'vue-router';
import HomeVue from '../components/home/Home.vue';
import LoginVue from '../components/login/Login.vue';
import RegisterVue from '../components/register/Register.vue';
import QuestionnaireListVue from '../components/questionnaire/QuestionnaireList.vue';
import QuestionnaireSessionListVue from '../components/questionnaire/session/QuestionnaireSessionList.vue';
import QuestionnaireSessionViewVue from '../components/questionnaire/session/QuestionnaireSessionView.vue';
import QuestionnaireSessionEditVue from '../components/questionnaire/session/QuestionnaireSessionEdit.vue';
import { useAuthStore } from '../store/store';




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
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterVue,
    meta: { requiresAuth: false },
  },
  {
    path: '/questionnaire',
    name: 'QuestionnaireList',
    component: QuestionnaireListVue,
    meta: { requiresAuth: true },
  },
  {
    path: '/questionnaire/:questionnaireId',
    name: 'QuestionnaireSessionList',
    component: QuestionnaireSessionListVue,
    props: true,
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if the user is authenticated
    if (authStore.isAuthenticated) {
      next(); // User is authenticated, proceed to the route
    } else {
      next('/login'); // User is not authenticated, redirect to login page
    }
  } else {
    // Check if the user is authenticated
    if (authStore.isAuthenticated) {
      // Redirect to Home only if the route is /login or /register
      if (to.path === '/login' || to.path === '/register') {
        next('/'); // Redirect to Home
      } else {
        next(); // User is authenticated, proceed to the route
      }
    } else {
      next(); // Route does not require authentication, proceed
    }
  }
});

export default router;