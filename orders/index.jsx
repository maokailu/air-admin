import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Icon, Divider } from 'antd';
import request from '../utils/request';
import date from '../utils/date';
import TableApp from './table';
import AdvancedSearchForm from './search-box';
import './style.css';

export default class OrderUnit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    request.getPromise(`getOrders`, {}).then(json => {
      console.log('order'+json)
        if (json) {
            this.setState({
              data: json
            })
        }
    }, error => {
        console.error('出错了', error);
    });
  }
  updateData = data =>{
    this.setState({
      data: data
    })
  }
  render() {
    return (
      <div className="user">
          <AdvancedSearchForm updateData={this.updateData} />
          <div className="search-result-list">
            <TableApp data={this.state.data} updateData={this.updateData} />
          </div>
      </div>
    );
  }
}