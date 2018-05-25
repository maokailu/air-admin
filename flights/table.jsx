import { Table, Input, InputNumber, Popconfirm, Form, DatePicker } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
const data = [];
const FormItem = Form.Item;
const EditableContext = React.createContext();
import request from '../utils/request';
import './style.css';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    if(this.props.dataIndex === "userId") {
      return <Input disabled/>
    }
    if(this.props.dataIndex === "birthday"){
      console.log(this.props.children[2])
      return <Input type='date' />;
      // return <Input type='date' value={this.props.children[2]} />;
    }
    return <Input />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      {
        title: '航班号',
        dataIndex: 'flightId',
        width: '10%',
        editable: true
      },
      {
        title: '操作',
        dataIndex: 'operation',
        // rowKey: 'operation',
        render: (text, record) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.validate(form, record.userId)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确定取消?"
                    onConfirm={() => this.cancel(record.userId)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <a onClick={() => this.edit(record.userId)}>编辑</a>
              )}
              <a className="delete-btn" href="javascript:;" onClick={()=>this.removeUser(record.userId)}>删除</a>
            </div>
          );
        },
      },
    ];
  }
  removeUser = key => {
    const userId = `userId=${key}`
    request.getPromise(`http://localhost:8080/deleteUser?${userId}`).then(json => {   
      const newData = [...this.props.data];
      const data = newData.filter((user, index) => {
        return (user.userId !== key)}
      );
      this.props.updateData(data);
    }, error => {
        console.error('出错了', error);
    });
  }
  isEditing = (record) => {
    return record.userId === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  validate(form, key) {
    const hasNotSave = false;
    if(hasNotSave) {
      return;
    }
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      this.updateUser(form, key, row);
    });
  }
  updateUser = (form, key, row) => {
    const user = {};
    for(let item in row){
        if(item === 'birthday') {
          user[item] = (new Date(row[item])).getTime();
        } else {
          user[item] = row[item];
        }
    }
    console.log(user);
    request.getPromise(`http://localhost:8080/updateUser`, row).then(json => {
        this.save(form, key, row);
    }, error => {
        console.error('出错了', error);
    });
  }
  save = (form, key, row) => {
    const newData = [...this.props.data];
    const index = newData.findIndex(item => key === item.userId);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      this.props.updateData(newData);
      this.setState({ editingKey: '' });
    } else {
      newData.push(data);
      this.props.updateData(newData);
      this.setState({ editingKey: '' });
    }
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  getInputType = col => {
    col.dataIndex === 'age' ? 'number' : 'text';
  };
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: this.getInputType(col),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Table
        components={components}
        bordered
        dataSource={this.props.data}
        columns={columns}
        rowClassName="editable-row"
      />
    );
  }
}