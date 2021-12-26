import React, { useRef } from 'react';
import { PlusOutlined, EllipsisOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import request from 'umi-request';

import axios from "axios";

type TaskItem = {
  id: number;
  name: string;
  description: string;
  type: string,
  create_time: string;
  state: string;
  creat_user: number;
  take_user: number;
  dataset: number;
};

export default function TaskList(props) {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<TaskItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '标题',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
    tip: '标题过长会自动收缩',
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
    title: '类型',
    dataIndex: 'type',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Tag key={record.type}>
        {record.type}
      </Tag>
    ),
  },
  {
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      P: {
        text: '解决中',
        status: 'Pending',
      },
      D: {
        text: '已完成',
        status: 'Done',
        disabled: true,
      },
      W: {
        text: '等待中',
        status: 'Waiting',
      },
    },
  },
  {
    title: '创建者',
    dataIndex: 'creat_user',
    valueType: 'text',
  },
  {
    title: '领取者',
    dataIndex: 'take_user',
    valueType: 'text',
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'create_time',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    render: (text, record, _, action) => [
      <a
        onClick={() => {
          // console.log(record)
          var data = new Object()
          data['id'] = record.id
          data['take_user'] = props.User_ID
          console.log(data)
          let url = "http://127.0.0.1:8000/task/take/"

          axios.post(url, data, {headers: {'Content-Type': 'application/json'}}).then(
            res => {
              alert (res.data.msg)
              if (res.status === 200 && res.data.code === 1) {
                console.log('领取成功')
              }
              else {
                console.log(res)
              }
            }
          ).catch((err) =>{
              console.log(err)
          })
        }}
      >
        领取
      </a>,
      <a
      onClick={() => {
        // console.log(record)
        var data = new Object()
        data['id'] = record.id
        console.log(data)
        let url = "http://127.0.0.1:8000/task/complete/"

        axios.post(url, data, {headers: {'Content-Type': 'application/json'}}).then(
          res => {
            alert (res.data.msg)
            if (res.status === 200 && res.data.code === 1) {
              console.log('提交成功')
            }
            else {
              console.log(res)
            }
          }
        ).catch((err) =>{
            console.log(err)
        })
      }}
      >
        提交
      </a>,
    ],
  },
];

  return (
    <ProTable<TaskItem>
      columns={columns}
      actionRef={actionRef}
      request={async (params = {}, sort, filter) => {
        // console.log(sort, filter);
        let url = 'http://127.0.0.1:8000/task/'

        var res = axios.get(url, {headers: {'Content-Type': 'application/json'}})
        
        // console.log((await res).data)
        return {
          data: (await res).data.results,
          success: true,
          total: (await res).data.count,
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
      // headerTitle="任务列表"
      // toolBarRender={() => [
      //   <Button key="button" icon={<PlusOutlined />} type="primary">
      //     新建
      //   </Button>,
      // ]}
    />
  );
};