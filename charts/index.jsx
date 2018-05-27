import React from 'react';
import ReactDOM from 'react-dom';
// import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import request from '../utils/request';

import date from '../utils/date';
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('../utils/wonderland');
import './style.css'



// 渲染图表
class Charts extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          data: []
      }
    }
    
    componentDidMount() {
        var myChart = echarts.init(document.getElementById('myChart'),'wonderland');
        const orderDates = [];
        const orderNums = [];
        request.getPromise(`http://localhost:8080/getOrderNumByDate`).then(json => {
        if (json) {
            for(let i = 0;i<json.length;i++){
                orderDates.push(date.format(new Date(json[i].orderDate), 'yyyy-MM-dd'));
                orderNums.push(json[i].orderNum);
            }

            myChart.setOption({
                title: {
                    text: '订单量统计'
                },
                legend: {
                    data:['订单量']
                },
                tooltip: {},
                xAxis: {
                    data: orderDates || []
                },
                yAxis: {},
                series: [{
                    name: '订单量',
                    type: 'bar',
                    data: orderNums || []
                }]
            });
        }
        }, error => {
            console.error('出错了', error);
        });
    }
    render() {
        return (
            <div id="myChart" style={{ width: 1000, height: 400 }}></div>
        );
    }
}
export default Charts;