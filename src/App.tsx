// App.tsx
import { useRoutes } from 'react-router-dom';
import routes from './router'; // 导入路由配置
// import './App.less';

function App() {
  const routing = useRoutes(routes);
  return (
    <div>
      {routing}
    </div>
  );
}

export default App;
