import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/rov/generator/token/login',
    method: 'post',
    data
  })
}
//注册
export function register(data){
  return request({
    url:'/rov/generator/token/register',
    method:'put',
    data
  })
}
//获取邮箱验证码
export function getCode(email){
  return request({
    url:'/rov/generator/token/getCode',
    method:'put',
    data:email
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/rov/generator/token/exit',
    method: 'PUT',
    data:{"token": token}
  })
}
//忘记密码
export function foregeAdminPass(data ){
  return request({
    url:'/rov/generator/lookingForPWD/adminUpdatePassWordByEmail',
    method:"post",
    data:data
  })
}

export function forgetUserPass(data){
  return request({
    url:'/rov/generator/lookingForPWD/userUpdatePassWordByEmail',
    method:"post",
    data:data
  })
}

export function sendCode(email){
  return request({
    url:'/rov/generator/lookingForPWD/sendCode',
    method:'post',
    data:{'email':email}
  })
}
