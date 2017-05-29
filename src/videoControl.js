module.exports = (id) => {
	var video = {
		videoObject: document.getElementById(id),
		setStream: stream => {
			video.videoObject.src = window.URL.createObjectURL(stream);
		},
		play: () => {
			video.videoObject.play();
		}
	}

	return video;
}