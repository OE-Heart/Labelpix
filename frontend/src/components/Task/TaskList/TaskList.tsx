import React, { useRef } from 'react';
import { PlusOutlined, EllipsisOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
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

  const [files, setFiles] = React.useState([])

  const getFile = async (data) => {
    const files = []

    for (var item of data) {
      var url = "http://127.0.0.1:8000"+item.url
      var res = await axios.get(url, {headers: {'responseType': 'blob'}})
      files.push(res.data)
    }

    return files;
  }

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
      (record.state == 'W') ? 
        <a onClick={() => {
          if (record.creat_user === props.User_ID) {
            message.warning('您是该任务创建者，不能领取该任务')
            return;
          }
          var data = new Object()
          data['id'] = record.id
          data['take_user'] = props.User_ID
          console.log(data)
          let url = "http://127.0.0.1:8000/task/take/"

          axios.post(url, data, {headers: {'Content-Type': 'application/json'}}).then(
            res => {
              if (res.status === 200 && res.data.code === 1) {
                message.success(res.data.msg)
                console.log('领取成功')
              }
              else {
                message.error(res.data.msg)
                console.log(res)
              }
            }
          ).catch((err) =>{
              console.log(err)
          })
        }}
        >
          领取
        </a>
      : (record.state == 'P') ? 
        <a
          onClick={() => {
            if (record.take_user !== props.User_ID) {
              message.warning('您不是该任务的领取者，不能提交该任务')
              return;
            }
            var data = new Object()
            data['id'] = record.id
            console.log(data)
            let url = "http://127.0.0.1:8000/task/complete/"
          
            axios.post(url, data, {headers: {'Content-Type': 'application/json'}}).then(
              res => {
                if (res.status === 200 && res.data.code === 1) {
                  message.success(res.data.msg)
                }
                else {
                  message.error(res.data.msg)
                  console.log(res)
                }
              }
            ).catch((err) =>{
                console.log(err)
            })
          }}
          >
            提交
        </a> 
        : (record.state == 'D') ? 
        <a
          onClick={() => {
            if (record.creat_user !== props.User_ID) {
              message.warning('您不是该任务的创建者，不能导出该任务')
              return;
            }
            var data = new Object()
            data['dataset'] = record.dataset;

            if (record.type === 'V') {
              var JSZip = require("jszip"); 
              var FileSaver = require('file-saver');
              let url = "http://127.0.0.1:8000/VOC/download/"

              axios.post(url, data, {headers: {'Content-Type': 'application/json'}}).then(
                async res => {
                  if (res.status === 200 && res.data.code === 1) {
                    getFile(res.data.data).then(res => {
                      setFiles(res)
                    })
                    console.log(files)

                    const zip = new JSZip();
                    for (var i = 0; i < files.length; i++) {
                      zip.file(res.data.data[i].id + '_VOC.xml', files[i]);
                    }

                    var fileName = record.dataset+"_VOC.zip"
                    zip.generateAsync({
                      type: "blob",
                      compression: "DEFLATE",  // STORE：默认不压缩 DEFLATE：需要压缩
                      compressionOptions: {
                        level: 9               // 压缩等级1~9    1压缩速度最快，9最优压缩方式
                      }
                    }).then((res: any) => {
                      console.log(res)
                      FileSaver.saveAs(res, fileName) // 利用file-saver保存文件
                    })
                  }
                  else {
                    message.error(res.data.msg)
                    console.log(res)
                  }
                }
              ).catch((err) =>{
                  console.log(err)
              })
            }
            else if (record.type === 'C') {
              let url = "http://127.0.0.1:8000/COCO/download/"
              axios.post(url, data, {headers: {'Content-Type': 'application/json'}}).then(
                res => {
                  console.log(res.data)
                  var data = JSON.stringify(res.data)

                  // 构建下载对象
                  const blobURL = new Blob([data], { type: 'text/json' })
                  const tempLink = document.createElement('a')
                  tempLink.style.display = 'none';
                  tempLink.href = window.URL.createObjectURL(blobURL)
                  tempLink.download = `${record.dataset}_COCO.json`
                              
                  // 模拟点击
                  document.body.appendChild(tempLink);
                  tempLink.click();
                }
              ).catch((err) =>{
                  console.log(err)
              })
            }
            else {
              message.error("暂不支持当前数据集格式")
            }
            
          }}
          >
            导出
        </a> : <div></div>,
      (record.state == 'P') ? 
        <a
          onClick={() => {
            if (record.take_user !== props.User_ID) {
              message.warning('您不是该任务的领取者，不能选择该任务')
              return;
            }
            props.setSelected(7)
            props.setSelectedTask(record)
          }}
          >
            选择
        </a>
      : <div></div>,
      ,
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