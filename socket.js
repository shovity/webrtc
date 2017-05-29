const io = require('socket.io')();

var users = [];

io.on('connection', socket => {

	socket.on('login', (username) => {
		users.push({ username, id: socket.id });
		updateUsers();
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
	console.log(users)
}


module.exports = io;