var code = parseInt(Math.random()*1000)
$('#code').html(code)

var connectionOptions =  {
  "force new connection" : true,
  "reconnectionAttempts": 1, 
  "timeout" : 10000, 
  "transports" : ["websocket"],
  "query": {'code':code,}
};

var socket = io.connect('192.168.88.73:3000', connectionOptions)