import Cookies from 'js-cookie';
import React from 'react';
import { Button, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { withRouter } from '../hoc/withRouter';

const Navbar = (props) => {
  const token = Cookies.get('token');
  const handleLogout = () => {
    Cookies.remove('token')
    props.router.navigate('/login');
  }
  return (
    <Menu mode="horizontal">
      <Menu.Item key="home">
        {token && <Link to="/">Home</Link>}
        {token && <Button style={{ marginLeft: 10 }} type="primary" onClick={handleLogout}> Logut </Button>}
      </Menu.Item>
    </Menu>
  );
};

export default withRouter(Navbar);
