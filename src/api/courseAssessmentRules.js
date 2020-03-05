import request from '@/utils/request'

//课程考核细则模块
export function getCourseAssessmentRule(pageNum,pageSize){
    return request({
        url:`/dbe/courseAssessmentRule/list?pageNum=${pageNum}&pageSize=${pageSize}`,
        method: 'get',
    })
}
export function getCourseAssessmentRuleID(id) { 
    return request ({
        url:`/dbe/courseAssessmentRule/info/${id}`,
        method:"get",
    })
 }
 export function getCourseAssessmentRuleByAssessmentID(id) { 
    return request ({
        url:`/dbe/courseAssessmentRule/listByAssessmentId?assessmentId=${id}`,
        method:"get",
    })
 }

 export function deleteCourseAssessmentRule(data) { 
    return request ({
        url:`/dbe/courseAssessmentRule/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateCourseAssessmentRule(data) { 
    return request ({
        url:`/dbe/courseAssessmentRule/update`,
        method:"put",
        data
    })
  }
  export function saveCourseAssessmentRule(data) {
      return request ({
        url:`/dbe/courseAssessmentRule/save`,
        method:"post",
        data
    })
  }

  //课程细则与目标关联
  export function getRuleObject(pageNum,pageSize){
    return request({
        url:`/dbe/ruleObjective/list?pageNum=${pageNum}&pageSize=${pageSize}`,
        method: 'get',
    })
}
export function getRuleObjectID(id) { 
    return request ({
        url:`/dbe/ruleObjective/info/${id}`,
        method:"get",
    })
 }
export function getRuleObjectByRuleId(id){
    return request ({
        url:`/dbe/ruleObjective/listByRuleId?ruleId=${id}`,
        method:"get",
    })
}
 export function deleteRuleObject(data) { 
    return request ({
        url:`/dbe/ruleObjective/delete`,
        method:"delete",
        data:data
    })
  }
  export function updateRuleObject(data) { 
    return request ({
        url:`/dbe/ruleObjective/update`,
        method:"put",
        data
    })
  }
  export function saveRuleObject(data) {
      return request ({
        url:`/dbe/ruleObjective/save`,
        method:"post",
        data
    })
  }
