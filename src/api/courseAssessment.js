import request from '@/utils/request'

//课程考核模块
export function getCourseAssessment(pageNum,pageSize){
    return request({
        url:`/dbe/courseAssessment/list?pageNum=${pageNum}&pageSize=${pageSize}`,
        method: 'get',
    })
}
export function getCourseAssessmentID(id) { 
    return request ({
        url:`/dbe/courseAssessment/info/${id}`,
        method:"get",
    })
 }

 export function deleteCourseAssessment(data) { 
    return request ({
        url:`/dbe/courseAssessment/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateCourseAssessment(data) { 
    return request ({
        url:`/dbe/courseAssessment/update`,
        method:"put",
        data
    })
  }
  export function saveCourseAssessment(data) {
      return request ({
        url:`/dbe/courseAssessment/save`,
        method:"post",
        data
    })
  }
