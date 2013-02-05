var express = require('express');
var app = express.createServer();
app.listen(8000);
var webRTC = require('webrtc.io').listen(app);
var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console

app.use(expressWinston.logger({
     transports: [
       new winston.transports.Console({
         json: true,
         colorize: true
       })
     ]
   }));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
	winston.info("style.css REQUESTED");
  res.sendfile(__dirname + '/style.css');
});

app.get('/webrtc.io.js', function(req, res) {
	winston.info("webrtc.io.js REQUESTED");
  res.sendfile(__dirname + '/webrtc.io.js');
});


webRTC.rtc.on('connect', function(rtc) {
  //Client connected
});

webRTC.rtc.on('send answer', function(rtc) {
  //answer sent
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});

app.use(expressWinston.errorLogger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        })
      ]
    }));

