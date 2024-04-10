// routes.ts
import { RouteObject } from 'react-router-dom';
import Home from '@/view/home/index';
import About from '@/view/about/index';

// react router v6·路由配置
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: 'about2',
        element: <About />,
      },
    ],
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '*',
    element: <div>404</div>,
  }
];
export default routes;
