import request from '@/utils/request'

//课程表模块
export function getClassSchedule(data){
    var str = ""
    if(data.studentNum!=""){
        str+= `&studentNum=${data.studentNum}`
    }
    if(data.courseId!=""){
        str+=`&courseId=${data.courseId}`
    }
    if(data.teacherId!=""){
        str+=`&teacherId=${data.teacherId}`
    }
    return request({
        url:`/dbe/classSchedule/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}${str}`,
        method: 'get',
    })
}
export function getClassScheduleID(id) { 
    return request ({
        url:`/dbe/classSchedule/info/${id}`,
        method:"get",
    })
 }

 export function deleteClassSchedule(data) { 
    return request ({
        url:`/dbe/classSchedule/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateClassSchedule(data) { 
    return request ({
        url:`/dbe/classSchedule/update`,
        method:"put",
        data
    })
  }
  export function saveClassSchedule(data) {
      return request ({
        url:`/dbe/classSchedule/Elective`,
        method:"post",
        data
    })
  }
