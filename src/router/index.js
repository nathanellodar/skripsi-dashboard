import { createRouter, createWebHistory } from 'vue-router';
import AuthLayout from '../layouts/AuthLayout.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import Login from '../pages/Login.vue';
import Setup from '../pages/Setup.vue';
import Dashboard from '../pages/Dashboard.vue';
import { checkSetup } from '../api/gateway';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login
      }
    ]
  },
  {
    path: '/setup',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'Setup',
        component: Setup
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Simple auth guard
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  
  // Only check setup status if user is navigating to login, setup, or root, 
  // and is not authenticated. If they are authenticated, they have an account.
  let isSetupRequired = false;
  if (!isAuthenticated && (to.path === '/login' || to.path === '/setup' || to.path === '/')) {
    try {
      isSetupRequired = await checkSetup();
    } catch (e) {
      console.error('Failed to check setup status', e);
    }
  }

  if (isSetupRequired && to.path !== '/setup') {
    next('/setup');
  } else if (!isSetupRequired && to.path === '/setup') {
    next('/login');
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
