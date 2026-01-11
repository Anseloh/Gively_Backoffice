import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

let servicePath = "/backoffice"
const moduleBaseUrl = baseUrl.main + servicePath;

export default {
    transactionList: () => request.get(moduleBaseUrl + '/transaction/list', {}),
    transactionSales: () => request.get(moduleBaseUrl + '/transaction/sales', {}),
    transactionView: txnID => request.get(moduleBaseUrl + '/transaction/view' + txnID),
    settlementBankList: (param = '', hideLoader) => request.get(moduleBaseUrl + '/settlement/list-settlements' + param, {hideLoadingSpinner: hideLoader }),
    reconcileSettlement: (param = {}) => request.post(moduleBaseUrl + '/settlement/execute-settlement', param),
    settlementBatchesList: (params = '', hideLoader) => request.get(moduleBaseUrl + '/settlement/list-batches' + params, {hideLoadingSpinner: hideLoader}),
    createBankSettlement: params => request.post(moduleBaseUrl + '/settlement/create-bank-settlement', params),
    executeSettlement: () => request.get(moduleBaseUrl + '/settlement/execute-settlement', {}),
    genBatchFiles: params => request.post(moduleBaseUrl + `/settlement/gen-batch-files`,params),
    getBatchFiles: params => request.get(moduleBaseUrl + `/settlement/gen-batch-files?${params}`),
    updateBatchResp: () => request.get(moduleBaseUrl + '/settlement/update-batch-response', {}),
    downloadBatch: (params = {}) => request.get(moduleBaseUrl + `/settlement/download-batch-file?batchId=${params}`),
    uploadResponse: (params = {}, batchId) => {
        const fd = new FormData()

        for (let index = 0; index < params.files.length; index++) {
            const element = params.files[index]
            fd.append('uploadedFile', element)
        }

        return request.post(moduleBaseUrl + `/settlement/upload-response-file?batchId=${batchId}`, fd)
    },

    // { hideLoadingSpinner: true }
}