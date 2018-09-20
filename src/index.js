import React, {Component} from 'react';
import {Form, Input, Button, Select, DatePicker, InputNumber, Checkbox, Switch, Radio} from 'antd';
import PropTypes from 'prop-types';
import './index.less';
import * as Util from "./util";
import locale from 'antd/lib/date-picker/locale/zh_CN';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const {TextArea} = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;


export default class DialogForm extends Component {
    constructor(props) {
        super(props);

        this._handelSubmit = this._handelSubmit.bind(this);
        this._getFields = this._getFields.bind(this);
        this._getFormItem = this._getFormItem.bind(this);
    }

    componentWillMount() {
        this.props.getCommonSelect && this.props.getCommonSelect();
    }

    _handelSubmit(e,item) {
        e.preventDefault();
        //不需要校验表单的直接执行
        if(item.actionType!='submit'){
            item.clickHandle();
            return
        }
        this.props.form.validateFields((err, values) => {
            //redux调接口
            if (!err) {
                //如果有CheckBox类型的，将true改成1，undefined改为0
                let datas = this.props.formData;
                if (datas) {
                    datas.forEach((data) => {
                        if (data.type === 'checkbox') {
                            let value = values[data.id];
                            values[data.id] = value ? 1 : 0;
                        }
                        if (data.type === 'switch') {
                            let value = values[data.id];
                            values[data.id] = value ? 1 : 0;
                        }
                        if (data.type === 'select') {
                            let value = values[data.id];
                            values[data.id] = value === 'undefined' ? undefined : value;
                        }
                        if (data.type === 'rangedatepicker'){
                            let arry = [];
                            values[data.id]&&values[data.id].forEach((ele,index)=>{
                                if(data.showTime){
                                    arry.push(Util.msToDate(new Date(ele)).hasTime);
                                } else {
                                    arry.push(Util.msToDate(new Date(ele)).withoutTime);
                                }

                            })
                            values[data.id] = arry
                        }
                        if (data.type === 'datepicker'){
                                let time = ''
                                if(data.showTime){
                                    time=(Util.msToDate(new Date(values[data.id])).hasTime);
                                } else {
                                    time=(Util.msToDate(new Date(values[data.id])).withoutTime);
                                }
                            values[data.id] = time
                        }
                    });
                }
                item.clickHandle(values);
            }
        });
    }

    _getFormItem(option) {
        switch (option.type) {
            case 'select':
                return (
                    <Select mode={option.mode} disabled={option.disabled} className={'select'}>
                        {option.isHidePleaseSelect ? null : <Option key="undefined" value="undefined">请选择</Option>}
                        {option.data && option.data.map((item, key) => <Option key={key} value={item.id}>{item.name}</Option>)}
                    </Select>
                );
                break;
            case 'datepicker':
                let dateFormatPick = 'YYYY-MM-DD';
                if(option.showTime){
                    dateFormatPick = 'YYYY-MM-DD HH:mm:ss';
                }
                return <DatePicker locale={locale} disabled={option.disabled} showTime={option.showTime?true:false} format={dateFormatPick}/>;
                break;
            case 'rangedatepicker':
                let dateFormat = 'YYYY-MM-DD';
                if(option.showTime){
                    dateFormat = 'YYYY-MM-DD HH:mm:ss';
                }
                return <RangePicker locale={locale} disabled={option.disabled} showTime={option.showTime?true:false} format={dateFormat}/>
                break;
            case 'switch':
                return <Switch disabled={option.disabled} checkedChildren="是" unCheckedChildren="否"/>;
                break;
            case 'textarea':
                return <TextArea disabled={option.disabled} cols={30} rows={4}/>;
                break;
            case 'number':
                return <InputNumber disabled={option.disabled} min={option.min} max={option.max} formatter={option.formatter} parser={option.parse}/>;
                break;
            case 'checkbox':
                return <CheckboxGroup disabled={option.disabled} className={option.className}>
                    {option.data && option.data.map((item,key) => <Checkbox key={key} value={item.id}>{item.name}</Checkbox>)}
                </CheckboxGroup>
                    ;
                break;
            case 'radio' :
                return <RadioGroup disabled={option.disabled} name={option.id} onChange={option.onChange}>
                    {option.data && option.data.map((item,key) => <Radio key={key} value={item.id}>{item.name}</Radio>)}
                </RadioGroup>
                break;
            case 'label' :
                return <label>{option.initialValue}</label>
                break;
            default:
                return <Input disabled={option.disabled} maxLength={option.maxlength} placeholder={option.placeholder}
                              type={option.type == 'password' ? 'password' : ''}/>;
        }
    }

    _getFields() {
        const {getFieldDecorator} = this.props.form;
        const that = this;
        return that.props.formData.map((option, i) => {
            if (option.isHide === 'true') {//隐藏的条目
                return (
                    <div key={i} style={{display: 'none'}}></div>
                );
            } else if(option.type=='detail'){
                return (
                    <div key={i} className={option.className}>
                        {option.name?<span>{option.name}:</span>:''}
                        <span>{option.value}</span>
                        </div>
                );
            }else {
                let decoratorRules = option.type === 'switch' ? {
                    valuePropName: 'checked',
                    initialValue: option.initialValue
                } : {
                    rules: [{
                        required: option.isRequired, message: '不能为空！',
                    }],
                    initialValue: option.initialValue
                }

                return (
                    <FormItem label={option.name} className={(option.isHide?'hide':'')  +(option.notNull?' not-null':'') + ' '+option.className} key={i}>
                        {getFieldDecorator(`${option.id}`, decoratorRules
                        )(
                            that._getFormItem(option)
                        )}
                    </FormItem>
                );
            }
        });
    }

    render() {
        let {dialogButton,message,showInputSelect, dialogWidth, dialogHeight,title} = this.props;
        return (
            <div className="dialog-mask">
                <div className="dialog-container" style={{width: (dialogWidth||500)+'px', height: (dialogHeight||300)+'px'}}>
                    <div className="dialog-title">
                        <span>{title||'操作提示'}</span>
                    </div>
                    <div className={'form-content-div'} style={{height:dialogHeight-100+'px',overflow:'scroll'}}>
                        <Form
                            layout={'inline'}
                            className={"new-form"}
                            onSubmit={this.props.actionButtons&&this.props.actionButtons.length?null:this._handelSubmit}
                        >
                            {/*此处动态生成表单域*/}
                            {this._getFields()}
                        </Form>
                        <div className="dialog-button" style={{textAlign:'center'}}>
                            {dialogButton &&
                            dialogButton.map((item, i) => {
                                return <Button type={item.type} key={i} className="btn" onClick={(e)=>{this._handelSubmit(e,item)}}>{item.text}</Button>;
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DialogForm.propTypes = {
    formData: PropTypes.arrayOf(PropTypes.object), //表格元素
    title:PropTypes.string,
    dialogWidth:PropTypes.number,
    dialogHeight:PropTypes.number,
    dialogButton:PropTypes.arrayOf(PropTypes.object)//按钮方法
}

