import React, { useRef } from 'react';
import { PlusOutlined, EllipsisOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';

import axios from "axios";

type DatasetItem = {
  id: number;
  filename: string;
  pic: string;
  owner: number;
}

const columns: ProColumns<DatasetItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '文件名',
    dataIndex: 'filename',
    copyable: true,
    ellipsis: true,
    tip: '文件名过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '图片',
    dataIndex: 'pic',
    valueType: 'option',
    render: (text, record) => {
      return <a href={text.props.record.pic} target = "blank">Link</a>
    }
  },
  {
    title: '拥有者',
    dataIndex: 'owner',
    valueType: 'text',
  },
]

export default function DatasetList(props) {
  const actionRef = useRef<ActionType>()

  const [data, setData] = React.useState([])
  const [total, setTotal] = React.useState(0)

  const getData = async(first_url) => {
    var tempdata = []
    for (let url = first_url; url !== null;){
      var res = await axios.get(url, {headers: {'Content-Type': 'application/json'}})
      tempdata = [...tempdata, ...res.data.results]
      setTotal(res.data.count)
      url = res.data.next
    }
    
    return tempdata
  }

  return (
    <ProTable<DatasetItem>
      columns={columns}
      actionRef={actionRef}
      request={async (params = {}, sort, filter) => {
        // console.log(sort, filter);

        let url = 'http://127.0.0.1:8000/picture/'
        getData(url).then(res => {
          setData(res)
        })

        return {
          data: data,
          success: true,
          total: total,
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 12,
      }}
      dateFormatter="string"
      // headerTitle="图像列表"
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => {props.setSelected(4)}}>
          新建
        </Button>,
      ]}
    />
  );
};