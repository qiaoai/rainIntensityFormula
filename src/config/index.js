export const APPID = "wx89944c9d5bdbe9a2";
export const SECRET = "828d13582c120208bc962b7681739fbe"
export const GRANT_TYPE = "client_credential"
export const GET_ACCESSTOKEN_URL = `/api/cgi-bin/token?grant_type=${GRANT_TYPE}&appid=${APPID}&secret=${SECRET}`
export const GET_UPLOADFILE_PARAMETER_URL = "/api/tcb/uploadfile?access_token"
export const PROD_ENV_ADDRESS = "prod-3g0ofqu7f118a955";
export const FILE_ADDRESS = "Distrct_Formula"
export const GET_DOWNLOADURL_URL = "https://api.weixin.qq.com/tcb/batchdownloadfile"
export const DATA_BASE_URL= "https://rainformula-2121739-1313151054.ap-shanghai.run.tcloudbase.com/"