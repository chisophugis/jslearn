(function indexIIFE() {
    'use strict';

    var video = document.querySelector('video'),
        canvas = document.querySelector('canvas'),
        img = document.querySelector('#screenshot'),
        ctx = canvas.getContext('2d'),
        localMediaStream = null,
        toggleButton = document.querySelector('#toggle-button');


    function onFailSoHard(e) {
        window.console.log('Rejected!', e);
    }

    function sizeCanvas() {
        setTimeout(function () {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            img.height = video.videoHeight;
            img.width = video.videoWidth;
        }, 100);
    }

    function snapshotOnClick() {
        if (!localMediaStream) {
            return;
        }

        ctx.drawImage(video, 0, 0);
        document.querySelector('img').src = canvas.toDataURL('image/webp');
    }

    function onGettingLocalMediaStream(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function (e) {}; // Cargo cult
        localMediaStream = stream;
        sizeCanvas();
        video.addEventListener('click', snapshotOnClick, false);
        toggleButton.textContent = 'Stop';
    }

    function getUserMedia() {
        // This function forwards its arguments.
        var fn = navigator.getUserMedia || navigator.webkitGetUserMedia;
        fn.apply(navigator, arguments);
    }

    function onToggleButtonClicked() {
        if (toggleButton.textContent === 'Start') {
            getUserMedia({
                video: true,
                audio: true
            }, onGettingLocalMediaStream, onFailSoHard);
            return;
        }
        if (toggleButton.textContent === 'Stop') {
            video.pause();
            localMediaStream.stop();
            // TODO: how to make this toggling happen in a unified place?
            toggleButton.textContent = 'Start';
            return;
        }
        throw new Error('Unknown text content for #toggle-button');
    }

    toggleButton.addEventListener('click', onToggleButtonClicked);

}());
