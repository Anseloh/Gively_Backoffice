import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

// let path = `${baseUrl.main}/${baseUrl.envName != 'development' ? "cs/" : ''}v1/`;
let path = `${baseUrl.main}/cs/v1/`;
// let path = `${baseUrl.devCs}/cs/v1/`;

// this is for globally used APIs only
export default {
  getFundraisers: (params = {}) => request.post(path + "fundraiser/bo/list", params),
  getCountries: (params = {}) => request.post(path + "fundraiser/bo/countries?", params),
  addCountry: (params = {}) => request.post(path + "fundraiser/bo/countries/create", params),
  removeCountry: (id = '') => request.post(path + "fundraiser/bo/countries/delete/" + id),
  editCountry: (params = {}) => request.post(path + "fundraiser/bo/countries/update/" + params.id, params),
  reviewFundraiser: (params = {}) => request.post(path + "fundraiser/bo/review/" + params.id, params),
  runFundraiser: (params = {}) => request.put(path + "fundraiser/bo/run/" + params.id, params),
  pauseFundraiser: (params = {}) => request.put(path + "fundraiser/bo/pause/" + params.id, params),
  deleteFundraiser: (params = {}) => request.put(path + "fundraiser/bo/delete/" + params.id, params),
  markAsProcessed: (params = {}) => request.post(path + "admin/mark-processed", params),
  toggleFeatured: (params = {}, id) => request.post(path + "fundraiser/bo/featured/"+id, params),
  toggleVisibility: (params = {}, id) => request.post(path + "fundraiser/bo/toggle/"+id, params),
  getRefundableFundraisers: (params = {}, page = 1, limit = 12) => request.post(path + "fundraiser/bo/refunds/list?page=" + page + "&limit=" + limit, params),
  getFundraiserRefundStatus: (fundraiserId = null) => request.post(path + "fundraiser/bo/refunds/info/" + fundraiserId),
  triggerRefundOnFundraiser: (fundraiserId = null) => request.put(path + "fundraiser/bo/refunds/" + fundraiserId),
  // review: (params = {}) => request.post(baseUrl.main + "/ba021/v1/rnv/user/applications/review", params)
}