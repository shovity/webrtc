const getStream = require('./getStream');
const playVideo = require('./playVideo');
const Peer = require('simple-peer');

let signal = document.getElementById('signal');
let btn = document.getElementById('btn');

getStream((stream) => {

    let p = new Peer({ initiator: location.hash === '#1', trickle: false, stream: stream });
    playVideo(stream, 'offer-video');

    p.on('error', function(err) { console.log('error', err) });

    p.on('signal', data => signal.value = JSON.stringify(data));

    p.on('connect', () => {
    	setInterval(() => {
    		p.send('Connected, hey');
    	}, 1000)
    });

    p.on('data', (data) => {
    	console.log(data.toString());
    });

    p.on('stream', answerStream => {
        playVideo(answerStream, 'answer-video');
        console.log('on stream')
    });

    btn.addEventListener('click', () => {
        p.signal(JSON.parse(signal.value));
    });
});
