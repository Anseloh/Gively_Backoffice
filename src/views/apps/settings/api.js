import request from "@/services/request";
import baseUrl from "@/services/baseUrl";

// this is for locally used APIs only
let servicePath = "/aa038/v1/mps/";
const mpBaseUrl = baseUrl.main + servicePath;  
export const resetPassword = (params = {}) => request.post(baseUrl.main + '/ba021/v1/sanaga/reset-password', params);
export default {
  // getTopicList: (params = {}) => request.post(baseUrl.main + "/as/index/recommend/v1", params)
}