import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

/**
 * Base url of the cdn.
 */
const commonBaseUrl = process.env.NODE_ENV !== 'production' ? "https://staging-api.tranzak.me" : "https://api.tranzak.me";

/**
 * Upload files (audio or image) to the remote cdn.
 * 
 * @param {"image" | "audio"} path Where to upload the file
 * @param {Array} files Files to upload.
 * @returns {Promise<String>} Urls of the files in the same order there where sended.
 * @throws {Error}
 */
const uploadFile = (path, files) => {
  const url = `${commonBaseUrl}/cb068/v1/file/upload/chat/${path}`;

  const fd = new FormData();

  console.log(files);

  for (let index = 0; index < files.length; index++) {
    const element = files[index]
    fd.append('files', element)
  }

  return request.post(url, fd, { hideLoadingSpinner: true });
};

export default {
  /**
   * Upload images to cdn.
   * 
   * @param {Array} images What to upload.
   * @returns {Promise<String>} Urls of the images in the same order there where sended.
   */
  uploadImages: async (...images) => {
    try {
      const result = await uploadFile("image", images);
      
      return result.data.path;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }, 
  /**
   * Upload audios to cdn.
   * 
   * @param {Array} audios What to upload.
   * @returns {Promise<String>} Urls of the audios in the same order there where sended.
   */  
  uploadAudios: async (...audios) => {
    try {
      const result = await uploadFile("audio", audios);
      
      return result.data.path;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
