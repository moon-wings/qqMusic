$(function(){
	var database = [];

	var render=function(){
		$('#single_con').empty();
		$.each(database,function(i,v){
			$('#single_con').append('<li class="lis"><strong class="music_name">'+v.title+'</strong><strong class="singer_name">'+v.artist+'</strong><strong class="play_time">'+v.duration+'</strong><div class="list_cp"><strong class="btn_like"><span>我喜欢</span></strong><strong class="btn_share"><span>分享</span></strong><strong class="btn_fav"><span>收藏</span></strong><strong class="btn_del"><span>删除</span></strong></div></li>')
		});
		$('.open_list span.song_num').text(database.length);
	}
	render();

	$.getJSON('./database.json')
	.done(function(data){
		database = data;
		render();
	})

// 开始/暂停
	var audio = $('audio').get(0);
	$('.play_bt').on('click',function(){
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}
	})
	$('audio').on('play',function(){
		$('.play_bt').removeClass().addClass('pause_bt');

	})
	$('audio').on('pause',function(){
		$('.pause_bt').removeClass().addClass('play_bt');

	})

// 时间进度条
	$('audio').on('timeupdate',function(){
		var percent= this.currentTime/this.duration.toFixed(2)*100+'%';
		$('.progress_op').css('left',percent);
		$('.play_current_bar').css('width',percent);
	})

// click设置播放时间

	$('.player_bar').on('click',function(e){
		audio.currentTime = audio.duration*e.offsetX / $(this).width();
	})
	$('.progress_op').on('click',function(e){
		e.stopPropagation();
	})

//拖动设置播放时间
	$('.progress_op').on('mousedown',function(e){
		e.preventDefault();
		audio.pause();
		document.onmousemove = function(e){
			var t = e.clientX / $('.player_bg_bar').width();
			if(t >=0 && t <= 1){
				audio.currentTime=audio.duration*t;
			}
		};
		document.onmouseup = function(){
			audio.play();
			document.onmousemove = null;
			document.onmouseup = null;
		}
	})

// 当前进度时长

	var showtime = function(second){
		if(isNaN(second)){
			return '--:--';
		}
		second = Math.round(second);
		var minute = parseInt(second/60);
		var second = second%60;
		minute = minute < 10 ? '0'+ minute : minute;
		second = second < 10 ? '0'+ second : second;
		return minute + ':' + second;
	}
	$('.player_bar').on('mouseenter',function(e){
		$('.time_show').css('display','block');
		var width = $('.time_show').width();
		var left = e.clientX - 0.5*width;
		$('.time_show').css('left',left);
		var time = showtime(audio.duration*(e.offsetX / $(this).width()));
		$('#time_show').html(time);
	})
	$('.player_bar').on('mouseleave',function(e){
		$('.time_show').css('display','none');
	})
	$('.player_bar').on('mousemove',function(e){
		$('.time_show').css('display','block');
		var width = $('.time_show').width();
		var left = e.clientX - 0.5*width;
		$('.time_show').css('left',left);
		var time = showtime(audio.duration*(e.offsetX / $(this).width()));
		$('#time_show').html(time);
	})














// 音量进度条
	$('.volume_regulate').on('click',function(e){
        audio.volume = e.offsetX / $(this).width();
    })
	$('audio').on('volumechange',function(){
		if(audio.volume===0){
	      $('.volume_icon').removeClass('volume_icon').addClass('volume_mute');
	    }else{
	      $('.volume_mute').removeClass('volume_mute').addClass('volume_icon');
	    }
        var width = audio.volume.toFixed(2)*100 +'%';
        $('.volume_regulate').find('.volume_bar').width(width);
        $('.volume_regulate').find('.volume_op').css('left',width);
	})


// click设置音量
	$('.volume_icon').on('click',function(){
		$(this).removeClass('volume_icon').addClass('volume_mute');
	    volume=($('.valume_bar').width()/$('.volume_regulate').width()).toFixed(2);
	    if(audio.volume==0){
	      audio.volume = volume;
	    }else{
	    	volume=audio.volume;
	        audio.volume=0;
	    }
	})

// 拖动设置音量
	
	$('.volume_op').on('mousedown',function(e){
		e.preventDefault();
		document.onmousemove = function(e){
			var left = $('.volume_regulate')[0].getBoundingClientRect().left;
			var v = (e.clientX - left ) / $('.volume_regulate').width();
			if(v >=0 && v <= 1){
				audio.volume = v;
			}
		}
		document.onmouseup = function(){
			document.onmouseup = null;
			document.onmousemove = null;
		}
	})
	$('.volume_op').on('click',function(e){
		e.stopPropagation();
	})

// 切换歌曲
	// var currentItem = 0;
	// var change = function(){
	// 	var key = database[currentItem];
	// 	audio.src = key.filename;
	// 	audio.play();
	// 	$('#single_con li').removeClass('current');
	// 	$('#single_con li:eq('+currentItem+')').addClass('current');
	// 	$('.music_info_main #music_name').text(key.title);
	// 	$('.music_info_main .singer_name').text(key.artist);
	// 	$('.music_info_main .play_date').text(key.duration);
	// }
	var currentItem = 0;
	var change = (function(){
		var render = null;
		return function(currentItem){
			var key = database[currentItem];
			audio.src = key.filename;
			audio.play();
			$('#single_con li').removeClass('current');
			$('#single_con li:eq('+currentItem+')').addClass('current');
			$('.music_info_main #music_name').text(key.title);
			$('.music_info_main .singer_name').text(key.artist);
			$('.music_info_main .play_date').text(key.duration);
		}
	})();

// 播放歌曲
	$('#single_con').on('click','li',function(){
		currentItem = $(this).index();
		// audio.src = database[$(this).index()].src;
		change(currentItem)
	})

// 上一首
	var prevsong = function(){
		if(playbt == 'unordered_bt'){
	      var rd = Math.floor( Math.random()*database.length );
	      change(rd); 
	      return;
	    }
		currentItem -=1;
		currentItem = (currentItem == -1) ? database.length-1 : currentItem;
		change(currentItem);
	}
	$('.prev_bt').on('click',function(){
		prevsong();
	})

// 下一首
	var nextsong = function(){
		if(playbt == 'unordered_bt'){
	      var rd = Math.floor( Math.random()*database.length );
	      change(rd); 
	      return;
	    }
		currentItem +=1;
		currentItem = (currentItem == database.length) ? 0 :currentItem;
		change(currentItem);
	};
	$('.next_bt').on('click',function(){
		nextsong();
	})

//播放模式
	// $('.circle_bt').on('click',function(){
	// 	$('.playbar_cp_select')
	// 	.css('display','block')
	// 	.on('click','strong',function(){
	// 	    var cn = $(this).attr('class');
	// 	    console.log(cn)
	// 		$(this).parent().hide();
	// 		$(this).parent().prev().find('.circle_bt').removeClass('circle_bt').addClass(cn);
	// 	})
	// })
	var divselect = $('.playbar_cp_select');
	var btnPlayway = $('.circle_bt');
	var playbt = $('.play_bt');
	var strong = $('.playbar_cp_select').find('strong')
	$('.circle_bt').on('click',function(){
		$('.playbar_cp_select').css('display','block')
	})
	$.each(strong,function(i,v){
		$(v).on('click',function(){
			$(this).parent().css('display','none');
			var cn = $(this).attr('class');
			btnPlayway.attr('class',cn);
			playbt = this.className;
		})
	})

	
	audio.onended = function(){
		if (playbt=='circle_btt'){
			nextsong();
		}else if(playbt == 'circle_single_bt'){
			change(currentItem);
		}else if(playbt=='ordered_bt'){
			if(currentItem != database.length-1){
				nextsong();
			}
		}else if(playbt == 'unordered_bt'){
			var rd = Math.floor( Math.random()*database.length );
            change(rd); 
		}
	}

// 删除歌曲

	$('#single_con').on('click','.btn_del',function(){
		var del = $('#single_con .bth_del').index(this);
		console.log(del)
		$.grep(database,function(v,k){ 
			console.log(k)
			return k !== del;
		})
		console.log(database)
		database=database;
		$(this).closest('li').remove();
		$('.open_list span.song_num').text(database.length);
		return false;  //冒泡和默认
	})


// 清空列表
	$('.clear_list').on('click',function(){
		database=[];
		render();
	})


//music列表
	$('.open_list').on('click',function(){
		$('.play_list_frame').toggleClass('appear')
	})

//close_list
	$('.close_list').on('click',function(){
		$('.play_list_frame').toggleClass('appear')
	})

//收列表
	
	$('.folded_bt').on('click',function(){
		$('.play_list_frame').addClass('appear').toggle();
		$(this).parent().toggleClass('shou')
	})












})