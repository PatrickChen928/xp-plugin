setTimeout(() => {
	initCustomPanel();
	injectCustomJs();
}, 6000)

function initCustomPanel() {
  var panel = document.createElement('div');
	panel.innerHTML = `
		<div class="btn-area">
			<a class="btn-item follow-btn" href="javascript:invokeContentScript('follow')">关注店铺粉丝</a>
			<a class="btn-item" href="javascript:invokeContentScript('unfollow')">取关粉丝</a>
		</div>
	`;
	document.body.appendChild(panel);
}

// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		chrome.runtime.sendMessage({ type: 'cookie' }, (cookies) => {
			window.postMessage({cmd: 'setCookie', data: cookies}, '*');
		});
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}

function sendMessage(type) {
	chrome.runtime.sendMessage({ type });
}

window.addEventListener("message", function(e) {
	const cmd = e.data && e.data.cmd;
	if (!cmd) {
		return;
	} else {
		sendMessage(cmd)
	}
}, false);