import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

const servicePath = "/ba021/v1/business-account/";
const serviceBaseUrl = baseUrl.main + servicePath;

// this is for globally used APIs only
export default {
  getApplications: (params = {}) => request.post(serviceBaseUrl + "applications", params),
  addReview: (params = {}) => request.post(serviceBaseUrl + "add-review", params)
}