$('#follow_btn').click(() => {
  console.log(location.href)
  // csrftoken
  chrome.cookies.getAll({url: 'https://shopee.tw'}, cookies => {
    console.log(cookies);
  });
  // chrome.runtime.sendMessage({greeting: '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
	// 	console.log('收到来自后台的回复：' + response);
	// });
  // $.ajax('https://www.baidu.com/s?wd=jquery%20ajax', {

  // }).done(function(res) {
  //   console.log(res)
  // });
}) 