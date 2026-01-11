import request from "@/services/request"
import baseUrl from "@/services/baseUrl"

// this is for globally used APIs only

// const moduleBaseUrl = `${'http://localhost:6110'}/v1`;
const moduleBaseUrl = `${baseUrl}/v1`;

export default {
  getAcademicYears: scopeId => request.post(`${moduleBaseUrl}/uploads/academics`, { scopeId }),
  uploadStudents: (yearId, classId,  file) => {
    const fd = new FormData();

    fd.append('yearId', yearId);
    fd.append('classId', classId);
    fd.append('file', file);

    return request.post(`${moduleBaseUrl}/uploads/students`, fd);
  }
}
