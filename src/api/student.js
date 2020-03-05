import request from '@/utils/request'

//学生模块
export function getStuedentInfo(data){
    return request({
        url:`/dbe/studentInfo/list?pageNum=${data.pageNum}&pageSize=${data.pageSize}`,
        method: 'get',
    })
}
export function getStuedentInfoID(id) { 
    return request ({
        url:`/dbe/studentInfo/info/${id}`,
        method:"get",
    })
 }

 export function deleteStuedent(data) { 
    return request ({
        url:`/dbe/studentInfo/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateStuedent(data) { 
    return request ({
        url:`/dbe/studentInfo/update`,
        method:"put",
        data
    })
  }
  export function saveStuedent(data) {
      return request ({
        url:`/dbe/studentInfo/save`,
        method:"post",
        data
    })
  }
  export function getClassList() {
    return request ({
        url:`/dbe/studentInfo/listCla`,
        method:"get",
        
    })
    }
