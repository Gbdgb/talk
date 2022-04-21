(function() {
    let isRepeat = false;
    //入口函数
    const init = () => {
        initEvent();
    }

    //事件入口函数
    const initEvent = () => {
        userName.addEventListener('blur', userNameBlur);
        formContainer.addEventListener('submit', formSubmit)
    }

    //表单提交事件函数
    const formSubmit = (e) => {
        e.preventDefault();
        const loginId = userName.value.trim();
        const nickname = userNickname.value.trim();
        const loginPwd = userPassword.value.trim();
        const confirmPwd = userConfirmPassword.value.trim();
        //表单验证
        if (!checkForm(loginId, nickname, loginPwd, confirmPwd)) {
            return;
        }
        //请求数据
        sendData(loginId, nickname, loginPwd);
    }

    //请求数据函数
    const sendData = async(loginId, nickname, loginPwd) => {
        const res = await fetchFn({
            url: '/user/reg',
            method: 'POST',
            params: { loginId, nickname, loginPwd }

        })
        res && window.location.replace('index.html');
    }

    //表单验证函数
    const checkForm = (loginId, nickname, loginPwd, confirmPwd) => {
        switch (true) {
            case !loginId:
                alert('注册用户名不能为空')
                return
            case !nickname:
                alert('昵称不能为空')
                return
            case !loginPwd:
                alert('注册密码不能为空')
                return
            case !confirmPwd:
                alert('确认密码不能为空')
                return
            case loginPwd !== confirmPwd:
                alert('两次输入的密码不一致')
                return
            case isRepeat:
                alert('账户名已经注册过，请更换注册名称')
            default:
                return true
        }
    }

    //用户名失去焦点的事件函数
    const userNameBlur = async() => {
        const loginId = userName.value.trim();
        if (!loginId) {
            return;
        }
        const res = await fetchFn({
            url: '/user/exists',
            method: 'GET',
            params: { loginId }
        });
        isRepeat = res;
        // const res = await fetch(`https://study.duyiedu.com/api/user/exists?loginId=${loginId}`);
        // const result = await res.json();
        // // "data": true // true表示该账号已存在，false表示该账号不存在
        // isRepeat = result.data;
        // if (result.code !== 0) {
        //     alert(result.mag);
        // }
    }
    init();
})()