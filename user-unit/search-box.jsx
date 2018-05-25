import { Form, Row, Col, Input, Button, Icon } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
const FormItem = Form.Item;
import request from '../utils/request';

class AdvancedSearchForm extends React.Component {
  state = {
    expand: false,
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
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
    const field = [{name: '姓名', index: 'userName', message: '请输入姓名'}, 
    {name: '密码', index: 'password', message: '请输入密码'}];
    for (let i = 0; i < field.length; i++) {
      children.push(
        <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
          <FormItem label={field[i].name}>
            {getFieldDecorator(field[i].index, {
              rules: [{
                required: true,
                message: field[i].message,
              }],
            })(
              <Input placeholder={field[i].message} />
            )}
          </FormItem>
        </Col>
      );
    }
    console.log(this.props.form.getFieldsValue());
    const userInfo = this.props.form.getFieldsValue();
    this.searchUsers(userInfo);
    return children;
  }
  searchUsers = userInfo =>{
    request.getPromise(`http://localhost:8080/getUsersBySearch?`, userInfo).then(json => {
        console.log(json);
        this.setState({
            data: json
        })
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
            <Button type="primary" htmlType="submit">Search</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              Clear
            </Button>
            <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
              Collapse <Icon type={this.state.expand ? 'up' : 'down'} />
            </a>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create()(AdvancedSearchForm);
export default WrappedAdvancedSearchForm;