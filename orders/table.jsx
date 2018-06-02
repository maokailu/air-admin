import { Table, Input, InputNumber, Popconfirm, Form, DatePicker, Badge, Menu, Dropdown, Icon  } from 'antd';
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
import date from '../utils/date';
// const menu = (
//   <Menu>
//     <Menu.Item>
//       Action 1
//     </Menu.Item>
//     <Menu.Item>
//       Action 2
//     </Menu.Item>
//   </Menu>
// );
// function NestedTable() {
//   const expandedRowRender = () => {
//     const columns = [
//       { title: 'Date', dataIndex: 'date', key: 'date' },
//       { title: 'Name', dataIndex: 'name', key: 'name' },
//       { title: 'Status', key: 'state', render: () => <span><Badge status="success" />Finished</span> },
//       { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' }
//     ];

//     const data = [];
//     for (let i = 0; i < 3; ++i) {
//       data.push({
//         key: i,
//         date: '2014-12-24 23:12:00',
//         name: 'This is production name',
//         upgradeNum: 'Upgraded: 56',
//       });
//     }
//     return (
//       <Table
//         columns={columns}
//         dataSource={data}
//         pagination={false}
//       />
//     );
//   };

//   const columns = [
//     { title: 'Name', dataIndex: 'name', key: 'name' },
//     { title: 'Platform', dataIndex: 'platform', key: 'platform' },
//     { title: 'Version', dataIndex: 'version', key: 'version' },
//     { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
//     { title: 'Creator', dataIndex: 'creator', key: 'creator' },
//     { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
//     { title: 'Action', key: 'operation', render: () => <a href="javascript:;">Publish</a> },
//   ];

//   const data = [];
//   for (let i = 0; i < 3; ++i) {
//     data.push({
//       key: i,
//       name: 'Screem',
//       platform: 'iOS',
//       version: '10.3.4.5654',
//       upgradeNum: 500,
//       creator: 'Jack',
//       createdAt: '2014-12-24 23:12:00',
//     });
//   }

