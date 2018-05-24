import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider, DatePicker, message, Tree,Table, Icon, Divider } from 'antd';
// 默认文案是英文，所以需要修改为中文
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import MenuApp from './menu';
// import UserUnit from './table';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
    };
  }
  render() {
    return (
      <div>
        <MenuApp />
        {/* <UserUnit/> */}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));