var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    let power = true;
    function send() {
        if (connection.connected) {
            power = !power;
            var params = {
                method: 'PUT',
                path: '/v1/echonet/AirConditioner_1/OperatingState',
                args: {value: power ? 'on' : 'off'},
            };
            connection.sendUTF(JSON.stringify(params));
            setTimeout(send, 1000);
        }
    }
    send();
});

client.connect('ws://192.168.100.65:8080/', 'picogw');
