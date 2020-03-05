import request from '@/utils/request'

//课程考核模块
export function getIndicator(pageNum, pageSize,requirementId) {
  return request({
    url: `/dbe/indicator/list?pageNum=${pageNum}&pageSize=${pageSize}&requirementId=${requirementId}`,
    method: 'get',
  })
}
export function getIndicatorID(id) {
  return request({
    url: `/dbe/indicator/info/${id}`,
    method: "get",
  })
}

export function deleteIndicator(data) {
  return request({
    url: `/dbe/indicator/delete`,
    method: "delete",
    data: data
  })
}
export function updateIndicator(data) {
  return request({
    url: `/dbe/indicator/update`,
    method: "put",
    data
  })
}
export function saveIndicator(data) {
  return request({
    url: `/dbe/indicator/save`,
    method: "post",
    data
  })
}
//指标与课程关联
export function getIndicatorCourse(pageNum, pageSize) {
  return request({
    url: `/dbe/indicatorCourse/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get',
  })
}
export function getIndicatorCourseID(id) {
  return request({
    url: `/dbe/indicatorCourse/info/${id}`,
    method: "get",
  })
}
export function getIndicatorCourseByIndicatorId(id) {
  return request({
    url: `/dbe/indicatorCourse/listByIndicatorId?indicatorId=${id}`,
    method: "get",
  })
}

export function deleteIndicatorCourse(data) {
  return request({
    url: `/dbe/indicatorCourse/delete`,
    method: "delete",
    data: data
  })
}
export function updateIndicatorCourse(data) {
  return request({
    url: `/dbe/indicatorCourse/update`,
    method: "put",
    data
  })
}
export function saveIndicatorCourse(data) {
  return request({
    url: `/dbe/indicatorCourse/save`,
    method: "post",
    data
  })
}

//课程指标与目标关联模块
export function getCourseIndicatorObjective(pageNum, pageSize) {
    return request({
      url: `/dbe/courseIndicatorObjective/list?pageNum=${pageNum}&pageSize=${pageSize}`,
      method: 'get',
    })
  }
  export function getCourseIndicatorObjectiveID(id) {
    return request({
      url: `/dbe/courseIndicatorObjective/info/${id}`,
      method: "get",
    })
  }
  export function getCourseIndicatorObjectiveByIndicatorId(id) {
    return request({
      url: `/dbe/courseIndicatorObjective/listByIndicatorId?indicatorId=${id}`,
      method: "get",
    })
  }
  export function deleteCourseIndicatorObjective(data) {
    return request({
      url: `/dbe/courseIndicatorObjective/delete`,
      method: "delete",
      data: data
    })
  }
  export function updateCourseIndicatorObjective(data) {
    return request({
      url: `/dbe/courseIndicatorObjective/update`,
      method: "put",
      data
    })
  }
  export function saveCourseIndicatorObjective(data) {
    return request({
      url: `/dbe/courseIndicatorObjective/save`,
      method: "post",
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