
import Vue from "vue";
import router from "@/router/index";
import utils from "@/utils/index";
import useJwt from '@/auth/jwt/useJwt'
import eventBus from "./event-bus";

const axios = require("axios");

const https = require('https');

let activePendingRequestWithLoader = 0;

const defaultExtraOptions = {
  hideLoadingSpinner: false,
};

var instance = axios.create({
  // httpsAgent: new https.Agent({
  //   rejectUnauthorized: false
  // })
  baseURL: "",
  timeout: 60 * 1000 * 5
});

instance.interceptors.request.use(function (param) {
  if (param && param.data && param.data.isFormData) {
    var postData = new FormData();
    if (param.data) {
      var keys = Object.keys(param.data);
      for (var i = 0; i < keys.length; i++) {
        postData.append(keys[i], param.data[keys[i]]);
      }
    }
    param.data = postData;
  }
  return param;
});

/**
 * Runs loader stuffs before the request is sended.
 *
 * @param {Boolean} hideLoadingSpinner indicates whether to hide the loader.
 */
const requestLoaderPreProcessor = (hideLoadingSpinner = false) => {
  if(hideLoadingSpinner) return;

  if (activePendingRequestWithLoader <= 0) eventBus.$emit('REQUEST_PENDING_INVOKE_LOADER', true);
  activePendingRequestWithLoader += 1;
};

/**
 * Runs loader stuffs after the request is completed.
 *
 * @param {Boolean} hasHideLoader indicates whether the request required to hide the loader..
 */
const requestLoaderPostProcessor = (hasHideLoader = false) => {
  if(hasHideLoader) return;

  const val = activePendingRequestWithLoader - 1;

  if (val <= 0) {
    eventBus.$emit('REQUEST_PENDING_INVOKE_LOADER', false);
  }

  activePendingRequestWithLoader -= 1;
};

var processResponse = function (response, path, data, extra) {
  requestLoaderPostProcessor(extra.hideLoadingSpinner);

  console.log("From request------------------->", response);

  if (response && response.data && (response.data.errorMsg || response.data.errorCode)) {
    if (response.data.errorCode == 40001 || response.data.errorCode == 40002) {

      // Remove userData from localStorage
      // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)

      // Remove userData from localStorage
      localStorage.removeItem('userData')

      // Redirect to login page
      router.push({ name: 'admin-login' })
      return;
    }

    const vm = new Vue();

    vm.$bvToast.toast(response.data.errorMsg, {
      title: `Error`,
      solid: false,
      toaster: 'b-toaster-top-center',
      variant: 'primary',
      autoHideDelay: 20000
    });
  }

  // if (response && response.data && response.data.message) {

  //   vm.$bvToast.toast(response.data.message, {
  //     title: `Error`,
  //     solid: false,
  //     toaster: 'b-toaster-top-center',
  //     variant: 'primary',
  //   });
  // }

  return response.data;
};

var processError = function (responseError, path) {
};

const getRequestConfig = function (params, extra = {}) {
  // hide loading
  if (extra.hideLoadingSpinner) {
    // handleLoading(false);
  } else {
    // handleLoading(true);
  }

  let env = process.env.NODE_ENV;

  // const requestToken = extra.noToken ? "" : utils.getQueryParams().token;
  const exitingToken = localStorage.getItem(useJwt.jwtConfig.storageTokenKeyName);


  const requestToken = "Bearer " + (exitingToken ? exitingToken.replaceAll('"', '') : '');

  // config
  return {
    baseURL: "",
    headers: {
      "X-Force-Object": "0",
      "X-Platform": "H5",
      "X-System": "",
      "X-Brand": "",
      "X-Model": "",
      "X-Language": "",
      "X-Network": "",
      "X-Lat": "",
      "X-Lon": "",
      "Authorization": requestToken,
      // "X-Token": requestToken || "",
      // "X-app-version": RELEASE_VERSION || "", // 暂未使用
      "X-Nonce": "",
      "X-App-ID": "qyhnul9mqiph",
      "X-Platform-Id": "qyhnul9mqiph",
      "X-App-Market": "",
      "X-Tz-Distinct-Id": utils.getDistinctId(),
    }, // `params` are the URL parameters to be sent with the request // `headers` are custom headers to be sent
    // Must be a plain object or a URLSearchParams object
    // params: {},
    data: {},
    timeout: extra.timeout || 60 * 1000, // You may modify the headers object. // 默认30秒。可以按照具体业务修改timeout 值
    responseType: "json"
  }; // default
};

const unkownResult = {
  err: {
    ec: "0",
    em: "Unknown Issue"
  },
  isUnkownError: true
};

export default {
  post: function (path, data, extra = { hideLoadingSpinner: false }) {
    requestLoaderPreProcessor(extra.hideLoadingSpinner);
    return instance.post(path, data, getRequestConfig({}, extra)).then(response => {
      let result = processResponse(response, path, data, extra);
      if (result && result.err) {
        throw result;
      } else if (result) {
        return result;
      } else {
        return {};
      }
    })
      .catch(err => {
        console.log("-----||||||||||||||err--api||||||||||------>>>--", err);
        requestLoaderPostProcessor(extra.hideLoadingSpinner);
        throw err;
      });
  },
  put: function (path, data, extra = { hideLoadingSpinner: false }) {
    requestLoaderPreProcessor(extra.hideLoadingSpinner);
    return instance.put(path, data, getRequestConfig({}, extra)).then(response => {
      let result = processResponse(response, path, data, extra);
      if (result && result.err) {
        throw result;
      } else if (result) {
        return result;
      } else {
        return {};
      }
    })
      .catch(err => {
        console.log("-----||||||||||||||err--api||||||||||------>>>--", err);
        requestLoaderPostProcessor(extra.hideLoadingSpinner);
        throw err;
      });
  },
  get: function (path, extra = { hideLoadingSpinner: false }) {
    requestLoaderPreProcessor(extra.hideLoadingSpinner);
    return instance
      .get(path, getRequestConfig({}, extra))
      .then(response => {
        let result = processResponse(response, path, null, extra);
        if (result.err) {
          throw result;
        } else {
          return result;
        }
      })
      .catch(() => {
        processError(unkownResult, path);
        requestLoaderPostProcessor(extra.hideLoadingSpinner);
        throw unkownResult;
      });
  }
};
