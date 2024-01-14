import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    {
      path: '/',
      component: '@/pages/Layouts',
      routes: [
        {
          path: '/login',
          name: "Login",
          component: '@/pages/Login'
        },
        {
          path: '/',
          name: "Dashboard",
          component: '@/pages/Dashboard'
        },
      ]
    },
  ],
  locale: {
    antd: true,
    baseNavigator: true,
    baseSeparator: '-',
    default: 'en-US',
    title: false,
    useLocalStorage: true,
  },
  fastRefresh: true,
  // styledComponents: {},
});
