import { Button, Checkbox, Form, Input} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type {RootState} from '@/store/store'
import {counterSlice} from '@/store/homeSlice'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './index.module.less';
function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const value = useSelector((state:RootState)=>state.home.value)
  console.log(value,'value')
  useEffect(()=>{
    dispatch(counterSlice.actions.resetUser()) 
  },[])
  const onFinish = (values: unknown) => {
    console.log('Success:', values);
    dispatch(counterSlice.actions.increment())
  };
  const goAbout = () =>{
    navigate('/about')
  }
  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <>
      <div className={styles.red}>
         {value}
         <div className={styles.green}>
         {value + 1}
         </div>
      </div>
      <Button type="primary" onClick={goAbout}>primary</Button>
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input placeholder="input placeholder"/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </>
  )
}

export default Home
