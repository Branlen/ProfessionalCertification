import request from '@/utils/request'

//学生模块
export function getCourseObjective(pageNum,pageSize,courseId){
    if(courseId==undefined){
        return request({
            url:`/dbe/courseObjective/list?pageNum=${pageNum}&pageSize=${pageSize}`,
            method: 'get',
        })
    }
    return request({
        url:`/dbe/courseObjective/list?pageNum=${pageNum}&pageSize=${pageSize}&courseId=${courseId}`,
        method: 'get',
    })
}
export function getCourseObjectiveID(id) { 
    return request ({
        url:`/dbe/courseObjective/info/${id}`,
        method:"get",
    })
 }

 export function deleteCourseObjective(data) { 
    return request ({
        url:`/dbe/courseObjective/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateCourseObjective(data) { 
    return request ({
        url:`/dbe/courseObjective/update`,
        method:"put",
        data
    })
  }
  export function saveCourseObjective(data) {
      return request ({
        url:`/dbe/courseObjective/save`,
        method:"post",
        data
    })
  }
