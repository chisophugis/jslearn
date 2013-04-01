// Need to write Accountable class/interface.
// Accountability needs to be built into the core of everything. Any time
// something is not instantaneous, we should be able to apologize to the
// user about why it happened, and what can be done about it to ensure that
// it never happens again.
//
// We should be able to track any operation we do.
//
// Start it out lightweight. Just something that tracks when it changes
// hands and timing results. It should be serializable to JSON, and
// contain some sort of GUID.
//
// It makes sense that every user interaction (click, keypress, etc) that
// triggers an action should create a root accountability object to track
// its progress. When the response to the user input is complete, the
// accountability object gets pushed onto a ring-buffer queue of "completed
// events" which can then be inspected.
//
// I think that a general architecture could be the following:
//   - Every user input that we act on generates a "root" accountability
//   object.
//   - Every action which is performed in order to complete an
//   accountability object has a property "parent" holding its parent's
//   GUID.
//
// Pick a restricted interface between components and stick with it.
//
// Motto: "accountable to the user", "observability"

(function indexIIFE() {
    'use strict';

    // CAP: these should be passed in.
    var video = document.querySelector('video'),
        canvas = document.querySelector('canvas'),
        img = document.querySelector('#screenshot'),
        // CAP: should not be able to draw arbitrary things to the canvas.
        ctx = canvas.getContext('2d'),
        localMediaStream = null,
        toggleButton = document.querySelector('#toggle-button'),
        window_URL = window.URL || window.webkitURL || window.mozURL ||
                     window.msURL;


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
        img.src = canvas.toDataURL('image/webp');
    }

    function onGettingLocalMediaStream(stream) {
        if (video.mozSrcObject !== undefined) {
            video.mozSrcObject = stream;
        } else {
            video.src = window_URL.createObjectURL(stream);
        }
        video.play();
        localMediaStream = stream;
        sizeCanvas();
        video.addEventListener('click', snapshotOnClick, false);
        toggleButton.textContent = 'Stop';
    }

    function getUserMedia() {
        // This function forwards its arguments.
        var fn = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                 navigator.mozGetUserMedia || navigator.msGetUserMedia;
        fn.apply(navigator, arguments);
    }

    function onToggleButtonClicked() {
        // CAP: should only be able to get and set the text content of this
        // button.
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

// TODO: should rewrite this with an object capabilties approach. (using
// AMD or commonJS or something?)
