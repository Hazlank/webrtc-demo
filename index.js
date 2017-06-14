var express = require('express'),
    app = express(),
    server = require('http').createServer(app);
var wss = require('socket.io/lib')(server);

server.listen(3001);

app.use(express.static(__dirname))


String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

// 存储socket的数组，这里只能有2个socket，每次测试需要重启，否则会出错
var wscc = {};

// 有socket连入
wss.on('connection', function (ws) {
    var socketID
    ws.on('socketId', function (id) {

        socketID = id
        wscc[id] = ws
    });



    // 转发收到的消息
    ws.on('message', function (message) {
        for (var a in wscc) {
            if (socketID !== a) {
                wscc[a].emit('rtc', message, function (error) {
                    if (error) {
                        console.log('Send message error (' + desc + '): ', error);
                    }
                });
            }
        }



    });
    ws.on('con_number', function () {
        ws.emit('con_number', Object.keys(wscc).length > 1 ? true : false)
    });

    ws.on('socket_closed', data => {
        delete wscc[data];
        console.log( Object.keys(wscc).length)
        //  ws.emit('socket_closed',data)
        for (var a in wscc) {
            if (data !== a) {
                wscc[a].emit('socket_closed', data)
            }
        }
    });
});

