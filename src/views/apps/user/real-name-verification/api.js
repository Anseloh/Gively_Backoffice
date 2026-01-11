import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

// this is for globally used APIs only

let servicePath = "/ba021/v1/rnv/user/";
const serviceBaseUrl = baseUrl.main + servicePath;

export default {
  getList: (params = {}) => request.post(serviceBaseUrl + "applications/list", params),
  review: (params = {}) => request.post(serviceBaseUrl + "applications/review", params)
}