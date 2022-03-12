$('#follow_btn').click(() => {
  console.log(location.href)
  // csrftoken
  // chrome.cookies.getAll({url: 'https://shopee.tw'}, cookies => {
  //   console.log(cookies);
  // });
  // 获取店铺关注者接口
  // GET
  // https://shopee.tw/shop/1370087/followers/?offset=20&limit=20&offset_of_offset=0&_=1646889391245
  // chrome.runtime.sendMessage({greeting: '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
	// 	console.log('收到来自后台的回复：' + response);
	// });
  $.ajax('https://shopee.tw/shop/1370087/followers/?offset=0&limit=20&offset_of_offset=0&_=' + Date.now(), {
    headers: {
      "x-requested-with":"XMLHttpRequest"
    }
  }).done(function(res) {
    const userids = getUnfollowArr(res);
    console.log(userids)
    
  });
});
follow();
function follow() {
  // 
  let formData = new FormData();
  formData.append('csrfmiddlewaretoken', 'h7wlaCBe5cM98mMY1WHEqS92CRkPi0Mn')
  $.ajax({
    url: 'https://shopee.tw/buyer/follow/shop/17262293/',
    data: {csrfmiddlewaretoken: 'h7wlaCBe5cM98mMY1WHEqS92CRkPi0Mn'},
    type: 'POST',
    headers: {
      "x-requested-with": "XMLHttpRequest",
      "content-type":"application/x-www-form-urlencoded; charset=UTF-8",
    }
  }).done(function(res) {
    // const userids = getUnfollowArr(res);
    console.log(res)
    alert(1)
  });
  // $.post('', formData, {
  //   headers: {
  //     "x-requested-with":"XMLHttpRequest"
  //   }
  // })
}


function getUnfollowArr(str) {
  let arr = [];
  $(str).find('div.btn-follow').each((_, val) => {
    if ($(val).text().indexOf('關注中') === -1) {
      let userid = $(val).attr('shopid');
      arr.push(userid)
    }
  });
  return arr;
}