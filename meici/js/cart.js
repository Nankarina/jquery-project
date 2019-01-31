define(['jquery', 'cookie'], function($) {
	return {
		cart: (function() {
			//获取json数据
			$.ajax({
				type: "post",
				url: "http://127.0.0.1/work/meici/js/cart.json",
				async: true
			}).done(function(data) {
				var d = data;
				var html = "";
				for(var i = 0; i < d.length; i++) {
					html += '<li>' +
						'<a href="#" class="goodsimg"><img sid=' + d[i].sid + ' src=' + d[i].src + '></a>' +
						'<div id="goodstitle">' + d[i].title + '</div>' +
						'<div id="goodsprice">￥<span>' + d[i].price + '</span></div>' +
						'<div id="addcart">加入购物车</div>' +
						'</li>'
				}
				$('#listgood ul').html(html);
				if(getcookie('cartid') && getcookie('cartnum')) {
					var s = getcookie('cartid').split(','); //[1,2,3,4]
					var n = getcookie('cartnum').split(','); //[1,1,1,1]
					for(var i = 0; i < s.length; i++) {
						creategoods(s[i], n[i]); //逐个创建	s[i]:sid   n[i]:num
					}
				}

			});
			var arrnum = []; //存放商品数量
			var arrid = []; //存放商品的id
			//判断cookie中是否存在该商品
			function arraytocookie() {
				if(getcookie("cartid")) {
					arrid = getcookie("cartid").split(',');
				} else {
					arrid = []
				}
				if(getcookie('cartnum')) {
					arrnum = getcookie('cartnum').split(',');

				} else {
					arrnum = [];
				}
			}
			var addcart = $('#addcart');
			$('#listgood ul').on('click', '#addcart', function() {
				var sid = $(this).parents('li').find('img').attr('sid'); //点击图片获取每张图片的sid
				arraytocookie();
				if($.inArray(sid, arrid) != -1) {
					$('#gooditem ul:visible').each(function() {
						if(sid == $(this).find('#detailsgoods img').attr('sid')) {
							var num = parseInt($(this).find('.goodsnum').html());
							var price = parseFloat($(this).find('#pricel span').html()); //先获取之前的数量
							num++;
							$(this).find('.goodsnum').html(num); //再重新赋予数量的值
							$(this).find('#xiaoji span').html((num * price).toFixed(2));
							arrnum[$.inArray(sid, arrid)] = num; //更新cookie中的num的值
							addCookie('cartnum', arrnum.toString(), 7);
							totalprice()
						}
					})
				} else {
					arrid.push(sid); //不存在添加商品id；
					arrnum.push(1); //初始数量为1
					addCookie('cartid', arrid.toString(), 7); //添加的商品存到cookie中
					addCookie('cartnum', arrnum.toString(), 7); //添加商品数量到cookie中
					creategoods(sid, 1);
				}

			});
			//创建商品
			function creategoods(sid, num) {
				$.ajax({
					type: "post",
					url: "http://127.0.0.1/work/meici/js/cart.json",
					dataType: 'json',
					async: false
				}).done(function(data) {
					for(var i = 0; i < data.length; i++) {
						if(data[i].sid == sid) { //若存在该商品
							var clone = $('.ul:hidden').clone(true); //true元素上面的事件也clone
							clone.find('#detailsgoods img').attr({
								src: data[i].src,
								sid: data[i].sid
							})
							clone.find('#burrey .gtitle').html(data[i].title); //商品标题
							clone.find('#pricel span').html(data[i].price); //商品价格
							clone.find('#xiaoji span').html(data[i].price);
							clone.find('.goodsnum').html(num);//商品数量(获取改变的数量值)
							clone.css('display', 'block'); //克隆之后出现
							$('#gooditem').append(clone);
							totalprice()
						}
					}
				})
			}
			//购物车为空
			empty();

			function empty() {
				if(getcookie('cartid')) {
					$('#empty').hide()
				} else {
					$('#empty').show()
				}
			}

			//计算总价
			totalprice();
			function totalprice(price){
				var num=0;
				var goodprice=0;
				$('#gooditem ul:visible').each(function(){
					
					num+=parseInt($(this).find('.goodsnum').html());
					goodprice+=parseFloat($(this).find('#pricel span').html()*num);
				})
				$('#havegood').find('.zongjia').html(goodprice.toFixed(2));
				$('#havegood').find('#suifei em').html(num);
			}
			//数量++
			$('.jia').on('click', function() {
				var content = $(this).siblings('.goodsnum').html();
				content++;
				if(content >= 99) {
					content = 99
				}
				$(this).siblings('.goodsnum').html(content);
				sendcookie($(this));
				totalprice()
				$(this).parents('#goodsright').find('#xiaoji span').html(sigletotal($(this)));
			})
			//数量--
			$('.jian').on('click', function() {
				var content = $(this).siblings('.goodsnum').html();
				content--;
				if(content <= 1) {
					content = 1
				}
				$(this).siblings('.goodsnum').html(content);
				sendcookie($(this));
				totalprice()
				$(this).parents('#goodsright').find('#xiaoji span').html(sigletotal($(this)));

			})
			//单件商品的价格(sigle当前元素)
			function sigletotal(sigle) {
				var $dj = parseFloat(sigle.parents('#goodsright').find('#pricel span').html());
				var $cnum = parseInt(sigle.siblings('.goodsnum').html());
				return($dj * $cnum).toFixed(2);
			}
			//删除选中商品
			deletesigle();
			function deletesigle(){
				$('#gooditem ul').on('click','#sharer a',function(ev){
				arraytocookie();
				$(this).parents('#gooditem ul').remove();
				delgoodslist($(this).find('img').attr('sid'), arrid);
				totalprice()
				empty();
				})
			}
			
			//存储到cookie
			function sendcookie(obj) {
				arraytocookie();
				var $index = obj.parents('#gooditem ul').find('img').attr('sid');
				arrnum[arrid.indexOf($index)] = obj.siblings('.goodsnum').html();
				addCookie('cartnum', arrnum.toString(), 7);
			}
			//删除cookie中的sid和num
			function delgoodslist(sid, arrid) { //sid：当前的sid，sidarr:cookie的sid的值
				var index = -1;
				for(var i = 0; i < arrid.length; i++) {
					if(sid == arrid[i]) {
						index = i;
					}
				}
				arrid.splice(index, 1); //删除数组对应的值
				arrnum.splice(index, 1); //删除数组对应的值
				addCookie('cartid',arrid.toString(), 7); //添加cookie
				addCookie('cartnum', arrnum.toString(), 7);
			}
		})(),
		//点击结算，出现请登录
		tanchuan:(function(){
			$('#jiesuan').on('click',function(){
				$('#zhezhao').css('display','block');
				$('#tanchuan').css('display','block');
				$('#yes').on('click',function(){
					$('#zhezhao').css('display','none');
					$('#tanchuan').css('display','block');
					window.location.href='login.html';
				})
				$('#no').on('click',function(){
					$('#zhezhao').css('display','none');
					$('#tanchuan').css('display','none');
				})
			})
		})()
	}
})