module.exports = (callback) => {

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({ video: true, audio: true },
            stream => callback(stream),
            err => console.log("The following error occurred: " + err.name)
        );
    } else {
        console.log("getUserMedia not supported");
    }
}
