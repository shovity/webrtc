const Peer = require('simple-peer'),
	socket = require('socket.io-client')();

const getStream = require('./getStream'),
	videoControl = require('./videoControl'),
	cookier = require('./cookier');

var offerVideo = videoControl('offer-video'),
	answerVideo = videoControl('answer-video'),
	stream = null;

var menu = {
	isOpen: true,
	float: document.getElementById('float'),
	menu: document.getElementById('menu'),
	enter: document.getElementById('enter'),
	name: document.getElementById('name'),
	enterBox: document.getElementById('enter-box'),
	hiBox: document.getElementById('hi-box'),
	listUser: document.getElementById('list-user'),
	username: document.getElementById('username'),
	logout: document.getElementById('logout')
}

var username = getCookie('username');

if (username != "") {
	menu.username.innerHTML = username;
	menu.hiBox.style.display = 'block';
	menu.listUser.style.display = 'block';

	socket.emit('login', username);
} else {
	menu.enterBox.style.display = 'block';
}

getStream((data) => {
	stream = data;
	offerVideo.setStream(data);
	offerVideo.play();
})

/**
 * Event
 */
menu.float.addEventListener('click', () => {
	if (menu.isOpen) {
		menu.menu.className = '';
		menu.isOpen = false;
	} else {
		menu.menu.className = 'open';
		menu.isOpen = true;
	}
})

menu.enter.addEventListener('click', () => {
	var name = menu.name.value;
	setCookie('username', name);
	username = name;
	
	menu.username.innerHTML = username;
	menu.enterBox.style = 'none';
	menu.hiBox.style.display = 'block';
	menu.listUser.style.display = 'block';

	socket.emit('login', username);
})

menu.logout.addEventListener('click', () => {
	setCookie('username', 'deleted', -1);
	location.reload();
})

socket.on('update users', users => {
	menu.listUser.innerHTML = '';
	users.forEach(user => {
		let id = user.id;
		var li = document.createElement('li');
		li.innerHTML = user.username;

		let spanCall = document.createElement('span');
		spanCall.className = 'call';
		spanCall.addEventListener('click', () => {
			startCall(id);
		});

		let spanMeg = document.createElement('span');
		spanMeg.className = 'meg';

		li.appendChild(spanCall);
		li.appendChild(spanMeg);

		menu.listUser.appendChild(li);	
	})
})

socket.on('offer signal', (data) => {
	if (stream == null) {
		console.log('Can\'t get your video stream!');
	} else {
		answerPeer = new Peer({trickle: false, stream}),
		answerPeer.signal(data.signal);

		answerPeer.on('signal', signal => {
			console.log('Received offer signal, sending answer signal to server');
			socket.emit('answer signal', { signal, id:data.id });
		})

		answerPeer.on('stream', stream => {
			console.log('Answer peer on stream');
			answerVideo.videoObject.style.display = 'block';
			answerVideo.setStream(stream);
			answerVideo.play();
		})

		answerPeer.on('connect', () => {
			console.log('Answer peer connected');
		})
	}
})

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays = 360) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

function startCall(id) {
	if (stream == null) {
		console.log('Can\'t get your video stream!');
	} else {
		var offerPeer = new Peer({initiator: true, trickle: false, stream});
		offerPeer.on('signal', (signal) => {
			console.log('Send offer signal to server')
			socket.emit('offer signal', { id, signal });
		})

		socket.on('answer signal', data => {
			console.log('Received answer signal')
			offerPeer.signal(data.signal);

			offerPeer.on('connect', () => {
				console.log('Offer peer connected!');
			})

			offerPeer.on('stream', (stream) => {
				console.log('Offer peer on stream');
				answerVideo.videoObject.style.display = 'block';
				answerVideo.setStream(stream);
				answerVideo.play();
			})
		})
	}
}
