import React, { useState, useRef, useEffect } from 'react';
import { Button, message,  Form, Input, Radio, Upload, Image } from 'antd';
import { GET_ACCESSTOKEN_URL, GET_UPLOADFILE_PARAMETER_URL, PROD_ENV_ADDRESS, FILE_ADDRESS } from '../../config/index'
import { requestMethod } from '../../http/index'
import './index.css'
import axios from 'axios';  

const $api = axios.create({
    baseURL:'https://rainformula-2121739-1313151054.ap-shanghai.run.tcloudbase.com',
    changeOrigin: true,
});

const $api2 = axios.create({
  baseURL:'https://api.weixin.qq.com',
  changeOrigin: true,
});




const FormulaDetail = ({editdata, goBack}) => {
  
  const [formulaName, SetFormulaName] = useState(editdata.formulaName)
  const [formulaSrc, SetFormulaSrc] = useState(editdata.formulaSrc)
  const [usecondition, SetUsecondition] = useState(editdata.usecondition)
  const [useDesc, SetUseDesc] = useState(editdata.useDesc)
  const [materialYear, SetMaterialYear] = useState(editdata.materialYear)
  const [startEndYear, SetStartEndYear] = useState(editdata.startEndYear)
  const [sampleMethod, SetSampleMethod] = useState(editdata.sampleMethod)
  const [q220, SetQ220]= useState(editdata.q220)
  const [theoryDistribute, SetTheoryDistribute] = useState(editdata.theoryDistribute)
  const [sampleSite, SetSampleSite] = useState(editdata.sampleSite)
  const [sourceFile, SetSourceFile] = useState(editdata.sourceFile)
  const [sourceLink, SetSourceLink] = useState(editdata.sourceLink)
  const [formatUnit, SetFormatUnit] = useState(editdata.formatUnit)
  const [replayTime, SetReplayTime] = useState(editdata.replayTime)
  const [comment, SetComment] = useState(editdata.comment) 
  const [status, setStatus] = useState(1);
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
        try {
          await requestMethod(result.url, 'POST', formData);
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
    }
 
    const addFormula = async (params) => {
      // const res = await $api.post('/apc/formula/update', params)
      const res = await requestMethod('/apc/formula/update', 'POST', JSON.stringify(params), 'application/json');
      const parseData = JSON.parse(res);
      const { success, info } = parseData;
      if (success) {
        message.success('更新成功');
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
        // const result = await $api2.post('/tcb/batchdownloadfile?access_token=${accessToken.current}',parameterData)
        const result = await requestMethod(`api/tcb/batchdownloadfile?access_token=${accessToken.current}`, 'POST', JSON.stringify(parameterData));
        console.log('result', result)
        const parseData = JSON.parse(result);
        const { errmsg, errcode, file_list} = parseData;
        if (errmsg === 'ok' && errcode === 0 && file_list) {
          const srcList = parseData.file_list.map(file => file.download_url);
          console.log('srcList[0]', srcList[0])
          setImgSrcList(()=> srcList);
          SetFormulaSrc(()=> srcList[0]);
        }
        message.info("upload done!")
        setUploading(false)
        setFileList(()=>[])
      } catch (error) {
        setUploading(false)
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
        id: editdata.id,
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

  useEffect(() => {
    console.log('useEffect editdata', editdata.formulaName)
    SetFormulaName(() => editdata.formulaName);
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
        initialValues={{
          formulaName: editdata.formulaName,
          formulaSrc: editdata.formulaSrc,
          usecondition: editdata.usecondition,
          useDesc:editdata.useDesc,
          q220: editdata.q220,
          materialYear: editdata.materialYear,
          startEndYear: editdata.startEndYear,
          sampleMethod: editdata.sampleMethod,
          theoryDistribute:editdata.theoryDistribute,
          sampleSite: editdata.sampleSite,
          sourceFile: editdata.sourceFile,
          sourceLink: editdata.sourceLink,
          formatUnit: editdata.formatUnit,
          replayTime: editdata.replayTime,
          comment: editdata.comment,
          status: editdata.status, 
        }}
        onFinish={onFinish}
        ref={formRef}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
    >
    <Form.Item
        label="公式名称"
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
      label="公式图片"
      name="formulaSrc"
      rules={[
        {
          required: true,
          message: 'Please input your areaRange!',
        },
      ]}
    >
      <div className='img-display-upload'>
          <div className='img-container'>
          <Image width={200} src={formulaSrc}/>
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
      label="使用条件"
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

    <Form.Item label="公式说明" name="useDesc">
      <Input.TextArea value={useDesc} rows={4} onChange={(e) => SetUseDesc(e.target.value)} />
    </Form.Item>
    
    <Form.Item label="资料年数" name="q220">
      <Input  onChange={(e) => SetQ220(e.target.value)} />
    </Form.Item>

    <Form.Item label="资料年数" name="materialYear">
      <Input  onChange={(e) => SetMaterialYear(e.target.value)} />
    </Form.Item>

    <Form.Item label="起止年份" name="startEndYear">
      <Input  onChange={(e) => SetStartEndYear(e.target.value)} />
    </Form.Item>

    <Form.Item label="选样方法" name="sampleMethod">
      <Input  onChange={(e) => SetSampleMethod(e.target.value)} />
    </Form.Item>

    <Form.Item label="理论分布" name="theoryDistribute">
      <Input  onChange={(e) => SetTheoryDistribute(e.target.value)} />
    </Form.Item>

    <Form.Item label="取样站点" name="sampleSite">
    <Input  onChange={(e) => SetSampleSite(e.target.value)} />
    </Form.Item>

    <Form.Item label="来源文件" name="sourceFile">
      <Input  onChange={(e) => SetSourceFile(e.target.value)} />
    </Form.Item>

    <Form.Item label="来源链接" name="sourceLink">
      <Input  onChange={(e) => SetSourceLink(e.target.value)} />
    </Form.Item>

    <Form.Item label="编制单位" name="formatUnit">
      <Input  onChange={(e) => SetFormatUnit(e.target.value)} />
    </Form.Item>

    <Form.Item label="批复说明时间" name="replayTime">
      <Input  onChange={(e) => SetReplayTime(e.target.value)} />
    </Form.Item>

    <Form.Item label="备注" name="comment">
      <Input  onChange={(e) => SetComment(e.target.value)} />
    </Form.Item>

    <Form.Item label="维护状态" name="status"
      rules={[
        {
          required: true,
        }
      ]}
    >
      <Radio.Group onChange={onMaintainStatusChange} value={1}>
        <Radio value={1}> 已维护 </Radio>
        <Radio value={2}> 待维护 </Radio>
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
        <Button type="primary" htmlType="submit" onClick={() => saveFormula()}>
          保存
        </Button>
      </Form.Item>
    </Form>
    </div>
  );

}
export default FormulaDetail