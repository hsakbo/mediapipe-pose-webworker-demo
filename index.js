import { Camera } from "@mediapipe/camera_utils";


const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer);


const worker = new Worker("worker.js")
worker.onmessage = (ev) => {
    onResults(ev.data)
}

function onResults(results) {
    if (!results.poseLandmarks) {
        grid.updateLandmarks([]);
        return;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.segmentationMask, 0, 0,
        canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
    canvasCtx.globalCompositeOperation = 'source-in';
    canvasCtx.fillStyle = '#00FF00';
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = 'source-over';
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        {color: '#00FF00', lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks,
        {color: '#FF0000', lineWidth: 2});
    canvasCtx.restore();

    grid.updateLandmarks(results.poseWorldLandmarks);
}


const camera = new Camera(videoElement, {
    onFrame: async () => {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        context.drawImage(videoElement, 1280, 720)
        // await pose.send({image: videoElement});
        canvas.toBlob((blob) => {
            worker.postMessage(blob)
        })
    },
    width: 1280,
    height: 720
});
camera.start();

