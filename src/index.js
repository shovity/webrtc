const getStream = require('./getStream');
const playVideo = require('./playVideo');
const Peer = require('simple-peer');

let p = new Peer({ initiator: location.hash === '#1', trickle: false })
let signal = document.getElementById('signal');

p.on('error', function(err) { console.log('error', err) })

p.on('signal', function(data) {
    signal.value = JSON.stringify(data);
})

p.on('connect', () => {
    console.log('Connected');
})

let btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    p.signal(JSON.parse(signal.value));
})

getStream((stream) => {
    playVideo(stream, 'local-video');
})
