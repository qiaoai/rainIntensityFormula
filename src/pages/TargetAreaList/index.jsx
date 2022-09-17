import { Table, Breadcrumb, Spin, Tag, Button, Space, Modal, message   } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { requestMethod } from '../../http/index';
import { format } from 'date-fns'
import TargetAreaDetail from '../TargetAreaDetail';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.css'
import axios from 'axios';

const $api = axios.create({
    baseURL:'https://rainformula-2121739-1313151054.ap-shanghai.run.tcloudbase.com',
    changeOrigin: true,
});


const TargetAreaList = () => {
    const [targetAreaList, setTargetAreaList] = useState([]);
    const currentHandleItem = useRef({});
    const [showEdit, setShowEdit] = useState(false);
    const { confirm } = Modal;

    const columnTitle = [ 
        {
            title: '目标区域ID',
            dataIndex: 'targetAreaId',
            key: 'targetAreaId'
        },
        {
            title: '省份',
            dataIndex: 'province',
            key: 'province'
        },
        {
            title: '城市',
            dataIndex: 'city',
            key: 'city'
        },
        {
            title: '地区',
            dataIndex: 'district',
            key: 'district'
        },
        {
            title: '目标区域名称',
            dataIndex: 'targetAreaName',
            key: 'targetAreaName'
        },
        {
            title: '目标区域描述',
            dataIndex: 'areaRangeDesc',
            key: 'areaRangeDesc'
        }
        ,{
            title: '关联公式',
            dataIndex: 'relatedFormulas',
            key: 'relatedFormulas'
        }
        ,{
            title: '发布状态',
            dataIndex: 'publicStatus',
            key: 'publicStatus',
            render: (_, { publicStatus }) => (
                <Tag color={publicStatus === 2  ? 'geekblue' : 'green'} key={publicStatus}>
                    { publicStatus === 1  ? '已发布' :'未发布'}
                </Tag>
              ),
        }
        ,{
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
        }
        ,{
            title: '更新时间',
            dataIndex: 'updatedAt',
            key: 'updatedAt'
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
              <Space size="middle">
                <Button onClick={()=>{updateTargetArea(record)}} type="primary" shape="round" size='small'>update</Button>
                <Button onClick={()=>{delteTargetArea(record)}} danger type="primary" shape="round" size='small'>Delete</Button>
              </Space>
            ),
          },
    ]

    const formatTargetAreaList = async () => {
        const res = await requestMethod(`apc/targetArea/getAll`, 'GET');
        // const res = await  $api.get(`apc/targetArea/getAll`)
        const resultData = JSON.parse(res);
        if (resultData && resultData.data) {
            resultData.data.forEach((item) => {
                item.updatedAt = format(new Date(item.updatedAt), 'MM/dd/yyyy');
                item.createdAt = format(new Date(item.createdAt), 'MM/dd/yyyy');
            })
            setTargetAreaList(resultData.data.reverse())
        }
    }

    const delteTargetArea = (item) => {
        currentHandleItem.current = item;
        showDeleteConfirm();
    }

    const updateTargetArea = (item) => {
        currentHandleItem.current = item;
        setShowEdit(true);
    }

    const goBack = () => {
        formatTargetAreaList();
        setShowEdit(false);
    }

    const handleDeleteItem = async () => {
        // const res = await $api.post('/apc/targetArea/delete', {id: currentHandleItem.current.targetAreaId})
        const res = await requestMethod(`apc/targetArea/delete`, 'POST', JSON.stringify({id: currentHandleItem.current.targetAreaId}), "application/json");
        const parseRes =  JSON.parse(res);
        const {success, info} = parseRes;
        if (success) {
            formatTargetAreaList();
            message.info('you have deleted it successfully!');
        } else {
            message.error(info);
        }
    }

    const showDeleteConfirm = () => {
        confirm({
          title: 'Are you sure about deleting this item?',
          icon: <ExclamationCircleOutlined />,
          content: 'I suggest you consider it twice!',
          okText: '100% sure',
          okType: 'danger',
          cancelText: 'let me think',
          onOk() {
            handleDeleteItem();
          },
        });
      };

    useEffect(() => {
        formatTargetAreaList();
    }, [])

    return <>
        <div className='page-title'>
            <Breadcrumb> 
                <Breadcrumb.Item>目标区域列表</Breadcrumb.Item>
                {
                    showEdit && <Breadcrumb.Item>{currentHandleItem.current.targetAreaName}</Breadcrumb.Item>
                }
            </Breadcrumb>
        </div>
        <div className='table-area'>
            {
                showEdit 
                ? <TargetAreaDetail editdata={currentHandleItem.current} goBack={goBack}></TargetAreaDetail> 
                : <Table columns={columnTitle} dataSource={targetAreaList} />
            }
        </div>
    </>
}

export default TargetAreaList;