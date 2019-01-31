define(['jquery'], function($) {
	return {
		//1.鼠标经过事件
		hover: (function() {
			$('#er a').hover(function() {
				$('#ew').css('display', 'block');
			}, function() {
				$('#ew').css('display', 'none');
			})
			$('#gw').hover(function() {
				$('#gwc').css('display', 'block');
			}, function() {
				$('#gwc').css('display', 'none');
			});
		})(),
		//2.tal切换
		tal: (function() {
			$('#navu li').hover(function() {
				var $index = $(this).index();

				$('.gstyle').eq($index).css('display', 'block').siblings('.gstyle').css('display', 'none');
			}, function() {
				$('.gstyle').css('display', 'none');
			})
		})(),
		//3.banner轮播图
		lunbo:
			(function() {
				//在最后一张图片后面clone第一张图片
				$("#banner .lunbo ul").append($("#banner>.lunbo ul").children().eq(0).clone());
				var timer1 = setInterval(autoplay, 3000);
				var num = 0;

				function autoplay() {
					num++;
					if(num >= 4) {
						$('#banner .lunbo ul').css('left', '0');
					} else {
						$('#banner .lunbo ul').stop(true, true).animate({
							left: num * (-1200)
						});
					}
				}

				$("#banner .lunbo").on("mouseenter", function() {
					clearInterval(timer1)
					$("#sleft").show()
					$("#lright").show()
				}).on("mouseleave", function() {
					clearInterval(timer1)
					clearInterval(timer1)
					timer1 = setInterval(autoplay, 3000)
					$("#sleft").hide()
					$("#lright").hide()
				})
				$("#sleft").on("click", function() { //向左	
					if(num <= 0) {
						num = 3
						$("#banner .lunbo ul").css("left", 4 * -1200)
					}
					num--
					$("#banner .lunbo ul").stop(true, true).animate({
						"left": num * -1200
					})
				}).on("mouseenter", function() {
					$(this).css("background-position-y", 0)
				}).on("mouseleave", function() {
					$(this).css("background-position-y", "-201px")
				});

				$("#lright").on("click", function() {
					num++
					if(num >= 3) {
						num = 1
						$("#banner .lunbo ul").css("left", 0)
					}

					$("#banner .lunbo ul").stop(true, true).animate({
						"left": num * -1200
					})

				}).on("mouseenter", function() {
					$(this).css("background-position-y", "-68px")
				}).on("mouseleave", function() {
					$(this).css("background-position-y", "-135px")
				});

			})(),
		//轮播图从数据库获取数据
		add: (function() {
			$.ajax({
				url: 'http://127.0.0.1/work/meici/php/data.php?__hbt=1508045744014',
				async: true,
				dataType: 'json'
			}).done(function(d) {
				var data=d;
				var html = "";
				for(var i = 0; i < data.length; i++) {
					html += '<li><a href="#"><img src=' + data[i].url+ '></a><p><a href="#">' + data[i].title + '</p></a></li>';
				}
				$('#choosegd ul').html(html);
			})
			var timer2=null;
			timer2=setInterval(autoplay2,2000);
			var count=0;
			function autoplay2(){
				count++;
				if(count>=5){
					count=0;
					$('#choosegd ul').css('left',0);
				}
				$('#choosegd ul').stop(true,true).animate({left:-200*count})
			}
			
			$("#next img").on('click',function(){
				count++;
				//alert(count);
				if(count>=5){
				count=0;
				$('#choosegd ul').css('left','0');
				}
				$('#choosegd ul').animate({left:count*(-200)});
			});
			$('#pre').on('click',function(){
				count--;
				alert(count);
				if(count<=-5){
					count=0;
					$('#choosegd ul').css('left',count*(-200));
				}
				$('#choosegd ul').animate({left:count*(200)});
			})
			$("#choose").on("mouseenter", function() {
					clearInterval(timer2)
					
				}).on("mouseleave", function() {
					clearInterval(timer2)
					clearInterval(timer2)
					timer2=setInterval(autoplay2, 3000)
					
				})
		})(),
		//搜索引擎
		search: (function() {
			var oul = $('#nav-t input');
			oul.on('input', function() {
				var Value = oul.val();
				$.ajax({
					url: "http://www.lefeng.com/api/neptune/search/suggestion/v2",
					dataType: "jsonp",
					data: {
						keyword: Value
					}
				}).done(function(data) {
					console.log(data);
					var d = data;
					var html = "";
					for(var i = 0; i < data.data.length; i++) {
						html += '<li><a href="http://search.lefeng.com/search/showresult?keyword='+data.data[i].content+'">' + data.data[i].content + '</a></li>'
					}
					$('#nav-t #search').html(html);
				})
			})
		})(),
		//登录
		login: (function() {
			function setcookie(key, value, day) {
				var date = new Date();
				date.setDate(date.getDate() + day); //设置过期时间
				document.cookie = key + '=' + encodeURI(value) + ';expires=' + date;
			}
			var username = $('#username');
			var btn = $('#dl');
			var pass = $('#password');
			
			btn.click(function() {
				$.ajax({
					type: "post",
					url: 'http://127.0.0.1/work/meici/php/login.php?__hbt=1508041124203',
					async: true,
					data: {
						name: username.val(),
						pass:pass.val()
					}
				}).done(function(data) {
					
					if(!data) {
						$('#pas').html('用户不存在');
						$('#pas').css('color', 'red');
					} else {
						$('#pas').html('');
						$(location).attr('href', 'http://127.0.0.1/work/meici/main.html?__hbt=1508144616806');
					}

				})
			})
		})(),
		//注册
		register: (function() {
			var username = $('#username');
			var bstop = true;
			username.blur(function() {
				var usernamev = this.value;
				var reg = /^([\u4e00-\u9fa5]|[\w\-]){3,15}$/;
				if(usernamev != '') {
					if(reg.test(usernamev) && usernamev.length >= 3 && usernamev.length <= 15) {
						$.ajax({
							type: "post",
							data: {
								name: usernamev
							},
							url: "http://127.0.0.1/work/meici/php/register.php?__hbt=1508041105632",
							async: true
						}).done(function(data) {
							if(data) {
								$('#content').html('用户名已经存在');
								$('#content').css('color', 'red');
								bstop = true;
							} else {
								$('#content').html('');
								bstop = false;
							}
						}).fail(function(e) {
							alert(e)
						})
					} else {
						$('#content').html('用户名格式不正确');
						$('#content').css('color', 'red');
						bstop = true;
					}
				} else {
					//$('#content').html('用户名不能为空');
					$('#content').css('color', 'red');
					bstop = true;
				}
			});
			var pass = $('#password');
			pass.blur(function() {
				var passv = this.value;
				var reg = /^\w{6,16}$/;
				if(reg.test(passv) && passv.length >= 6 && passv.length <= 16) {
					$('#content').html('');
					$('#content').css('color', 'red');
					bstop=false;
				} else {
					$('#content').html('密码格式不正确');
					$('#content').css('color', 'red');
					bstop=true;
				}
				//再次输入密码
				var passa = $("#pass");
				passa.blur(function() {
					var passav = this.value;
					if(passav == passv) {
						$('#content').html('');
						bstop=false;
					} else {
						$('#content').html('请再次确认密码');
						$('#content').css('color', 'red');
						bstop=true;
					}
				})
			});

			//产生随机得验证码
			var code;
			var botton = $('#right');
			var timer3=null;
			//console.log(botton);
			function createCode() {
				code = "";
				var codeLength = 4; //验证码的长度   
				var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
					'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数   
				for(var i = 0; i < codeLength; i++) { //循环操作   
					var index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）   
					code += random[index]; //根据索引取得随机数加到code上   
				}
				botton.html(code); //把code值赋给验证码   
			};
			botton.click(function() {
				createCode();
			})
			$('#yzm').blur(function() {
				var yzmv = this.value;
				if(yzmv == right.innerHTML) {
					$('#content').html('');
					bstop=true;
				} else {
					$('#content').html('验证码不一致');
					$('#content').css('color', 'red');
					bstop=false;
				}
			});
			$('form').submit(function() {
				if(username.value =="") {
					$('#content').html('用户名不能为空');
					$('#content').css('color', 'red');
				}
				if(bstop) {
					return false;
				}
			})

		})(),
		scale: 
		//轮播图
		(function() {
			var num = 0;
			$('#liebiao ul').append($('#liebiao>ul').children().eq(0).clone());

			$('#myl').on('click', function() {
				num--;
				if(num < 0) {
					num = 0
					$('#myl').attr('disabled', "true");
				}
				$('#liebiao ul').animate({
					top: num * (62)
				});
			});
			$('#myr').on('click', function() {
				num++;
				if(num > 1) {
					num = 1;
					$('#myr').attr('disabled', 'true');
				}
				$('#liebiao ul').animate({
					top: num * (-62)
				});
			})
			//放大镜
			//鼠标滑过获取对应索引图片的active属性
			$('#liebiao ul').find('li').on('mouseover', function() {
				var index = $(this).index();
				var url = $(this).find('img').attr('src');
				$('#liebiao ul li').eq(index).addClass('active').siblings('li').removeClass();
				$('#sbox').find('img').attr('src', '' + url + '');
			})
			$('#sbox').hover(function() {
				$('#bbox').css('display', 'block');
				var surl = $('#sbox').find('img').attr('src');
				$('#bbox').find('img').attr('src', '' + surl + '');
				$('#fbox').css('display', 'block');
				//鼠标的位置
				var bimg = $('#bbox img'); //大图
				var simg = $('#sbox img'); //小图
				var smallbox = $('#sbox'); //小盒子
				var bigbox = $('#bbox'); //大盒子
				var floatbox = $('#fbox'); //小放
				var scale = parseInt(bimg.width() / simg.width()); //缩放比例
				var fw = parseInt(simg.width() * bigbox.width() / bimg.width());
				var fh = parseInt(simg.height() * bigbox.height() / bimg.height());
				//console.log(fw)
				floatbox.css('width', fw);
				floatbox.css('height', fh);

				smallbox.on('mousemove', function(e) {
					var e = e || window.event;
					//放大镜的大小
					var fw = parseInt(simg.width() * bigbox.width() / bimg.width());
					var fh = parseInt(simg.height() * bigbox.height() / bimg.height());
					floatbox.css('width', fw);
					floatbox.css('height', fh);
					var shortx = e.pageX - 230- (floatbox.width()) / 2;
					var shorty = e.pageY -310 - (floatbox.height()) / 2;
					
					if(shortx<0){
						shortx=0
					}else if(shortx>=smallbox.width()-floatbox.width()){
						shortx=smallbox.width()-floatbox.width();
					}
					if(shorty<=0){
						shorty=0;
					}else if(shorty>=smallbox.height()-floatbox.height()){
						shorty=smallbox.height()-floatbox.height();
					}
					floatbox.css('left', shortx);
					floatbox.css('top', shorty);
					bimg.css('left',-scale*shortx);
					bimg.css('top',-scale*shorty);
					return false;
				})

			}, function() {
				$('#bbox').css('display', 'none');
				$('#fbox').css('display', 'none');
			})

		})(),
		//回到顶部
		backtop: (function() {
			window.onscroll = function() {
				
				//console.log(scrolltop);
				if(window.scrollY >=345) {
					$('#ce').css('position', 'fixed');
				}else{
					$('#ce').css('position', 'static');
				}
			}
			$('#ce ul li').eq(3).on('click',function(){topp()});
		function topp(){
		var scrollTop=window.scrollY;
		 var timer=setInterval(function(){
		 	scrollTop=scrollTop-30;
		 	window.scrollTo(0,scrollTop);
		 	if(scrollTop<=0){
		 		scrollTop=0;
		 		clearInterval(timer);
		 	}
		 },10)
		}
		})(),
		//弹窗
		tanchuang:(function(){
			$('#enter').on('click',function(){
				$('#tan').css('display',block)
			})
		})()
	}
});