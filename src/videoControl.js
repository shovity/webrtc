module.exports = (id) => {
	var video = {
		videoObject: document.getElementById(id),
		setStream: stream => {
			video.videoObject.src = window.URL.createObjectURL(stream);
		}
	}

	return video;
}