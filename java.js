$(document).ready(function(){
	$('#game_data').hide();
})

var check_function = function(){
	var mino = $('#mino_input').val().toUpperCase();
	var game = $('#game_select').val();
	var mino_check = /^MI-([A-Z]){3}-([0-9]){3}$/m;
	if (mino_check.test(mino)) 
	{
		var send_data = '';
		send_data = 'mino='+mino+'&game='+game;
		console.log(send_data);
		$.ajax({
		  dataType: 'json',
	      method : 'POST',
	      url : 'new_reg',
	      data : send_data,
	      responseType : "json",
	      headers: {  
	      "Content-Type": 'application/x-www-form-urlencoded'
	  	  },
	  	  success : function(data){
	  	  	console.log(data);
	  	  	if(!!data.error)
	  	  	{
	  	  		console.log(data.error);
	  	  	}
	  	  	else if(data.status == false)
	  	  	{
	  	  		console.log(data.data[0]);		//existing entry
	  	  	}
	  	  	else
	  	  	{
	  	  		$('#personal_data').hide();
	  	  		$('#game_data').show();
	  	  		if(data.game.game != 'poker')
	  	  		{
	  	  			$('#poker_exp').hide();
	  	  			$('#phoneno').hide();
	  	  		}
	  	  		var send_data = '';
	  	  		for (var i = 0; i < data.game.data.slots; i++) {
	  	  			var slot_no = i+1;
	  	  			send_data = 'game='+data.game.game+'&slotno='+slot_no;
	  	  			$.ajax({
					  dataType: 'json',
				      method : 'POST',
				      url : 'check_fill',
				      data : send_data,
				      responseType : "json",
				      headers: {  
				      "Content-Type": 'application/x-www-form-urlencoded'
				  	  },
				  	  success : function(data){
				  	  	if(data.total != data.tables.length)
				  	  	{
				  	  		$('#slotno').append($('<option>',{
			  	  				value: data.slot_no,
			  	  				text: data.slot_no,
			  	  			}));
				  	  	}
				  	  }
				  	});
	  	  		}
	  	  		table_fill();
	  	  		$('#data_display').html('MI NO. - '+mino+'<br>'+'Game - '+game);
	  	  	}
	  	  }
  	});
	}
	else
	{
		console.log('Invalid mino');
	}
}

var table_fill = function(){
	var send_data = '';
	var slotno = $('#slotno').val();
	var game = $('#game_select').val();
	if(slotno == null)
		send_data = 'game='+game+'&slotno=1';
	else
		send_data = 'game='+game+'&slotno='+slotno;
	$.ajax({
		  dataType: 'json',
	      method : 'POST',
	      url : 'check_fill',
	      data : send_data,
	      responseType : "json",
	      headers: {  
	      "Content-Type": 'application/x-www-form-urlencoded'
	  	  },
	  	  success : function(data){
	  	  	//console.log(data);
	  	  	$('#tableno').find('option').remove();
	  	  	for (var i = 0; i < data.total; i++) {
	  	  		var flag = 0;
	  	  		for (var j = 0; j < data.tables.length; j++) {
	  	  			if(data.tables[j] == i+1)
	  	  			{
	  	  				flag = 1;
	  	  			}
	  	  		};
	  	  		if(!flag){
	  	  			$('#tableno').append($('<option>',{
	  	  				value: i+1,
	  	  				text: i+1,
	  	  			}));
	  	  		}
	  	  	}
	  	}
	});
}

var submit_function = function(){
	var mino = $('#mino_input').val().toUpperCase();
	var game = $('#game_select').val();
	var slotno = $('#slotno').val();
	if(slotno==null)
		slotno = 1;
	var tableno = $('#tableno').val();
	var send_data = '';
	send_data = 'mino='+mino+'&game='+game+'&slotno='+slotno+'&tableno='+tableno;
	if(game == 'poker')
	{
		var exp = $('input[name="exp"]:checked').val();
		var phoneno = $('#phoneno_input').val();
		send_data+='&exp='+exp+'&phoneno='+phoneno;
	}
	console.log(send_data);
	$.ajax({
	  dataType: 'json',
      method : 'POST',
      url : 'add_entry',
      data : send_data,
      responseType : "json",
      headers: {  
      "Content-Type": 'application/x-www-form-urlencoded'
  	  },
  	  success : function(data){
  	  	console.log(data);
  	  }
  	});
}