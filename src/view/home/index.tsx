import { Button } from 'antd';
import './index.less';
function Home() {
  console.log(import.meta.env.MODE)
  return (
    <>
      <div className='red'>home1</div>
      <Button type="primary">Button</Button>
    </>
  )
}

export default Home
