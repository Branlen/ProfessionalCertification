import request from '@/utils/request'

//教师模块
export function getTeacherInfo(data){
    return request({
        url:`/dbe/teacherInfo/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: 'get',
    })
}
export function getTeacherInfoID(id) { 
    return request ({
        url:`/dbe/teacherInfo/info/${id}`,
        method:"get",
    })
 }

 export function deleteTeacher(data) { 
    return request ({
        url:`/dbe/teacherInfo/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateTeacher(data) { 
    return request ({
        url:`/dbe/teacherInfo/update`,
        method:"put",
        data
    })
  }
  export function saveTeacher(data) {
      return request ({
        url:`/dbe/teacherInfo/save`,
        method:"post",
        data
    })
  }
  export function getTeacherRoleInfo(data){
    return request({
        url:`/dbe/teacherInfo/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: 'get',
    })
}
//教师和角色关联模块
export function getTeacherRoleInfoID(id) { 
    return request ({
        url:`/dbe/teacherRole/info/${id}`,
        method:"get",
    })
 }

 export function deleteTeacherRole(data) { 
    return request ({
        url:`/dbe/teacherRole/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateTeacherRole(data) { 
    return request ({
        url:`/dbe/teacherRole/update`,
        method:"put",
        data
    })
  }
  export function saveTeacherRole(data) {
      return request ({
        url:`/dbe/teacherRole/save`,
        method:"post",
        data
    })
  }
 