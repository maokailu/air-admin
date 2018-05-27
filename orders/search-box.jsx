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
    {name: '订单号', index: 'orderId', message: '请输入订单号'},
    {name: '订单日期', index: 'orderDate', message: '请输入订单日期'}, 
    {name: '用户名', index: 'user.userId', message: '请输入用户账号'}];
    for (let i = 0; i < field.length; i++) {
      if(field[i].index === 'orderDate'){
        children.push(
          <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <FormItem label={field[i].name}>
              {getFieldDecorator(field[i].index)(
                <DatePicker placeholder={"请选择时间"}/>
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
  searchUsers = order =>{
    for(let item in order){
        if(item === 'orderDate') {
          const dateStr = date.format(new Date(order[item]), 'yyyy-MM-dd');
          order[item] = (new Date(dateStr)).getTime();
        }
    }
    request.getPromise(`http://localhost:8080/getOrders`, order).then(json => {
        if(json){
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