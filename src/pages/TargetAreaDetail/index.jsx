import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Radio, Select, Form, Cascader, Input } from 'antd';
import { options } from '../../static/area';
import { requestMethod } from '../../http/index'
import axios from 'axios';

const $api = axios.create({
    baseURL:'https://rainformula-2121739-1313151054.ap-shanghai.run.tcloudbase.com',
    changeOrigin: true,
});

const TargetAreaDetail = ({editdata, goBack}) => {
  console.log('editdata', editdata)
  const formRef = useRef();
  const [targetArea, setTargetArea]= useState('');
  const [areaRange, setAreaRange]= useState('');
  const [relatedFormula, setRelatedFormula]= useState('');
  const [region, setRegion]= useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [publicStatus, setPublicStatus] = useState('1');

  const addTargetArea = async (params) => {
    // const res = await $api.post('/apc/targetArea/update', params)
    const res = await requestMethod('apc/targetArea/update', 'POST', JSON.stringify(params), "application/json");
    const parseData = JSON.parse(res);
    if (parseData.success) {
      message.success('更新成功');
    } else {
      message.warning(info);
    }
  };

  const formatFormulaList = async () => {
    // const res = await $api.get('/apc/formula/getAll')
    const res = await requestMethod('apc/formula/getAll');
    const parseData = JSON.parse(res);
    if (parseData.data) {
      const formulaList = parseData.data;
      const arr = [];
      for(let i=0; i < formulaList.length; i++) {
        arr.push({
          value: formulaList[i].id,
          label: formulaList[i].formulaName
        })
      }
      setSelectOptions(arr);
    }
  }
 
    const onChange = (value) => {
      setRegion(value)
    };
 
    const onFinish = (values) => {
      // formRef.current.resetFields()
    };

    const onFinishFailed = (errorInfo) => {
    };

    const onChange1 = (e) => {
      setPublicStatus(e.target.value);
    };

    const handleChange = (value) => {
      setRelatedFormula(value.join(','));
    };

    const saveTargetArea = () => {
       const data = {
        id: editdata.targetAreaId,
        targetAreaName: targetArea,
        areaRangeDesc: areaRange,
        province: region[0],
        city: region[1],
        district: region[2],
        relatedFormulas: relatedFormula,
        publicStatus,
       }
       addTargetArea(data)
    }
    useEffect(()=>{
        formatFormulaList();
        setAreaRange(() => editdata.areaRange)
        setRelatedFormula(() => editdata.relatedFormulas)
        setPublicStatus(() => `${editdata.publicStatus}`)
        setPublicStatus(() => editdata.publicStatus)
    },[])

  return (
    <div>
      <Form
      name="basic"
      labelCol={{
        span: 2,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues ={{
        targetArea: editdata.targetAreaName,
        areaRange: editdata.areaRangeDesc,
        region: [editdata.province, editdata.city, editdata.district],
        relatedFormula: editdata.relatedFormulas.split(','),
        publicStatus: editdata.publicStatus
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      ref={formRef}
    >
      <Form.Item
        label="目标地区"
        name="targetArea"
        rules={[
          {
            required: true,
            message: 'Please input your target area!',
          },
        ]}
      >
        <Input value={targetArea} onChange={(e) => setTargetArea(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="地区范围"
        name="areaRange"
        rules={[
          {
            required: false,
            message: 'Please input your areaRange!',
          },
        ]}
      >
        <Input value={areaRange} onChange={(e) => setAreaRange(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="三级行政"
        name="region"
        rules={[
          {
            required: true,
            message: 'Please input your areaRange!',
          },
        ]}
      >
        <Cascader value={region} dropdownMenuColumnStyle={{width: '300px'}} options={options} onChange={onChange} placeholder="Please select" />
      </Form.Item>

      <Form.Item label="关联公式" name="relatedFormula">
        <Select 
          mode="multiple"
          allowClear 
          value={relatedFormula}
          onChange={handleChange} options={selectOptions}>
        </Select>
      </Form.Item>

      <Form.Item label="发布状态" name="publicStatus"
        rules={[
          {
            required: true,
          }
        ]}
      >
        <Radio.Group onChange={onChange1} value={1}>
          <Radio value={1}> 未发布 </Radio>
          <Radio value={2}> 已发布 </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button style={{marginRight: '20px'}} type="primary" htmlType="submit" onClick={() => goBack()}>
          返回
        </Button>
        <Button type="primary" htmlType="submit" onClick={() => saveTargetArea()}>
          保存
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default TargetAreaDetail;