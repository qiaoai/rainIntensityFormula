import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Breadcrumb, Form, Input, Radio, Upload, Image } from 'antd';
import { GET_ACCESSTOKEN_URL, GET_UPLOADFILE_PARAMETER_URL, PROD_ENV_ADDRESS, FILE_ADDRESS, GET_DOWNLOADURL_URL } from '../../config/index'
import { requestMethod } from '../../http/index'

import axios from 'axios';  

const $api = axios.create({
    baseURL:'https://rainformula-2121739-1313151054.ap-shanghai.run.tcloudbase.com',
    changeOrigin: true,
});

const $api2 = axios.create({
  baseURL:'https://api.weixin.qq.com',
  changeOrigin: true,
});


const Formula = () => {
  const [formulaName, SetFormulaName] = useState('')
  const [formulaSrc, SetFormulaSrc] = useState('')
  const [usecondition, SetUsecondition] = useState('')
  const [useDesc, SetUseDesc] = useState('')
  const [materialYear, SetMaterialYear] = useState('')
  const [startEndYear, SetStartEndYear] = useState('')
  const [sampleMethod, SetSampleMethod] = useState('')
  const [q220, SetQ220]= useState('')
  const [theoryDistribute, SetTheoryDistribute] = useState('')
  const [sampleSite, SetSampleSite] = useState('')
  const [sourceFile, SetSourceFile] = useState('')
  const [sourceLink, SetSourceLink] = useState('')
  const [formatUnit, SetFormatUnit] = useState('')
  const [replayTime, SetReplayTime] = useState('')
  const [comment, SetComment] = useState('') 
  const [status, setStatus] = useState('1');
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imgSrcList, setImgSrcList] = useState([]);
  const formRef = useRef();
  const accessToken = useRef("");

  const createFormData = (result, file, fileName) => {
    const formData = new FormData();
    formData.append('key', `Distrct_Formula/${fileName}`)
    formData.append('Signature', result.authorization);
    formData.append('x-cos-security-token', result.token);
    formData.append('x-cos-meta-fileid', result['cos_file_id']);
    formData.append('file', file);
    return formData;
  }
  const uploadFiles = async (file, fileName) => {
    return new Promise(async (resolve, reject) => {
        const uploadFileParameterData = await getUploadFileParameterData(fileName)
        const result = JSON.parse(uploadFileParameterData);
        const formData = createFormData(result, file, fileName);
        console.log('formData', formData)
        try {
          await requestMethod(result.url, 'POST', formData);
          // await $api.post(result.url, formData)
          resolve(result.file_id);
        } catch (error) {
          reject(error)
        } 
    })
  }

  const getUploadFileParameterData = async (fileName) => {
      const accesstokenData = await getAccessToken();
      const parseData = JSON.parse(accesstokenData)
      if (accesstokenData) {
        const parmater = {
          "env": PROD_ENV_ADDRESS,
          "path": `${FILE_ADDRESS}/${fileName}`
        }
        accessToken.current = parseData.access_token;
        // return $api2.post(`${GET_UPLOADFILE_PARAMETER_URL}=${parseData.access_token}`, parmater)
        return requestMethod(
          `${GET_UPLOADFILE_PARAMETER_URL}=${parseData.access_token}`,
          'POST',
          JSON.stringify(parmater)
        )
      }
    }

    const getAccessToken = async () => { 
      // return $api2.get(GET_ACCESSTOKEN_URL)
      return requestMethod(`${GET_ACCESSTOKEN_URL}`, 'GET');
      // requestMethod(`https://rainformula-2121739-1313151054.ap-shanghai.run.tcloudbase.com/getAccessToken`, 'GET');
    }
 
    const addFormula = async (params) => {
      // const res = await $api.post('/apc/formula/add', params)
      const res = await requestMethod('/apc/formula/add', 'POST', JSON.stringify(params), 'application/json');
      const parseData = JSON.parse(res);
      const { success, info } = parseData;
      if (success) {
        message.success('????????????');
      } else {
        message.warning(info);
      }
    };

    const onFinish = (values) => {
      formRef.current.resetFields()
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onMaintainStatusChange = (e) => {
      setStatus(e.target.value)
    }

    const getFileDownloadUrl = async (file_id_arr) => {
      const promiseArr = [];
      const fileIdLIST = []
      file_id_arr.forEach(fileId => {
        fileIdLIST.push({
          "fileid": fileId,
          "max_age": Infinity
        })
      })

      const parameterData = {
        "env": PROD_ENV_ADDRESS,
        "file_list": fileIdLIST
      }

      try {
        const result = await requestMethod(`api/tcb/batchdownloadfile?access_token=${accessToken.current}`, 'POST', JSON.stringify(parameterData));
        // const result = await $api2.post('/tcb/batchdownloadfile?access_token=${accessToken.current}',parameterData)
        const parseData = JSON.parse(result) ;
        const { errmsg, errcode, file_list} = parseData;
        if (errmsg === 'ok' && errcode === 0 && file_list) {
          const srcList = parseData.file_list.map(file => file.download_url);
          setImgSrcList(()=> srcList);
          SetFormulaSrc(()=> srcList[0]);
        }
        message.info("upload done!")
        setUploading(false)
        setFileList(()=>[])
      } catch (error) {
        setUploading(false)
        reject(error)
      }
    }

    const handleUpload = () => {
      const promiseArr = [];
      fileList.forEach((file) => {
        promiseArr.push(uploadFiles(file, file.name))
      });
      setUploading(true)
      Promise.all(promiseArr).then(res => {
        getFileDownloadUrl(res)
      }).catch(error => {
        message.error(error.toString())
      })
    };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const saveFormula = () => {
      const data = {
        formulaName,
        formulaSrc,
        usecondition,
        useDesc,
        materialYear,
        q220,
        startEndYear,
        sampleMethod,
        theoryDistribute,
        sampleSite,
        sourceFile,
        sourceLink,
        formatUnit,
        replayTime,
        comment,
        status
      }
      addFormula(data)
  }
  return (
    <div>
      <div className='page-title'>
        <Breadcrumb>
            <Breadcrumb.Item>????????????</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Form
        name="basic"
        labelCol={{
          span: 2,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          formulaName:'',
          formulaSrc:'',
          usecondition:'',
          useDesc:'',
          q220: '',
          materialYear:'',
          startEndYear:'',
          sampleMethod:'',
          theoryDistribute:'',
          sampleSite:'',
          sourceFile:'',
          sourceLink:'',
          formatUnit:'',
          replayTime:'',
          comment:'',
          status:''
        }}
        onFinish={onFinish}
        ref={formRef}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >

    <Form.Item
        label="????????????"
        name="formulaName"
        rules={[
          {
            required: true,
            message: 'Please input your target area!',
          },
        ]}
      >
        <Input onChange={(e) => SetFormulaName(e.target.value)} />
    </Form.Item>

    <Form.Item
      label="??????????????????"
      name="fileUpload"
      rules={[
        {
          required: false,
        },
      ]}
    >
      <div className='img-display-upload'>
          <div className='img-container'>
            {
              imgSrcList.map(img => <Image width={200} src={img}/>)
            }
          </div>
          <div className='upload'>
            <Upload {...props}>
              <Button>Select File</Button>
            </Upload>
            <Button
              type="primary"
              onClick={handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{
                marginTop: 16,
              }}
            >
              {uploading ? 'Uploading' : 'Start Upload'}
            </Button>
          </div>
      </div>
    </Form.Item>

    <Form.Item
      label="????????????"
      name="usecondition"
      rules={[
        {
          required: false,
          message: 'Please input your areaRange!',
        },
      ]}
    >
      <Input.TextArea rows={4} onChange={(e) => SetUsecondition(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="useDesc">
      <Input.TextArea rows={4} onChange={(e) => SetUseDesc(e.target.value)} />
    </Form.Item>
    
    <Form.Item label="q2-20" name="q220">
      <Input  onChange={(e) => SetQ220(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="materialYear">
      <Input  onChange={(e) => SetMaterialYear(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="startEndYear">
      <Input  onChange={(e) => SetStartEndYear(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="sampleMethod">
      <Input  onChange={(e) => SetSampleMethod(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="theoryDistribute">
      <Input  onChange={(e) => SetTheoryDistribute(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="sampleSite">
    <Input  onChange={(e) => SetSampleSite(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="sourceFile">
      <Input  onChange={(e) => SetSourceFile(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="sourceLink">
      <Input  onChange={(e) => SetSourceLink(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="formatUnit">
      <Input  onChange={(e) => SetFormatUnit(e.target.value)} />
    </Form.Item>

    <Form.Item label="??????????????????" name="replayTime">
      <Input  onChange={(e) => SetReplayTime(e.target.value)} />
    </Form.Item>

    <Form.Item label="??????" name="comment">
      <Input  onChange={(e) => SetComment(e.target.value)} />
    </Form.Item>

    <Form.Item label="????????????" name="status"
      rules={[
        {
          required: true,
        }
      ]}
    >
      <Radio.Group onChange={onMaintainStatusChange} >
        <Radio value="1"> ????????? </Radio>
        <Radio value="2"> ????????? </Radio>
      </Radio.Group>
    </Form.Item>

    <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" onClick={() => saveFormula()}>
          ??????
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};


export default Formula;
 