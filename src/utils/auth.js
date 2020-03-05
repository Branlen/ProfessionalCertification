import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function currentRoles(){
  var port = getToken()
  if(port==0){
    return "admin"
  }else if(port==1){
    return "courseLeader"
  }else if(port==2){
    return "outlineCompilers"
  }else if(port==3){
    return "teacher"
  }
}