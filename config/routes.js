export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '登录',
    path: '/login',
    hideInMenu: true,
    layout: false,
    component: './login',
  },
  {
    name: '场地看板',
    icon: 'home',
    path: '/home',
    component: '@/pages/home',
  },
  {
    name: '基本数据',
    icon: 'DeploymentUnitOutlined',
    path: '/basicData',
    routes: [
      { path: '/basicData', redirect: '/basicData/organization' },
      {
        name: '组织机构',
        path: '/basicData/organization',
        component: '@/pages/basicData/organization',
      },
      {
        name: '角色管理',
        path: '/basicData/role',
        component: '@/pages/basicData/role',
      },
      {
        name: '区域和房间',
        path: '/basicData/venueArea',
        component: '@/pages/basicData/venueArea',
      },
    ],
  },
  {
    name: '系统设置',
    icon: 'SettingOutlined',
    path: '/sys',
    routes: [
      { path: '/sys', redirect: '/sys/dict' },
      {
        name: '数据字典',
        path: '/sys/dict',
        component: '@/pages/sys/dict',
      },
      {
        name: '资源管理',
        path: '/sys/menus',
        component: '@/pages/sys/menus',
      },
      {
        name: '操作日志',
        path: '/sys/optLog',
        component: '@/pages/sys/optLog',
      },
    ],
  },
];
