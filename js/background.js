let COOKIES = '';
chrome.cookies.get({url: 'https://shopee.tw', name: 'csrftoken'}, cookies => {
      COOKIES = cookies.value;
});
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.type === 'cookie') {
    sendResponse(COOKIES);
  } else {
    sendResponse(111);
  }
})

function follow(callback) {
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
    callback(res);
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