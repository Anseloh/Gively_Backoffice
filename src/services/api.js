import Vue from "vue";
import request from "./request";
import baseUrl from "./baseUrl";

// this is for globally used APIs only

export default {
  login: (params = {}) => request.post(baseUrl.main + "/uc/v1/bo/login", params, { hideLoadingSpinner: false }),
  getTmpToken: (params = {}) => request.post(baseUrl.main + "/ba021/v1/auth/dynamic", params, { hideLoadingSpinner: true }),
  // called when the user already has token
  async setDynamicToken(params = {}) {
    // make sure it's not set twice
    if (Vue.prototype.$fileAccessToKen) {
      return;
    }

    const tmpTokenResp = await request.post(baseUrl.main + "/ba021/v1/auth/dynamic", params, { hideLoadingSpinner: true });

    if (tmpTokenResp && tmpTokenResp.success) {
      Vue.prototype.$fileAccessToKen = tmpTokenResp.data.token;
    }
  },
  imageUpload: async (params = {}) => {
    const fd = new FormData()

    for (let index = 0; index < params.files.length; index++) {
      const element = params.files[index]
      fd.append('files', element)
    }

    return request.post(`${baseUrl.main}/cb068/v1/file/upload/admin/image`, fd, { hideLoadingSpinner: true })
  }
}
