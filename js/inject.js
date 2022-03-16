let COOKIES = '';  

window.addEventListener("message", function(e) {
	const cmd = e.data && e.data.cmd;
	if (!cmd) {
		return;
	} else if (cmd === 'setCookie') {
		COOKIES = e.data.data;
	}
}, false);


function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr = COOKIES.match(reg))
      return unescape(arr[2]);
    else
      return null;
}


function getShopId() {
	let arr = $(document).find('a');
	for (let i = 0; i < arr.length; i++) {
		let href = $(arr[i]).attr('href');
		if (/^\/shop\/\d+\/details$/.test(href) ){
			return /\/shop\/(\d+)\/details$/.exec(href)[1];
		}
		if (/^\/shop\/\d+\/search/.test(href) ){
			return /\/shop\/(\d+)\/search/.exec(href)[1];
		}
	}
}

async function getFollowList(shopid, cb) {
	 for(let i = 0; i < 10; i++) {
		await cb(i * 100, shopid);
	 }
}

function goFollow(offset, shopid) {
	return new Promise((r, j) => {
		$.ajax('https://shopee.tw/shop/' + shopid + '/followers/?offset=' + offset + '&limit=100&offset_of_offset=0&_=' + Date.now(), {
    }).done(function(res) {
			let arr = getUnfollowArr(res, true);
			requestAll(arr, follow).then(() => {
				r();
			}).catch(() => {
				j();
			})
    });
	})
}

function getUnFollowList(offset, shopid) {
	return new Promise((r, j) => {
		$.ajax('https://shopee.tw/shop/' + shopid + '/following/?offset=' + offset + '&limit=100&offset_of_offset=0&_=' + Date.now(), {
    }).done(function(res) {
			let arr = getUnfollowArr(res, false);
			requestAll(arr, unfollow).then(() => {
				r();
			}).catch(() => {
				j();
			})
    });
	})
}


function requestPro(arr) {
	return Promise.all(arr);
}

async function requestAll(arr, request) {
	let res = [], temp = [];
	for (let i = 0; i < arr.length; i++) {
		// if (temp.length === 7) {
		// 	res.push(temp);
		// 	temp = [];
		// }
		// temp.push(request(arr[i]));
		await request(arr[i]);
	}
	// for (let i = 0; i < res.length; i++) {
	// 	await requestPro(res[i]);
	// }
}


function getUnfollowArr(str, followFlag) {
  let arr = [];
	str = str.replace(/ </g, '<').replace(/\n/g, '').replace(/\t/g, '');
  $(str).find('div.btn-follow').each((_, val) => {
		const text = $(val).text();
		const userid = $(val).attr('shopid');
		if (followFlag) {
			if (text.indexOf('關注中') === -1) {
				userid && arr.push(userid)
			}
		} else {
			userid && arr.push(userid)
		}
  });
  return arr;
}



function follow(userid) {
  return new Promise((r, j) => {
		$.ajax({
			url: 'https://shopee.tw/buyer/follow/shop/' + userid + '/',
			data: {csrfmiddlewaretoken: COOKIES},
			type: 'POST',
			headers: {
				"x-requested-with": "XMLHttpRequest",
				"content-type":"application/x-www-form-urlencoded; charset=UTF-8",
			}
		}).done(function(res) {
			console.log(userid + ': follow success');
			r('success');
		}).fail(function(res) {
			console.log(userid + ': follow error');
			j('error');
		});
	});
}

function unfollow(userid) {
  return new Promise(r => {
		$.ajax({
			url: 'https://shopee.tw/buyer/unfollow/shop/' + userid + '/',
			data: {csrfmiddlewaretoken: COOKIES},
			type: 'POST',
			headers: {
				"x-requested-with": "XMLHttpRequest",
				"content-type":"application/x-www-form-urlencoded; charset=UTF-8",
			}
		}).done(function(res) {
			console.log(userid + ': unfollow success');
			r(res);
		}).fail(function(res) {
			console.log(userid + ': unfollow error');
			r(res);
		});
	})
}

window.invokeContentScript = function (type) {
	let href = location.href;
	let shopId = '';
	let isShop = /tw\/(.[^/]*)$/.test(href);
	if (isShop) {
		shopId = getShopId();
	} else {
		// https://shopee.tw/shop/141048430/followers
		shopId = /\/shop\/(\d+)\/follow/.exec(href)[1];
	}
	if (type === 'follow') {
		getFollowList(shopId, goFollow);
	} else {
		getFollowList(shopId, );
	}
}