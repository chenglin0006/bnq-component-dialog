import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Form,Button} from 'antd'
import CommonComponent from '../../src/index'
import moment from 'moment'

const WrappedAdvancedNew=Form.create()(CommonComponent);

class App extends Component {
    constructor(props) {
        super(props);
        this.testClick = this.testClick.bind(this);
        this.state={
            showDialogStatus:false
        }

    }
    testClick(){
        console.log('123123');
    }
  render() {
      const treeData = [{
          title: 'Node1',
          value: '0-0',
          key: '0-0',
          children: [{
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
              selectable:false
          }, {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
          }],
      }, {
          title: 'Node2',
          value: '0-1',
          key: '0-1',
      }];

      const cascaderData = [{
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [{
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [{
                  value: 'xihu',
                  label: 'West Lake',
              }],
          }],
      }, {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [{
              value: 'nanjing',
              label: 'Nanjing',
              children: [{
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
              }],
          }],
      }];
        const props={
            title:'弹窗标题',
            formData:[
                {
                    id: 'detailId',
                    name:'详情',
                    initialValue:'详情显示',
                    type:'detail',
                    className:'detail-style'
                },
                {
                id: 'inputId',
                name:'testInput',
                    isRequired:true
            },
                {
                id: 'verifyResult',
                type:'radio',
                name:'testRadio',
                data:[{name:'通过',id:2},{name:'拒绝',id:3}],
                initialValue:2,
                isRequired:true
            },{
                id: 'remark',
                type:'textarea',
                name:'testTexearea'
            },{
                id: 'closeReason',
                type:'select',
                data:[{name:'原因1',id:2},{name:'原因2',id:3}],
                name:'testSelect',
                initialValue:3,
                isRequired:true,
                isHidePleaseSelect:true
            },
                {
                id: 'time',
                type:'rangedatepicker',
                name:'Rangedate',
                showTime:true
            },
                {
                    id: 'subscriptionAmount',
                    name: '金额',
                    type: 'number',
                    min:0,
                    max:1000000,
                    formatter:(value) => `${value}元`,
                    desc:'test desc',
                    parse:value => value.replace(/[^\d.]/g,"").replace(/^\./g,"").replace(/\.{2,}/g,".").replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'),
                },
                {
                id: 'timePick',
                type:'datepicker',
                name:'时间点',
                showTime:false,
                initialValue:moment('2018-09-20','YYYY-MM-DD'),
            }, {
                id:'treeSelect',
                type:'treeSelect',
                treeData:treeData,
                showSearch:false,
                allowClear:true,
                    name:'树形选择器',
                    placeholder:'请选择',
                    initialValue:'0-0-2',
                    multiple:true
            },
            {
                id: 'cardTypeList',
                name: 'cascader',
                type:'cascader',
                className:'block-div cascader-div',
                placeholder:'请选择',
                options:cascaderData,
                changeOnSelect:false,//是否允许选中父级
                onChange :(value, selectedOptions)=>{},
                loadData:(selectedOptions)=>{},
                expandTrigger:'hover'
            },
            ],
            dialogWidth:700,
            dialogHeight:550,
            dialogButton:[{
                text: '取消',
                actionType:'cancel',
                clickHandle: () => {
                        console.log('close');
                        this.setState({
                            showDialogStatus:false
                        })
                    }
                },
                {
                    text: '确认',
                    type: 'primary',
                    actionType:'submit',
                    clickHandle: (values) => {
                        console.log(values);
                        this.setState({
                            showDialogStatus:false
                        })
                    }
                }],
            dialogContent:{
                titles:[
                    {field: "msg", text: "结果", type: "text"},
                    {field: "includeStr", text: "Inc/Exc", type: "text"}
                ],
                values:[
                    {id: 1, includeStr: "exclude", skuCode: "9999990", skuName: null, code: 2, msg: "该活动商品类别只能为包含"}
                ]
            }
        }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <Button onClick={()=>{
              this.setState({
                  showDialogStatus: true
              })
          }}>打开弹窗</Button>
          {this.state.showDialogStatus?<div>
              <WrappedAdvancedNew {...props}></WrappedAdvancedNew>
          </div>:''}
      </div>
    );
  }
}

export default App;
