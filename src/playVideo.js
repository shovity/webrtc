module.exports = (stream, videoId) => {
	var video = document.getElementById(videoId);
    video.srcObject = stream;
    video.onloadedmetadata = e => {
        video.play();
    }
}