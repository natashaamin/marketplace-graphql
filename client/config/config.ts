import { defineConfig } from 'umi';

console.log(process.env.NODE_ENV)

export default defineConfig({
  // using hash - server doesn't need to know about the SPA routes.
  history: {
    type: 'hash'
  },
  routes: [
    {
      name: '404',
      path: '*',
      component: '@/pages/404',
    },
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
          path: '/dashboard',
          name: "Dashboard",
          component: '@/pages/Dashboard'
        },
      ]
    },
  ],
  proxy: {
    '/api': {
      'target': process.env.NODE_ENV === 'development' ? 'http://localhost:3001/' : 'https://marketplace-server-69nj.onrender.com/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
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
