chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  console.log('收到消息')
  sendResponse('111')
  chrome.cookies.getAll({url: 'https://vmspub-view.pre.weidian.com'}, cookies => {
    console.log(cookies);
  });
})