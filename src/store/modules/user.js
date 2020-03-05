import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES:(state, roles)=>{
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    var password =userInfo.password
    var port = userInfo.port
    var username = userInfo.username
    return new Promise((resolve, reject) => {
      login({             
        "password": password,
        "userType": port,
        "username": username
      }).then(response => {
        var res = response.data 
        const { data } = res
        //0：admin，1：professor 2：user
        var roles 
        if(data.userType===0){roles = 'admin'}
        else if(data.userType ===1){roles = 'professor'}
        else if(data.userType ===2){roles = 'user'}
        commit('SET_TOKEN', data.token)
        commit('SET_NAME',data.username)
        commit('SET_ROLES',roles)
        setToken(data.token)
        
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        var res =  response.data;
        const { data } = res

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

