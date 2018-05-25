import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Icon, Divider } from 'antd';
import request from '../utils/request';
// import EditableTable from './editable-table';

export default class UserUnit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '', 
      userData: ''
    };
  }
  componentDidMount() {
    // request.getPromise(`http://localhost:8080/getUsers?`, null).then(json => {
    //     if (json && json.length !== 0) {
    //         this.setState({
    //           userData: json
    //         })
    //     }
    // }, error => {
    //     console.error('出错了', error);
    // });
  }
  render() {
    const columns = [{
      title: '用户编号',
      dataIndex: 'userId', //对应于数据列名
      key: 'userId',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
    },{
      title: '身份证号',
      dataIndex: 'idCardNumber',
      key: 'idCardNumber',
    },{
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },{
      title: '生日',
      dataIndex: 'birthday',
      key: 'birthday',
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;">编辑 {record.name}</a>
          <Divider type="vertical" />
          <a href="javascript:;">删除</a>
          <Divider type="vertical" />
          <a href="javascript:;" className="ant-dropdown-link">
            更多操作 <Icon type="down" />
          </a>
        </span>
      ),
    }];
    return (
      <div>
        {/* <EditableTable /> */}
      </div>
    );
  }
}