//把基础路径存储到变量中，后期直接拼接即可
const BASE_URL = 'https://study.duyiedu.com/api';

//请求数据函数
const fetchFn = async({ url, method = 'GET', params = {} }) => {
    let result;
    const extendsObj = {};
    sessionStorage.token && (extendsObj.Authorization = 'Bearer ' + sessionStorage.token)
        //get请求的参数拼接
    if (method === 'GET' && Object.keys(params).length) {
        // key=value & key1=value1
        url += '?' + Object.keys(params).map(key => ''.concat(key, '=', params[key])).join('&');
    }
    try {
        const res = await fetch(BASE_URL + url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...extendsObj
            },
            body: method === 'GET' ? null : JSON.stringify(params)
        });
        //当登录成功时，服务器会发送一个token，在响应头中进行获取，该token中记录身份令牌
        const token = res.headers.get('Authorization');
        //存储token的值
        token && (sessionStorage.token = token);
        // console.log('token的值是:' + token);
        result = await res.json();
        // console.log(result);
        if (result.code === 0) {
            //如果有chatTotal这个属性，就把这个也返回 这个是代表所有聊天记录的总数
            if (result.hasOwnProperty('chatTotal')) {
                result.data = { chatTotal: result.chatTotal, data: result.data }
            }
            return result.data;
        } else {
            /* 权限错误处理 */
            if (result.status === 401) {
                alert('权限token不正确');
                sessionStorage.removeItem('token');
                window.location.replace('login.html');
                return;
            }
            alert(result.msg);
        }
    } catch (error) {
        console.log(error);
    }
}