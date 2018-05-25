import React from 'react';
import ReactDOM from 'react-dom';
import {Table, Icon, Divider } from 'antd';
import request from '../utils/request';
import TableApp from './table';
import AdvancedSearchForm from './search-box';

export default class UserUnit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div>
        <div>
          <AdvancedSearchForm />
          <div className="search-result-list">
            <TableApp />
          </div>
         </div>,
      </div>
    );
  }
}