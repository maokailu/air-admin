import { Button, Modal, Form, Input, Radio,Select,DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import React from 'react';
import request from '../utils/request';
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    state = {
      confirmDirty: false
    };
    validateToNextPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && this.state.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    }
    compareToFirstPassword = (rule, value, callback) => {
      const form = this.props.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('两次密码不一致!');
      } else {
        callback();
      }
    }
    handleConfirmBlur = (e) => {
      const value = e.target.value;
      this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    handleSubmit = (e) => {
      e.preventDefault();
  
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) {
          return;
        }
        const rangeValue = fieldsValue['range-picker'];
        const rangeTimeValue = fieldsValue['range-time-picker'];
        const values = {
          ...fieldsValue,
          'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD')
        };
        console.log('Received values of form: ', values);
      });
    }
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const config = {
        rules: [{ type: 'object', required: true, message: '请选择出生日期！' }],
      };
      const rangeConfig = {
        rules: [{ type: 'array', required: true, message: '请选择出生日期！' }],
      };
      const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '86',
      })(
        <Select style={{ width: 70 }}>
          <Option value="86">+86</Option>
          <Option value="87">+87</Option>
        </Select>
      );
      return (
        <Modal
          visible={visible}
          title="添加一个新用户"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="姓名">
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入姓名!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }, {
                  validator: this.validateToNextPassword,
                }],
              }
            )(<Input type="password" />)}
            </FormItem>
            <FormItem label="确认密码">
              {getFieldDecorator('confirm', {
                rules: [{ required: true, message: '请输入密码!' }, {
                  validator: this.compareToFirstPassword,
                }],
              }
            )(<Input type="password" onBlur={this.handleConfirmBlur} />)}
            </FormItem>            
            <FormItem
              // {...formItemLayout}
              label="出生日期"
            >
              {getFieldDecorator('birthday', config)(
                <DatePicker />
              )}
            </FormItem>
            <FormItem
              label="性别"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('gender', {
                rules: [{ required: true, message: '请选择用户性别!' }],
              })(
                <Select
                  placeholder="选择用户性别"
                >
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="手机号"
              >
              {getFieldDecorator('phone', {
                rules: [{ required: true, message: '请输入手机号!' }],
              })(
                <Input type="number" addonBefore={prefixSelector} style={{ width: '100%' }}/>
              )}
            </FormItem>
            <FormItem label="身份证号"
              >
              {getFieldDecorator('idCardNumber', {
                rules: [{ required: true, message: '请输入身份证号!' }],
              })(
                <Input type="number"/>
              )}
              </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

export default class CollectionsPage extends React.Component {
  state = {
    visible: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      for(let key in values){
          if(key === 'birthday') {
            values[key] = values[key]._d.getTime();
          }
      }
      const params = values;
      delete params.prefix;
      delete params.confirm;
      request.getPromise(`http://localhost:8080/addUser`, values).then(json => {
        if(json === 0) {
          console.log("未知原因，插入失败,请返回或重试！");
          return;
        };
        request.getPromise(`http://localhost:8080/getUsers`, null).then(json => {
          if(!json || json.length === 0) {
            console.log("没有获取到数据！");
            return;
          };
          this.props.updateData(json);
          this.setState({ visible: false });
          form.resetFields();
        }, error => {
            console.error('出错了', error);
        });
      }, error => {
          console.error('出错了', error);
      });
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>添加用户</Button>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}