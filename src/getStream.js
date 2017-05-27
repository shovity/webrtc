module.exports = (callback) => {
    var videoSources = [];
    var audioSources = [];

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    navigator.mediaDevices.enumerateDevices().then(function(sourceInfos) {
        for (var i = 0; i !== sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];

            if (sourceInfo.kind === 'audioinput') {
                audioSources.push(sourceInfo.deviceId);
            } else if (sourceInfo.kind === 'videoinput') {
                videoSources.push(sourceInfo.deviceId);
            } else {
                console.log('Some other kind of source: ', sourceInfo);
            }
        }
    });

    var constraints = {
        audio: {
            optional: [{
                sourceId: audioSources[0]
            }]
        },
        video: {
            optional: [{
                sourceId: videoSources[0]
            }]
        }
    };

    if (navigator.getUserMedia) {
        navigator.getUserMedia(
            constraints,
            stream => callback(stream),
            err => console.log("The following error occurred: " + err.name)
        );
    } else {
        console.log("getUserMedia not supported");
    }
}
