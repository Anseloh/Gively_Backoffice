import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

let servicePath = "/ba021/v1/sanaga/";
const mpBaseUrl = baseUrl.main + servicePath;

// this is for globally used APIs only
export default {
  getUsers: (params = {}) => request.post(mpBaseUrl + "list", params),
  createUser: (params = {}) => request.post(mpBaseUrl + "new", params),
  updateUser: params => request.put(mpBaseUrl + "user", params),
  deleteUser: userId => request.post(mpBaseUrl + "delete/" + userId),
}