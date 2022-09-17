import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UnorderedListOutlined,
    OrderedListOutlined,
    EditOutlined,
    FormOutlined,
  } from '@ant-design/icons';
  import { Layout, Menu } from 'antd';
  import React, { useState } from 'react';
  import { useHistory } from 'react-router-dom';
  import './home.css'
  import logoSrc from '../../static/logo.png'
  
  
  const { Header, Sider, Content } = Layout;
  
  const Homepage = ({children}) => {
    const [collapsed, setCollapsed] = useState(false);
    const HISTORY = useHistory();
    const onOpenChange = (keys) => {
       switch(keys.key) {
          case 'formula':
            HISTORY.push("/")
          break;
          case 'targetArea':
            HISTORY.push("/targetArea")
          break;
          case 'formulaList':
            HISTORY.push("/formulaList")
          break;
          case 'targetAreaList':
            HISTORY.push("/targetAreaList")
          break;
       }
    }

    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">
            <img src={logoSrc} />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            onClick={onOpenChange}
            defaultSelectedKeys={['formula']}
            items={[
              {
                key: 'formula',
                icon: <EditOutlined />,
                label: '公式编辑',
              },
              {
                key: 'targetArea',
                icon: <FormOutlined />,
                label: '目标区域编辑',
              },
              {
                key: 'formulaList',
                icon: <OrderedListOutlined />,
                label: '公式列表',
              },
              {
                key: 'targetAreaList',
                icon: <UnorderedListOutlined />,
                label: '目标区域列表',
              },
            ]}
          />
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background site-layout-background-header"
            style={{
              padding: 0,
            }}
          >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  };
  
  export default Homepage;