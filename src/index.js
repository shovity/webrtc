const Peer = require('simple-peer'),
	socket = require('socket.io-client')();

const getStream = require('./getStream'),
	videoControl = require('./videoControl'),
	cookier = require('./cookier');

var offerVideo = videoControl('offer-video'),
	answerVideo = videoControl('answer-video');

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

// getStream((stream) => {

//     let p = new Peer({ initiator: location.hash === '#1', trickle: false, stream: stream });
//     offerVideo.setStream(stream);
//     offerVideo.videoObject.play();

//     // answerVideo.setStream(stream);answerVideo.videoObject.play();

//     p.on('error', function(err) { console.log('error', err) });

//     p.on('signal', data => signal.value = JSON.stringify(data));

//     p.on('connect', () => {
//     	setInterval(() => {
//     		p.send('Connected, hey');
//     	}, 1000)
//     });

//     p.on('data', (data) => {
//     	console.log(data.toString());
//     });

//     p.on('stream', answerStream => {
// 	    answerVideo.setStream(stream);
// 	    answerVideo.videoObject.play();
//     });

//     btn.addEventListener('click', () => {
//         p.signal(JSON.parse(signal.value));
//     });
// });

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
		menu.listUser.innerHTML += '<li>' + user.username + '<span class="call"></span><span class="meg"></span></li>';
	})
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
