import axios from '@axios'

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        uploadFile(params = {}) {
            return new Promise((resolve, reject) => {
                const fd = new FormData()

                for (let index = 0; index <= params.files.length; index++) {
                    const element = params.files[index]
                    fd.append('files', element)
                }

                axios
                    .post('http://192.168.30.8:3003/v1/file/upload/admin/image', fd, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
    },
}