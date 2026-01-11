import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

let campaignPath = `${baseUrl.main}/${baseUrl.envName != 'development' ? "cs/" : ''}v1/`;
let userPath = `${baseUrl.main}/${baseUrl.envName != 'development' ? "uc/" : ''}v1/`;

// this is for globally used APIs only
export default {
  getCampaigns: (params = {}) => request.post(campaignPath + "campaign/bo/dashboard/analytics/campaigns", params),
  getBlockchain: (params = {}) => request.post(campaignPath + "bct/bo/statistics", params),
  getUsers: (params = {}) => request.post(userPath + "bo/dashboard/analytics", params)
}