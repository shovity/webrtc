const io = require('socket.io')();

var users = [];

io.on('connection', socket => {

	socket.on('login', (username) => {
		users.push({ username, id: socket.id });
		updateUsers();
	})

	socket.on('offer signal', data => {
		io.sockets.connected[data.id].emit('offer signal', { signal:data.signal, id: socket.id });
	})

	socket.on('answer signal', (data) => {
		io.sockets.connected[data.id].emit('answer signal', { signal:data.signal, id: socket.id });
	})

	socket.on('disconnect', () => {
		var p = users.findIndex(user => user.id == socket.id);
		if (p != -1) {
			users.splice(p, 1);
			updateUsers();
		}
	})
})


function updateUsers() {
	io.emit('update users', users);
}

module.exports = io;