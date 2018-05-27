import React from 'react';
import ReactDOM from 'react-dom';
// import { LocaleProvider, DatePicker, message, Tree,Table, Icon, Divider } from 'antd';
// 默认文案是英文，所以需要修改为中文
import { Layout, Menu, Icon, Tabs } from 'antd';
const { Header, Sider, Content } = Layout;
const TabPane = Tabs.TabPane;
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import UserUnit from './user/';
import OrderUnit from './orders';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import PropTypes from 'prop-types';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,HashRouter
} from 'react-router-dom';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      date: '',
    };
  }
  // static contextTypes = {
  //     router: PropTypes.object.isRequired
  // }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  goToUser=()=>{
    debugger
    const path = {
      pathname: `/user`,
      // search: query
    };
    this.context.router.history.push(path);
  }
  render() {
    return (
      <div>
        <HashRouter>
          <Layout 
              style={{height:'100vh'}}>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
            >
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Icon type="home" />
                  <span><Link to="/" className='home'>主页</Link></span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="user" />
                  <span><Link to={{pathname: 'user',state: { fromDashboard: true }}} className='user-unit-link'>用户管理</Link></span>
                </Menu.Item>
                <Menu.Item key="3">
                  <Icon type="video-camera" />
                  <span><Link to="/orders" className='orders-unit-link'>订单管理</Link></span>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Header>
              <Route path="/">
                {/* <div>您好，这里是航空订票系统！</div> */}
              </Route>
              <Route path="/user" component={UserUnit}/>
              <Route path="/orders" component={OrderUnit} />
            </Layout>
          </Layout>
        </HashRouter>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));