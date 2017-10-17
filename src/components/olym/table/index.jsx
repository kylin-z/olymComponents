import React,{Component} from "react";

import {Table as ATable,Button, Modal} from 'antd';

import CustomColumnsModal from './CustomColumnsModal'

import './style.css'

class Table extends Component{
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
        };
    }

    getUserDefineCol = (columns,customColumns) =>{
        if(!customColumns){
            return columns;
        }
        let columnsMap = {};
        columns.map((col)=>{
            columnsMap[col.dataIndex]=col
        })
        let userDefineColumns = [];
        customColumns.map((obj)=>{
            const dataIndex = obj.dataIndex;
            if(obj.orderNo<0){
                return;
            }
            if(columnsMap[dataIndex]){
                const column = columnsMap[dataIndex];
                column["orderNo"] = obj.orderNo;
                userDefineColumns.push(column);
            }else{
                userDefineColumns.push(obj);
            }
        })
        userDefineColumns.sort((a,b)=>{
            return a.orderNo-b.orderNo;
        })
        return userDefineColumns;
    }

    handleClose = () => {
        this.setState({visible: false})
    }

    handleShow = () => {
        this.setState({visible: true})
    }

    render(){
        const {columns,customColumns,onCustomChange,...otherProps} = this.props
        //处理自定义列
        const userDefineColumns = this.getUserDefineCol(columns,customColumns);

        let title = this.props.title;
        if(customColumns){
            title = (data) => <Button onClick={this.handleShow}>自定义列</Button>
        }


        // 弹出框参数
        const modalOpts = {
            // ...customConfig,
            // columnKeys:[],
            visible: this.state.visible,
            onCancel: this.handleClose,
            onOk: onCustomChange,
            // dataSource: []
            customColumns
        }

        // 每次弹框都重新渲染
        const CustomColumnsModalGen = () => <CustomColumnsModal {...modalOpts} />

        //把处理完的数据组合成新的props
        const props = {
            ...otherProps,
            title,
            columns:userDefineColumns,

        }
        return(
            <div>
                <ATable {...props}/>
                <CustomColumnsModalGen />
            </div>

        )
    }
}
export default Table;