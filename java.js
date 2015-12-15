$(document).ready(function(){

})

var submit_function = function(){
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
	      url : 'new_feed',
	      data : send_data,
	      responseType : "json",
	      headers: {  
	      "Content-Type": 'application/x-www-form-urlencoded'
	  	  },
	  	  success : function(data){
	  	  	console.log(data)
	  	  };
  	}
  	});
	}
	else
	{
		console.log('Invalid mino');
	}
}