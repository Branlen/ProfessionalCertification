import request from '@/utils/request'

//成绩模块
export function downloadScoreTemp(teacherID,couresId){

    return request({
        url:`/dbe/courseScore/downloadExcel?teacherId=${teacherID}&courseId=${couresId}`,
        method: 'get',
        headers: {
          "Accept": "application/octet-stream;charset=UTF-8"
      },
      responseType: 'blob'
    })
}



  export function saveCourseScore(teacherID,courseId,data) {
      return request ({
        url:`/dbe/courseScore/uploadExcel?teacherId=${teacherID}&courseId=${courseId}`,
        method:"post",
        headers:{
          "Content-Type":" multipart/form-data; boundary=----WebKitFormBoundaryr4vfChncTkYJE17A"
        },
        data 
    })
  }
