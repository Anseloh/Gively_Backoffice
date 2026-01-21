import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

// let path = `${baseUrl.main}/${baseUrl.envName != 'development' ? "cs/" : ''}v1/`;
let path = `${baseUrl.main}/cs/v1/`;
// let path = `${baseUrl.devCs}/cs/v1/`;

// this is for globally used APIs only
export default {
  getEvents: (params = {}) => request.post(path + "events/bo/list", params),
  getEventDetails: (params = {}) => request.post(path + "events/bo/detail", params),
  createEvent: (params = {}) => request.post(path + "events/bo/create/", params),
  editEvent: (params = {}) => request.post(path + "events/bo/update/" + params.id, params)
  // review: (params = {}) => request.post(baseUrl.main + "/ba021/v1/rnv/user/applications/review", params)
}