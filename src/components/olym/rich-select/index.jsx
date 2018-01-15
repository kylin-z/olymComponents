import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Select} from 'antd';
import './styles/index'

const Option = Select.Option;


//props selectKey 指定一个key的值填入input中
class RichSelect extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        dataBody: PropTypes.array,
        dataHead: PropTypes.object,
        dropdwonMaxRows: PropTypes.number
    }

    static defaultProps = {
        selectKey: "value",
        disabled: false,
        scrollHeight: 32
    }

    handleSelect = (value, option) => {
        const {dataBody, selectKey} = this.props;
        var index = option.props.index;
        let obj = dataBody[index - 1];
        if (obj) {
            this.props.onSelect && this.props.onSelect(obj[selectKey], option, obj);
        }
    }

    render() {
        const {dataHeader, dataBody, selectKey, notFoundContent = "not found", dropdownMatchSelectWidth = false, ...props} = this.props;
        const hasDataBody = dataBody && dataBody.length > 0;
        const dropdownHeadData = dataHeader,
            dropdownBodyData = hasDataBody ? dataBody : notFoundContent;
        //console.log(dataHeader)
        // 拼接下拉框header部分结构
        const dropdownHeadElement = dropdownHeadData ? <Option key="title" disabled>{dropdownHeadData.map(val => <p
            key={val.dataIndex}>{val.title}</p>)}</Option> : '';
        const dropdownBodyElement = !hasDataBody ?
            <Option key="no-data" className="no-data" disabled><p colSpan="2">{dropdownBodyData}</p><p></p>
            </Option> : createBodyElement();

        //下拉框body部分
        function createBodyElement() {
            const isArray = dropdownBodyData instanceof Array;
            if (!isArray) {
                throw  new TypeError('RichSelect 组件的 dataBody 只接受 "Array" 格式的数据');
            }

            return dropdownBodyData.map(function (val, index) {
                // TODO unique key问题
                const parentVal = val;
                const _item = dropdownHeadData.map((val, i) => <p key={val.dataIndex}>{parentVal[val.dataIndex]}</p>);
                return <Option key={index} value={val[selectKey]}>{_item}</Option>//这里的key可以当value使用，不用再定义value
            })
        }

        return (
            <Select ref="input" {...props} dropdownMatchSelectWidth={dropdownMatchSelectWidth}
                    optionLabelProp={"value"} dropdownClassName={"rich-select"}
                    onSelect={this.handleSelect}>
                {dropdownHeadElement}
                {dropdownBodyElement}
            </Select>
        )
    }
}

export default RichSelect;