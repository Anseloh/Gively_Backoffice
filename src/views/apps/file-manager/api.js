import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

// this is for globally used APIs only

export default {
  // images upload by this endpoint uploaded to production directly, hence persisted for ever
  imageUpload: (params = {}) => {
    const fd = new FormData()

    for (let index = 0; index < params.files.length; index++) {
      const element = params.files[index]
      fd.append('files', element)
    }

    return request.post(`${baseUrl.main}/cb068/v1/file/upload/public/file`, fd)
  }
}
