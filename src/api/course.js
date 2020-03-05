import request from '@/utils/request'

//课室模块
export function getCourseInfo(data){
    return request({
        url:`/dbe/course/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: 'get',
    })
}
export function getCourseInfoID(id) { 
    return request ({
        url:`/dbe/course/info/${id}`,
        method:"get",
    })
 }

 export function deleteCourse(data) { 
    return request ({
        url:`/dbe/course/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateCourse(data) { 
    return request ({
        url:`/dbe/course/update`,
        method:"put",
        data
    })
  }
  export function saveCourse(data) {
      return request ({
        url:`/dbe/course/save`,
        method:"post",
        data
    })
  }


