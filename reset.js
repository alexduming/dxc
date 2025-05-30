// 重置脚本 - 清除本地存储并重新加载页面
(function() {
    console.log('正在清除本地存储...');
    localStorage.clear();
    console.log('本地存储已清除，页面将重新加载');
    
    // 显示提示信息
    const resetMessage = document.createElement('div');
    resetMessage.style.position = 'fixed';
    resetMessage.style.top = '50%';
    resetMessage.style.left = '50%';
    resetMessage.style.transform = 'translate(-50%, -50%)';
    resetMessage.style.backgroundColor = '#1E90FF';
    resetMessage.style.color = 'white';
    resetMessage.style.padding = '20px';
    resetMessage.style.borderRadius = '10px';
    resetMessage.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
    resetMessage.style.zIndex = '9999';
    resetMessage.style.fontSize = '16px';
    resetMessage.style.fontWeight = 'bold';
    resetMessage.style.textAlign = 'center';
    resetMessage.innerHTML = '数据重置中...<br>正在加载哆啦A梦道具列表';
    
    document.body.appendChild(resetMessage);
    
    // 1秒后重新加载页面
    setTimeout(function() {
        window.location.reload();
    }, 1000);
})(); 