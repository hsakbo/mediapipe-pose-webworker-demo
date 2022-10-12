import { Pose } from "@mediapipe/pose";

const pose = new Pose({
    locateFile: (file) => {
        return `http://localhost:3000/public/mediapipe/${file}`;
    }
});

pose.onResults((results) => {
    postMessage(results)
})

pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

let printed = false
onmessage = (ev) => {
    if (printed) {
        return
    }
    const bitmapPromise = createImageBitmap(ev.data)
    bitmapPromise.then((bitmap) => {
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
        const context = canvas.getContext("2d")
        context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height)
        pose.send({
            image: canvas
        })
    })
    printed = true
}

