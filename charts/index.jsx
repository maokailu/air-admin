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
        this.createBarChart();
        this.createPieChart();
    }
    createBarChart = () => {
        var myChart = echarts.init(document.getElementById('myChart'));
        const orderDates = [];
        const orderNums = [];
        var yMax = 25;
        var dataShadow = [];

        

        request.getPromise(`http://localhost:8080/getOrderNumByDate`).then(json => {
        if (json) {
            for(let i = 0;i<json.length;i++){
                orderDates.push(date.format(new Date(json[i].orderDate), 'yyyy-MM-dd'));
                orderNums.push(json[i].orderNum);
            }
            for (var i = 0; i < orderDates.length; i++) {
                dataShadow.push(yMax);
            }
            myChart.setOption({
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'line'
                    }
                },
                title: {
                    text: '订单量统计'
                },
                legend: {
                    data:['订单量']
                },
                tooltip: {},
                xAxis: {
                    data: orderDates || [],
                    axisLabel: {
                        inside: true,
                        textStyle: {
                            // color: '#fff'
                        }
                    },
                    z: 10
                },
                yAxis: {
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    }
                },
                series: [
                    { // For shadow
                        type: 'bar',
                        itemStyle: {
                            normal: {color: 'rgba(0,0,0,0.05)'}
                        },
                        barGap:'-100%',
                        barCategoryGap:'40%',
                        data: dataShadow,
                        animation: false
                    },
                    {
                        type: 'bar',
                        markLine : {
                            lineStyle: {
                                normal: {
                                    type: 'dashed'
                                }
                            },
                            data : [
                                [{type : 'min'}, {type : 'max'}]
                            ]
                        },
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#83bff6'},
                                        {offset: 0.5, color: '#188df0'},
                                        {offset: 1, color: '#188df0'}
                                    ]
                                )
                            },
                            emphasis: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        data: orderNums || []
                    }
                ]
            });
        }
        }, error => {
            console.error('出错了', error);
        });
    }
    createPieChart = () =>{
        var pieChart = echarts.init(document.getElementById('pieChart'));
        const orderDates = [];
        const orderNums = [];
        const data = [];

        

        request.getPromise(`http://localhost:8080/getOrderNumByDate`).then(json => {
        if (json) {
            for(let i = 0;i < 6;i++){
                orderDates.push(date.format(new Date(json[i].orderDate), 'yyyy-MM-dd'));
                data.push({'name': date.format(new Date(json[i].orderDate), 'yyyy-MM-dd') , 'value': json[i].orderNum});
                console.log(orderDates)
            }
            pieChart.setOption(
                { 
                    title : {
                    text: '订单分布',
                    subtext: '',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: orderDates
                },
                series : [
                    {
                        name: '日期',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data: data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
        }
        }, error => {
            console.error('出错了', error);
        });

    }
    render() {
        return (
            <div>
                <div id="myChart" style={{ width: 1200, height: 400 }}></div>
                <div id="pieChart" style={{ width: 1200, height: 400, marginLeft: '200px' }}></div>
            </div>
        );
    }
}
export default Charts;