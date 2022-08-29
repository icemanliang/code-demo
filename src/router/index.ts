import { router } from 'framework';

router.addRouterModule([
  {
    path: '/account/write',
    name: 'write',
    component: () => import('../pages/Privacy.vue')
  },
  {
    path: '/portal/settings/account',
    beforeEnter: async (to, from, next) => {
      console.log(next);
    },
    component: () => import('../pages/BasicSettings.vue')
  },
]);

console.log(location.href);
