import { Table, Breadcrumb,Tag, Button, Space, Modal, message, Image } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { requestMethod } from '../../http/index';
import { format } from 'date-fns'
import FormulaDetail from '../FormulaDetail/index'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './index.css'
import axios from 'axios';

const $api = axios.create({
    baseURL:'https://rainformula-2121739-1313151054.ap-shanghai.run.tcloudbase.com',
    changeOrigin: true,
});


const FormulaList = () => {
    const [targetAreaList, setTargetAreaList] = useState([]);
    const currentHandleItem = useRef({})
    const [showEdit, setShowEdit] = useState(false);
    const { confirm } = Modal;

    const columnTitle = [ 
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '公式名称',
            dataIndex: 'formulaName',
            key: 'formulaName',
        },
        {
            title: '公式图片',
            dataIndex: 'formulaSrc',
            key: 'formulaSrc',
            render: (_, { formulaSrc }) => (
                <Image
                    width={200}
                    src={formulaSrc}
                />
            )
        },
        {
            title: '使用条件',
            dataIndex: 'usecondition',
            key: 'usecondition'
        },
        {
            title: '公式说明',
            dataIndex: 'useDesc',
            key: 'useDesc'
        },
        {
            title: '资料年数',
            dataIndex: 'materialYear',
            key: 'materialYear'
        }
        ,{
            title: '起止年份',
            dataIndex: 'startEndYear',
            key: 'startEndYear'
        }
        ,{
            title: '选样方法',
            dataIndex: 'sampleMethod',
            key: 'sampleMethod'
        }
        ,{
            title: '理论分布',
            dataIndex: 'theoryDistribute',
            key: 'theoryDistribute'
        }
        ,{
            title: '取样站点',
            dataIndex: 'sampleSite',
            key: 'sampleSite'
        }
        ,{
            title: '来源文件',
            dataIndex: 'sourceFile',
            key: 'sourceFile'
        }
        ,{
            title: '来源链接',
            dataIndex: 'sourceLink',
            key: 'sourceLink'
        } 
        ,{
            title: '编制单位',
            dataIndex: 'formatUnit',
            key: 'formatUnit'
        }
        ,{
            title: '批复说明时间',
            dataIndex: 'replayTime',
            key: 'replayTime'
        }
        ,{
            title: '备注',
            dataIndex: 'comment',
            key: 'comment'
        }
        ,{
            title: '发布状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, { status }) => (
                <Tag color={status === 2  ? 'geekblue' : 'green'} key={status}>
                    { status === 1  ? '已发布' :'未发布'}
                </Tag>
            )
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
                <Button onClick={() => {updateFormula(record)}} type="primary" shape="round" size='small'>update</Button>
                <Button onClick={() => {deleteFormula(record)}} danger type="primary" shape="round" size='small'>Delete</Button>
              </Space>
            ),
          },
    ]
    
    const formatFormulaList = async () => {
        // const res = await $api.get(`/apc/formula/getAll`);
        const res = await requestMethod(`/apc/formula/getAll`, 'GET');
        const resultData = JSON.parse(res);
        if (resultData && resultData.data) {
            resultData.data.forEach((item) => {
                item.updatedAt = format(new Date(item.updatedAt), 'MM/dd/yyyy');
                item.createdAt = format(new Date(item.createdAt), 'MM/dd/yyyy');
            })
            setTargetAreaList(resultData.data.reverse())
        }
    }

    const deleteFormula = (item) => {
        currentHandleItem.current = item;
        showDeleteConfirm();
    }

    const updateFormula = (item) => {
        currentHandleItem.current = item;
        setShowEdit(true);
    }

    const handleDeleteItem = async () => {
        // const res = await $api.post('/apc/formula/delete', {id: currentHandleItem.current.id})
        const res = await requestMethod(`/apc/formula/delete`, 'POST', JSON.stringify({id: currentHandleItem.current.id}), "application/json");
        // const parseRes = res.data
        const parseRes = JSON.parse(res);
        const {success, info} = parseRes;
        if (success) {
            formatFormulaList();
            message.info('you have deleted it successfully!');
        } else {
            message.error(info);
        }
    }

    const goBack = () => {
        formatFormulaList();
        setShowEdit(false);
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
        formatFormulaList();
    }, [])

    return <>
        <div className='page-title'>
            <Breadcrumb>
                <Breadcrumb.Item>公式{showEdit? '编辑' : '列表'}</Breadcrumb.Item>
                {
                    showEdit && <Breadcrumb.Item>{currentHandleItem.current.formulaName}</Breadcrumb.Item>
                }
            </Breadcrumb>
        </div>
        
        <div className='table-area'>
            {
                showEdit 
                ? <FormulaDetail editdata={currentHandleItem.current} goBack={goBack}></FormulaDetail>
                : <Table columns={columnTitle} dataSource={targetAreaList} />
            }
        </div>
    </>
}
export default FormulaList;