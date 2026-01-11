import request from "@/services/request";
import baseUrl from "@/services/baseUrl";

let servicePath = "/aa038/v1/app/";
const url = baseUrl.main + servicePath;
// const url = 'http://localhost:3001/v1/app/';
export default {
  getConfig: (params = {}) => request.get(url + "config", params),
  setConfig: (params = {}) => request.post(url + "set", params),
}