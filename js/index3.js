$(function(){
	var database=[];

	var makelist = function(){
		$('#single_con').empty();
		$.each(database,function(i,v){
			$('#single_con').append('<li class="lis"><strong class="music_name">'+v.title+'</strong><strong class="singer_name">'+v.artist+'</strong><strong class="play_time">'+v.duration+'</strong><div class="list_cp" style="display: none;"><strong class="btn_like"><span>我喜欢</span></strong><strong class="btn_share"><span>分享</span></strong><strong class="btn_fav"><span>收藏</span></strong><strong class="btn_del"><span>删除</span></strong></div></li>');
		})
		$('.open_list span.song_num').text(database.length);
	}

	$.getJSON('./database.json')
	.done(function(data){
		console.log(data);
		database = data;
		makelist();
	})

	$('#single_con').on('mouseenter mouseleaver','li',function(){
		$(this).toggleClass('play_hover');
	})
	$('#single_con').on('click','btn_del',function(){
		var del = $('#single_con .bth_del').index(this) //this is DOM object 第几个
		$.grep(database,function(v,k){  //v is value  k is jian
			return k !== del;
		})
		$(this).closest('li').remove();
		makelist();
		$('.open_list span.song_num').text(database.length);
		return false;  //冒泡和默认
	})












})