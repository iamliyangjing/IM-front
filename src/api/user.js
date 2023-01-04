import request from '@/utils/request'

//登录
export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data:data
    })
}

//登出
export function loginOut() {
    return request({
        url: '/user/loginOut',
        method: 'get',
   })
}

// 发送邮箱验证码
export function sendEmail(emailAddress) {
    return request({
        url: `/user/email/${emailAddress}`,
        method: 'get',
    })
}

//验证邮箱验证码
export function TestEmailCode(emailAddress,code) {
    return request({
        url: `/user/email/code?emailAddress=${emailAddress}&code=${code}`,
        method: 'post',
    })
}

// 注册账号
export function register(userInfo) {
    return request({
        url: '/user/registerForUserInfo',
        method: 'post',
        data:userInfo
    })
}
