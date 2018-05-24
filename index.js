import React from 'react';
import ReactDOM from 'react-dom';
// import { LocaleProvider, DatePicker, message, Tree,Table, Icon, Divider } from 'antd';
// 默认文案是英文，所以需要修改为中文
import { Layout, Menu, Icon, Tabs } from 'antd';
const { Header, Sider, Content } = Layout;
const TabPane = Tabs.TabPane;
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import UserUnit from './table';
import FlightsUnit from './flights';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import './index.css';
import CollectionsPage from './form'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      date: '',
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    return (
      <div>
        <Router>
          <Layout>
            <Sider
              trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              style={{ height: '100vh' }}
            >
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Icon type="user" />
                  <span><Link to="/" className='user-unit-link'>用户管理</Link></span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="video-camera" />
                  <span><Link to="/flights-unit" className='flights-unit-link'>航班管理</Link></span>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <div>
                <Header style={{ background: '#fff', padding: 0 }}>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                </Header>
                <CollectionsPage />
              </div>
              <Route path="/" component={UserUnit} />
              <Route path="/flights-unit" component={FlightsUnit} />
            </Layout>
          </Layout>
        </Router>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));