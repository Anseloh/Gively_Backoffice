import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

// let path =  `${baseUrl.main}/${baseUrl.envName != 'development'? "cs/": ''}cs/v1/`;
let ucPath = `${baseUrl.main}/${baseUrl.envName != 'development' ? "uc/" : ''}v1/`;
// let path = `${baseUrl.main}/cs/v1/`;
let path = `${baseUrl.devCs}/cs/v1/`;

// this is for globally used APIs only
export default {
  getTransactions: (params = '') => request.post(path + "txn/bo/list", params),
  getEvent: (params = '') => request.post(path + "event/bo/detail", params),
  postTransaction: (params = {}) => request.post(path + "txn/bo/post-transaction-process", params),
  getUser: (params = '') => request.get(ucPath + "bo/regular/single/" + params),
  // review: (params = {}) => request.post(baseUrl.main + "/ba021/v1/rnv/user/applications/review", params)
}