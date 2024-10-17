const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3000 });

var connected = [];

wss.on("connection", function connection(ws) {
	connected.push(ws);
	
	ws.on("message", function handleuser(msg) {
		msg = msg.toString().trim();

		if (msg.length < 9 || msg.length > 100000) {
			ws.close();
			return;
		}

		const [userid, data] = msg.split(";", 2);

		if (!userid || !data) {
			ws.close();
			return;
		}

		const id = userid.substring(0, 8);
		const user = userid.substring(8);

		//ws.send(id)
		connected.forEach(function (client) {
			client.send(user + ";" + data);
		});
	});

	ws.on("close", function close() {
		connected = connected.filter((item) => item !== ws);
	});
	
	ws.on('error', console.log);
});

console.log("Running")