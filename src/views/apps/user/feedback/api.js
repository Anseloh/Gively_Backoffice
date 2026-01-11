import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

let servicePath = "/aa038/v1/feedback/";
const mpBaseUrl = baseUrl.main + servicePath;

// this is for globally used APIs only
export default {
  getFeedbacks: (params = {}) => request.post(mpBaseUrl + "admin/list", params),
  filterFeedbacks: (params = {}) => request.post(mpBaseUrl + "filter", params),
  markAsProcessed: (params = {}) => request.post(mpBaseUrl + "admin/mark-processed", params)
  // review: (params = {}) => request.post(baseUrl.main + "/ba021/v1/rnv/user/applications/review", params)
}