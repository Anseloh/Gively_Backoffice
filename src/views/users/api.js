import request from "@/services/request"
import baseUrl from "@/services/baseUrl"


let path =  `${baseUrl.main}/uc/v1/`;
// let path =  `${baseUrl.dev}/uc/v1/`;

// this is for globally used APIs only
export default {
  getApplications: (params = {}) => request.post(path + "bo/users/list", params),
  exportEmails: (params = {}) => request.post(path + "bo/users/export", params),
  addReview: (params = {}) => request.post(path + "on-boarding/applications/review", params),
  // review: (params = {}) => request.post(baseUrl.main + "/ba021/v1/rnv/user/applications/review", params)
}