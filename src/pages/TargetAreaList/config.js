import { Tag, Space, Button } from 'antd';
export const columnTitle = [ 
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
            <Button type="primary" shape="round" size='small'>update</Button>
            <Button onClick={() => {delteTargetArea(record)}} danger type="primary" shape="round" size='small'>Delete</Button>
          </Space>
        ),
      },
]