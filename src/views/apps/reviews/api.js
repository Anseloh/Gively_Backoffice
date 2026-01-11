import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

let servicePath = "/aa038/v1/";
const mpBaseUrl = baseUrl.main + servicePath;

// this is for globally used APIs only
export default {
  getReviews: (params = {}) => request.post(mpBaseUrl + "reviews/all", params),
}