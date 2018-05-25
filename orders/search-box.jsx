import { Form, Row, Col, Input, Button, Icon, DatePicker,Select } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
const FormItem = Form.Item;
import request from '../utils/request';
const Option = Select.Option;
import date from '../utils/date';

class AdvancedSearchForm extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      
      const user = this.props.form.getFieldsValue();
      this.searchUsers(user);
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  // To generate mock Form.Item
  getFields() {
    const count = this.state.expand ? 10 : 6;
    const { getFieldDecorator } = this.props.form;
    const children = [];
    const field = [
    {name: '账号', index: 'userId', message: '请输入账号'},
    {name: '姓名', index: 'userName', message: '请输入姓名'}, 
    {name: '性别', index: 'gender', message: '请输入性别'}, 
    {name: '电话', index: 'phone', message: '请输入电话'}, 
    {name: '身份证号', index: 'idCardNumber', message: '请输入身份证号'},
    {name: '出生日期', index: 'birthday', message: '请输入出生日期'}];
    for (let i = 0; i < field.length; i++) {
      if(field[i].index === 'birthday'){
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={field[i].name}>
              {getFieldDecorator(field[i].index)(
                <DatePicker placeholder={"请选择时间"}/>
              )}
            </FormItem>
          </Col>
        );
      }else if(field[i].index === 'gender'){
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={field[i].name}>
              {getFieldDecorator(field[i].index, {
                rules: [{
                  message: field[i].message,
                }],
              })(
                <Select
                  placeholder="选择用户性别"
                >
                  <Option value="">全选</Option>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        );
      }else if(field[i].index === 'userId'){
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={field[i].name}>
              {getFieldDecorator(field[i].index, {
                rules: [{
                  message: field[i].message,
                }],
              })(
                <Input placeholder={field[i].message} />
              )}
            </FormItem>
          </Col>
        );
      }else{
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={field[i].name}>
              {getFieldDecorator(field[i].index, {
                rules: [{
                  message: field[i].message,
                }],
              })(
                <Input placeholder={field[i].message} />
              )}
            </FormItem>
          </Col>
        );
      }
    }
    console.log(this.props.form.getFieldsValue());
    return children;
  }
  searchUsers = user =>{
    for(let item in user){
        if(item === 'birthday') {
          const dateStr = date.format(new Date(user[item]), 'yyyy-MM-dd');
          user[item] = (new Date(dateStr)).getTime();
        }
    }
    request.getPromise(`http://localhost:8080/getUsersBySearch`, user).then(json => {
        if(json && json.length!==0){
          this.props.updateData(json);
        }
    }, error => {
        console.error('出错了', error);
    });
  }
  render() {
    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.handleSearch}
      >
        <Row gutter={24}>{this.getFields()}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              清空
            </Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              收起 <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);
export default WrappedAdvancedSearchForm;