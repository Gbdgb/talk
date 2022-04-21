(function() {
    //获取dom函数
    function $(selector) {
        return document.querySelector(selector);
    }

    //元素
    //备注：其实有id名的元素，可以不用获取，直接拿来用，此类元素会成为window的属性
    const doms = {
        userName: $('#userName'),
        userPwd: $('#userPassword')
    }

    // 入口函数
    const init = () => {
        initEvent();
    }

    //所有的事件在这个函数里注册
    const initEvent = () => {
        formContainer.addEventListener('submit', formSubmitClick)
    }

    //创建表单提交的事件函数
    const formSubmitClick = (e) => {
        e.preventDefault(); //阻止表单默认行为：刷新页面
        const loginId = doms.userName.value.trim();
        const loginPwd = doms.userPwd.value.trim();
        if (!loginId || !loginPwd) {
            alert('用户名或密码不能为空');
        }
        //发送数据
        sendData(loginId, loginPwd);
    }

    //创建发送数据函数
    const sendData = async(loginId, loginPwd) => {
        const res = await fetchFn({
            url: '/user/login',
            method: 'POST',
            params: { loginId, loginPwd }
        });
        //没有错误的话，跳转到主页,location.replace() 替换当前页面,但不记录历史，不可后退页面；location.assign 跟href一样可以跳转页面，记录浏览历史，可以后退页面
        //这里有个问题，老师写的是window.location.replace('/')，但是我写了之后跳转不到首页
        res && window.location.replace('index.html');
    }

    init();
})()