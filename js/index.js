(function() {
    function $(selector) {
        return document.querySelector(selector);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    //dom元素
    const doms = {
        nickName: $('.nick-name'),
        accountName: $('.account-name'),
        loginTime: $('.login-time'),
        content: $('.content-body'),
        sendBtn: $('.send-btn'),
        inputValue: $('.input-container'),
        arrowBtn: $('.arrow-container'),
        select: $('.select-container'),
        selectItem: $$('.select-item'),
        closeBtn: $('.close')
    };

    let page = 0; //获取聊天记录的参数1
    let size = 10; //获取聊天记录的参数2
    let chatTotal = 0; //保存聊天记录总数
    let sendType = 'enter'; //发送按键类型
    //入口函数
    const init = () => {
        getUserInfo(); //获取用户信息
        initChatList('bottom'); //获取聊天历史记录
        initEvent(); //相关的事件
    }

    //事件函数
    const initEvent = () => {
        doms.sendBtn.addEventListener('click', sendEvent);
        doms.content.addEventListener('scroll', scrollEvent);
        doms.arrowBtn.addEventListener('click', arrowBtnEvent);
        doms.selectItem.forEach(item => item.addEventListener('click', selectItemEvent));
        doms.inputValue.addEventListener('keyup', inputEvent);
        doms.closeBtn.addEventListener('click', closeBtnEvent);
    }

    //关闭按钮的点击事件函数
    const closeBtnEvent = () => {
        //清空sessionStorage
        sessionStorage.removeItem('token');
        //界面的跳转
        window.location.replace('login.html');
    }

    //消息框的键盘按键松开的事件函数
    const inputEvent = (e) => {
        // console.log(e.key, sendType, e.ctrlKey);
        //第一种就是 按键为 enter 第二种就是 按键为 ctrlEnter
        if (e.key === 'Enter' && sendType === 'enter' && !e.ctrlKey || e.key === 'Enter' && sendType === 'ctrlEnter' && e.ctrlKey) {
            doms.sendBtn.click();
        }
    }

    //选择发送按键类型的点击事件函数
    const selectItemEvent = function() {
        //有特殊高亮的样式
        const beforeActive = $('.select-item.on');
        beforeActive && beforeActive.classList.remove('on');
        this.classList.add('on');
        // 选择哪种按键类型，就赋值哪种
        sendType = this.getAttribute('type');
        doms.select.style.display = 'none';
    }

    //箭头点击事件函数
    const arrowBtnEvent = () => {
        //点击箭头，它下面的select-container 显示出来
        doms.select.style.display = 'block';
    }

    //聊天框的滚动事件函数
    const scrollEvent = function() {
        //滚动到顶部，加载第二页数据
        if (this.scrollTop === 0) {
            //判断后端是否还有数据
            if (chatTotal <= (page + 1) * size) {
                return;
            }
            page++;
            initChatList('top');
        }
    }

    //发送按钮的点击事件函数
    const sendEvent = async() => {
        //判断消息框是空的情况
        const content = doms.inputValue.value.trim();
        if (!content) {
            alert('发送消息不能为空');
            return;
        }
        //消息框不为空,则渲染用户发送的消息到页面上
        renderChat([{
            from: 'user',
            content
        }], 'bottom');
        //渲染之后清空消息框
        doms.inputValue.value = '';
        //把新消息的数据发送给后端
        const res = await fetchFn({
            url: '/chat',
            method: 'POST',
            params: { content }
        });
        // console.log(res);
        renderChat([{
            from: 'robot',
            content: res.content
        }], 'bottom');
    }

    //获取聊天历史记录的函数
    const initChatList = async(state) => {
        const res = await fetchFn({
            url: '/chat/history',
            params: {
                page,
                size
            }
        });
        chatTotal = res.chatTotal;
        //渲染聊天界面
        renderChat(res.data, state);
    }

    //渲染聊天界面函数
    const renderChat = (res, state) => {
        //如果没有历史记录
        if (!res.length) {
            doms.content.innerHTML = `<div class="chat-container robot-container">
                <img src="./img/robot.jpg" alt="">
                <div class="chat-txt">
                    您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                </div>
            </div>`
            return;
        }
        //如果有历史记录，就左右两侧分别渲染
        const chatData = res.map(item => {
            //右边是用户 user
            return item.from === 'user' ?
                ` <div class="chat-container avatar-container">
                    <img src="./img/avtar.png" alt="">
                    <div class="chat-txt">${item.content}</div>
               </div>` :
                `<div class="chat-container robot-container">
                        <img src="./img/robot.jpg" alt="">
                        <div class="chat-txt">${item.content}</div>
                </div>`
        });
        //判断状态
        if (state === 'bottom') {
            doms.content.innerHTML += chatData.reverse().join('');
            //找到最后一条消息，把滚动条滚动到最新消息的位置
            const bottomDis = document.querySelectorAll('.chat-container')[document.querySelectorAll('.chat-container').length - 1].offsetTop;
            doms.content.scrollTo(0, bottomDis);
        } else {
            doms.content.innerHTML = chatData.reverse().join('') + doms.content.innerHTML;
        }
    }

    //获取用户信息的函数
    const getUserInfo = async() => {
        const res = await fetchFn({
            url: '/user/profile',
        });
        // console.log(res);
        doms.nickName.innerHTML = res.nickname;
        doms.accountName.innerHTML = res.loginId;
        doms.loginTime.innerHTML = formaDate(res.lastLoginTime);
    }

    init();
})()