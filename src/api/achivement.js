import request from '@/utils/request'

//达成度模块
export function getCourseAchivement(id) { 
    return request ({
        url:`/dbe/courseAchievement/list?courseId=${id}`,
        method:"get",
    })
 }
 export function postCoursetCalculate(id) {
    return request ({
      url:`/dbe/courseAchievement/calculate?courseId=${id}`,
      method:"post",
      
  })
}
 export function getIndividualAchivement(id) { 
    return request ({
        url:`/dbe/courseIndividualAchievement/listByCourseId?courseId=${id}`,
        method:"get",
    })
 }
 export function postIndividualCalculate(id) {
    return request ({
      url:`/dbe/courseIndividualAchievement/calculate?courseId=${id}`,
      method:"post",
      
  })
}
 export function getRequirementAchivement(id) { 
    return request ({
        url:`/dbe/requirementAchievement/listByCourseId?courseId=${id}`,
        method:"get",
    })
 }
 export function postRequirementCalculate(id) {
    return request ({
      url:`/dbe/requirementAchievement/calculate?courseId=${id}`,
      method:"post",
      
  })
}
 export function getTotalAchivement(pageNum,pageSize){
    return request({
        url:`/dbe/totalAchievement/list?pageNum=${pageNum}&pageSize=${pageSize}`,
        method: 'get',
    })
}