//   return (
//     <Table
//       className="components-table-demo-nested"
//       columns={columns}
//       expandedRowRender={expandedRowRender}
//       dataSource={data}
//     />
//   );
// }

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    // if (this.props.inputType === 'number') {
    //   return <InputNumber />;
    // }
    // if(this.props.dataIndex === "userId") {
    //   return <Input disabled/>
    // }
    // if(this.props.dataIndex === "birthday"){
    //   console.log(this.props.children[2])
    //   return <Input type='date' />;
    //   // return <Input type='date' value={this.props.children[2]} />;
    // }
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
        title: '订单号',
        dataIndex: 'orderId',
        width: '8%',
        editable: true
      },
      {
        title: '用户名',
        dataIndex: 'user.userName',
        width: '5%',
        editable: true
      },
      {
        title: '用户号',
        dataIndex: 'user.userId',
        width: '10%',
        editable: true
      },
      {
        title: '联系人',
        dataIndex: 'concactName',
        width: '5%',
        editable: true
      },
      {
        title: '联系邮箱',
        dataIndex: 'email',
        width: '10%',
        editable: true
      },
      {
        title: '联系手机',
        dataIndex: 'cellphone',
        width: '10%',
        editable: true
      },
      {
        title: '订单日期',
        dataIndex: `orderDate`,
        width: '10%',
        editable: true,
        render:(text, record) => {
          return (
            date.format(new Date(record.orderDate), 'yyyy-MM-dd')
          );
        },
      },
      { title: '订单状态', width: '10%',key: 'orderState', render: (text, record) =>
      {return (record.orderState === 1 ? (<span><Badge status="success" />Finished</span>) :
      (<span><Badge status="error" />Canceled</span>)) }},
      {
        title: '票价',
        dataIndex: 'totalTicketPrice',
        width: '5%',
        editable: true
      },
      // {
      //   title: '基建燃油费',
      //   dataIndex: 'totalFuelSurcharge',
      //   width: '5%',
      //   editable: true
      // },
      {
        title: '税费',
        dataIndex: 'totalAirportTax',
        width: '5%',
        editable: true
      },
      {
        title: '订单总价',
        dataIndex: 'totalPrice',
        width: '10%',
        editable: true
      },
      // {
      //   title: '操作',
      //   width: '10%',
      //   dataIndex: 'operation',
      //   // rowKey: 'operation',
      //   render: (text, record) => {
      //     const editable = this.isEditing(record);
          
      //     return (
      //       <div>
      //         {editable ? (
      //           <span>
      //             <EditableContext.Consumer>
      //               {form => (
      //                 <a
      //                   href="javascript:;"
      //                   onClick={() => this.validate(form, record.orderId)}
      //                   style={{ marginRight: 8 }}
      //                 >
      //                   保存
      //                 </a>
      //               )}
      //             </EditableContext.Consumer>
      //             <Popconfirm
      //               title="确定取消?"
      //               onConfirm={() => this.cancel(record.orderId)}
      //             >
      //               <a>取消</a>
      //             </Popconfirm>
      //           </span>
      //         ) : (
      //           <a onClick={() => this.edit(record.orderId)}>编辑</a>
      //         )}
      //         <a className="delete-btn" href="javascript:;" onClick={()=>this.removeUser(record.orderId)}>删除</a>
      //       </div>
      //     );
      //   },
      // },
    ];
  }
  formatDate = () =>{
    console.log('h')
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
    const expandedRowRender = record => {
      let columns = [
        { title: '子订单号', width: '4%', dataIndex: `orderItemId`, key: 'orderItemId' },
        { title: '乘客', width: '3%', dataIndex: 'passenger.name', key: 'passenger.name' },
        { title: '身份证号',  width: '4%',dataIndex: 'passenger.cardNumber', key: 'passenger.cardNumber' },
        { title: '机票号', width: '4%', dataIndex: 'ticket.ticketId', key: 'ticket.ticketId'},
        { title: '航班号', width: '4%', dataIndex: 'ticket.flightId', key: 'ticket.flightId'},
        { title: '票价', width: '2%', dataIndex: 'ticket.ticketPrice', key: 'ticket.ticketPrice'},
        { title: '税费', width: '2%', dataIndex: 'ticket.airportTax', key: 'ticket.airportTax'},
        // { title: '燃油费', width: '2%', dataIndex: 'ticket.fuelCharge', key: 'ticket.fuelCharge'},
        { title: '类型', width: '3%', dataIndex: 'ticket.cabinClass.cabinClassName', key: 'ticket.cabinClass.cabinClassName'},
        { title: '出发城市', width: '2%', dataIndex: 'ticket.flight.departCityName', key: 'ticket.flight.departCityName'},
        { title: '到达城市', width: '2%', dataIndex: 'ticket.flight.arriveCityName', key: 'ticket.flight.arriveCityName'},
        { title: '出发机场',  width: '3%',dataIndex: 'ticket.flight.departAirportName', key: 'ticket.flight.departAirportName'},
        { title: '到达机场',  width: '3%',width: '5%',dataIndex: 'ticket.flight.arriveAirportName', key: 'ticket.flight.arriveAirportName'},
        { title: '去程时间', width: '4.5%',dataIndex: 'ticket.flight.departTime', key: 'ticket.flight.departTime',
        render:(text, record) => {
          return (
            date.format(new Date(record.ticket.flight.departTime), 'yyyy-MM-dd hh:mm:ss')
          );
        },},
        { title: '返程时间', width: '4.5%',dataIndex: 'ticket.flight.returnTime', key: 'ticket.flight.returnTime',
        render:(text, record) => {
          return (
            date.format(new Date(record.ticket.flight.returnTime), 'yyyy-MM-dd hh:mm:ss')
          );
        },}
      ];
      return (
        <Table
          columns={columns}
          dataSource={record.orderItems}
          pagination={false}
        />
      );
    };
    return (
      <Table
        components={components}
        bordered
        dataSource={this.props.data}
        columns={columns}
        rowClassName="editable-row"
        expandedRowRender={expandedRowRender}
        size='small'
      >
      </Table>
    );
  }
}