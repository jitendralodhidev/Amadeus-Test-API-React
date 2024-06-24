import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Input, Form, message } from 'antd';
import './Login.css';

// Importing hoc
import { withRouter } from '../../hoc/withRouter';

// Importing modules
import WebAppAPI from '../../api';

const Login = (props) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (values) => {
    try {
      const res = await WebAppAPI.Login.getToken({ username: values.username, password: values.password });
      console.log(res);
      if (res.error) {
        message.error(res.error.msg);
      } else {
        message.success(res.msg);
        Cookies.set('token', res['access_token'], { expires: 1, secure: true, sameSite: 'Strict' }); // Expires in 1 day
        props.router.navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred during login.');
    }
  };

  return (
    <div className="login-form">
      <Form
        layout="vertical"
        onFinish={handleLogin}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default withRouter(Login);
