import request from '@/utils/request'

//毕业要求模块
export function getGraduateRequirement(pageNum,pageSize){
    return request({
        url:`/dbe/graduationRequirement/list?pageNum=${pageNum}&pageSize=${pageSize}`,
        method: 'get',
    })
}
export function getGraduateRequirementID(id) { 
    return request ({
        url:`/dbe/graduationRequirement/info/${id}`,
        method:"get",
    })
 }

 export function deleteGraduateRequirement(data) { 
    return request ({
        url:`/dbe/graduationRequirement/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateGraduateRequirement(data) { 
    return request ({
        url:`/dbe/graduationRequirement/update`,
        method:"put",
        data
    })
  }
  export function saveGraduateRequirement(data) {
      return request ({
        url:`/dbe/graduationRequirement/save`,
        method:"post",
        data
    })
  }
//毕业要求和指标关联
export function getRequirementIndicator(pageNum,pageSize){
    return request({
        url:`/dbe/requirementIndicator/list?pageNum=${pageNum}&pageSize=${pageSize}`,
        method: 'get',
    })
}
export function getRequirementIndicatorID(id) { 
    return request ({
        url:`/dbe/requirementIndicator/info/${id}`,
        method:"get",
    })
 }

 export function deleteRequirementIndicator(data) { 
    return request ({
        url:`/dbe/requirementIndicator/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateRequirementIndicator(data) { 
    return request ({
        url:`/dbe/requirementIndicator/update`,
        method:"put",
        data
    })
  }
  export function saveRequirementIndicator(data) {
      return request ({
        url:`/dbe/requirementIndicator/save`,
        method:"post",
        data
    })
  }