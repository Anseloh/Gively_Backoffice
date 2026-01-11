import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

// let path = `${baseUrl.main}/${baseUrl.envName != 'development' ? "cs/" : ''}v1/`;
let path = `${baseUrl.main}/cs/v1/`;
// let path = `${baseUrl.devCs}/cs/v1/`;

// this is for globally used APIs only
export default {
  getCampaigns: (params = {}) => request.post(path + "campaign/bo/find?mode=" + params.mode + '&limit=10&page=' + params.page, params),
  getCategories: (params = {}) => request.post(path + "campaign-category/bo/find?limit=10&page=" + params.page, params),
  addCategory: (params = {}) => request.post(path + "campaign-category/bo/new", params),
  removeCategory: (params = {}) => request.put(path + "campaign-category/bo/remove/" + params._id),
  editCategory: (params = {}) => request.put(path + "campaign-category/bo/edit/" + params._id, params),
  campaignRemark: (params = {}) => request.put(path + "campaign/bo/review/" + params.id, params),
  runCampaign: (params = {}) => request.put(path + "campaign/bo/run/" + params.id, params),
  pauseCampaign: (params = {}) => request.put(path + "campaign/bo/pause/" + params.id, params),
  deleteCampaign: (params = {}) => request.put(path + "campaign/bo/delete/" + params.id, params),
  markAsProcessed: (params = {}) => request.post(path + "admin/mark-processed", params),
  toggleFeatured: (params = {}, id) => request.post(path + "campaign/bo/featured/"+id, params),
  toggleVisibility: (params = {}, id) => request.post(path + "campaign/bo/toggle/"+id, params),
  resetSubmission: (params = {}, id) => request.post(path + "campaign/bo/reset-submission/"+id, params),
  getRefundableCampaigns: (params = {}, page = 1, limit = 12) => request.post(path + "campaign/bo/refunds/list?page=" + page + "&limit=" + limit, params),
  getCampaignRefundStatus: (campaignId = null) => request.post(path + "campaign/bo/refunds/info/" + campaignId),
  triggerRefundOnCampaign: (campaignId = null) => request.put(path + "campaign/bo/refunds/" + campaignId),
  // review: (params = {}) => request.post(baseUrl.main + "/ba021/v1/rnv/user/applications/review", params)
}