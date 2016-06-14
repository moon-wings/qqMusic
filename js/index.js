$(function(){
	var database = [
		{name:'加伏特舞曲',singer:'单簧管',time:'2:52',src:'./musics/单簧管-加伏特舞曲.mp3'},
		{name:'天鹅湖',singer:'古典音乐',time:'3:14',src:'./musics/古典音乐-天鹅湖.mp3'},
		{name:'墨殇',singer:'古风',time:'3:22',src:'./musics/古风-墨殇.mp3'},
		{name:'橙色の時',singer:'吉森信',time:'3:18',src:'./musics/吉森信-橙色の時.mp3'}
	];
	var render=function(){
		$.each(database,function(i,v){
			$('#single_con').append('<li class="lis"><strong class="music_name">'+v.name+'</strong><strong class="singer_name">'+v.singer+'</strong><strong class="play_time">'+v.time+'</strong><div class="list_cp" style="display: none;"><strong class="btn_like"><span>我喜欢</span></strong><strong class="btn_share"><span>分享</span></strong><strong class="btn_fav"><span>收藏</span></strong><strong class="btn_del"><span>删除</span></strong></div></li>')
		});
		$('.open_list span.song_num').text(database.length);
	}
	render();

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


// 切换歌曲
	var currentItem = 0;
	var change = function(){
		var key = database[currentItem];
		audio.src = key.src;
		audio.play();
		$('#single_con li').removeClass('current');
		$('#single_con li:eq('+currentItem+')').addClass('current');
		$('.music_info_main #music_name').text(key.name);
		$('.music_info_main .singer_name').text(key.singer);
		$('.music_info_main .play_date').text(key.time);
	}



	$('#single_con').on('click','li',function(){
		currentItem = $(this).index();
		// audio.src = database[$(this).index()].src;
		change()
	})
	$('.prev_bt').on('click',function(){
		currentItem -=1;
		currentItem = (currentItem == -1) ? database.length-1 : currentItem;
		change();
	})
	$('.next_bt').on('click',function(){
		currentItem +=1;
		currentItem = (currentItem == database.length) ? 0 :currentItem;
		change();
	})

// 清空列表
	$('.clear_list').on('click',function(){
		database=[];
		render();
	})


//播放模式
	$('.circle_bt').on('click',function(){
		$('.playbar_cp_select')
		.css('display','block')
		.on('click',function(){
			$(this).hide();
		})
		// $(this).removeClass('.circle_bt').addClass('circle_btt');
	})

	















})