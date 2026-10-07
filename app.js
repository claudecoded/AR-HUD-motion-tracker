const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('hud_canvas');
const canvasCtx = canvasElement.getContext('2d');

let lastTime = performance.now();
let fps = 0;
let evolutionLevel = 0.0;
let gestureText = "GESTURE: SEARCHING...";

// Neon Color Palette
const neonGreen = "#00ffb2";
const neonBlue = "#00d7ff";
const cyberCyan = "#00ffff";

// Draw cyberpunk cornered bounding box
function drawCornerRect(ctx, x, y, w, h, color, thickness = 2, lineLen = 20) {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    
    // Top-Left
    ctx.beginPath(); ctx.moveTo(x, y + lineLen); ctx.lineTo(x, y); ctx.lineTo(x + lineLen, y); ctx.stroke();
    // Top-Right
    ctx.beginPath(); ctx.moveTo(x + w, y + lineLen); ctx.lineTo(x + w, y); ctx.lineTo(x + w - lineLen, y); ctx.stroke();
    // Bottom-Left
    ctx.beginPath(); ctx.moveTo(x, y + h - lineLen); ctx.lineTo(x, y + h); ctx.lineTo(x + lineLen, y + h); ctx.stroke();
    // Bottom-Right
    ctx.beginPath(); ctx.moveTo(x + w, y + h - lineLen); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - lineLen, y + h); ctx.stroke();
    
    // Thin outer container box
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, y, w, h);
}

function onResults(results) {
    // 1. Calculate FPS
    const now = performance.now();
    fps = 1000 / (now - lastTime);
    lastTime = now;

    // Clear canvas for redrawing next frame
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Mirror standard canvas operations to match flipped webcam video
    canvasCtx.save();
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);

    let targetX = null;
    let targetY = null;

    // --- A. FACE MESH & HUD BOUNDING BOX ---
    if (results.faceLandmarks) {
        let xMin = 1, xMax = 0, yMin = 1, yMax = 0;
        results.faceLandmarks.forEach(lm => {
            if (lm.x < xMin) xMin = lm.x; if (lm.x > xMax) xMax = lm.x;
            if (lm.y < yMin) yMin = lm.y; if (lm.y > yMax) yMax = lm.y;
        });

        const padX = 0.04 * canvasElement.width;
        const padY = 0.06 * canvasElement.height;
        const x = xMin * canvasElement.width - padX;
        const y = yMin * canvasElement.height - padY;
        const w = (xMax - xMin) * canvasElement.width + (padX * 2);
        const h = (yMax - yMin) * canvasElement.height + (padY * 2);

        drawCornerRect(canvasCtx, x, y, w, h, neonGreen, 3);
        
        // Text overlay processing (Must un-mirror to draw text normally)
        canvasCtx.restore();
        canvasCtx.save();
        canvasCtx.font = "bold 14px Courier New";
        canvasCtx.fillStyle = neonGreen;
        canvasCtx.fillText("BIOMETRIC: FACE DETECTED", canvasElement.width - x - w, y - 10);
        canvasCtx.restore();
        canvasCtx.save();
        canvasCtx.translate(canvasElement.width, 0);
        canvasCtx.scale(-1, 1);
    }

    // --- B. HAND LANDMARKS TRACKING ---
    let handDetected = results.leftHandLandmarks || results.rightHandLandmarks;
    if (handDetected) {
        const hand = results.leftHandLandmarks || results.rightHandLandmarks;
        
        // Algorithmic check for Open Palm gesture
        const wrist = hand[0];
        const middleTip = hand[12];
        const dist = Math.sqrt(Math.pow(wrist.x - middleTip.x, 2) + Math.pow(wrist.y - middleTip.y, 2));

        if (dist > 0.32) {
            gestureText = "GESTURE: OPEN_PALM";
            if (evolutionLevel < 100) evolutionLevel += 1.2;
            
            // Render Hand Joint Constellation Mesh
            hand.forEach(lm => {
                canvasCtx.beginPath();
                canvasCtx.arc(lm.x * canvasElement.width, lm.y * canvasElement.height, 4, canvasCtx.fillStyle = cyberCyan);
                canvasCtx.fill();
            });

            // Isolate index finger knuckle joint coordinates for line connection
            targetX = hand[5].x * canvasElement.width;
            targetY = hand[5].y * canvasElement.height;
        }
    } else {
        gestureText = "GESTURE: SEARCHING...";
        if (evolutionLevel > 0) evolutionLevel -= 2.0;
        if (evolutionLevel < 0) evolutionLevel = 0;
    }

    // --- C. STATIC HUD METRICS & CONNECTORS ---
    canvasCtx.restore(); // Return coordinates system back to normal text orientation

    // Draw Vector HUD Lines targeting the system status box
    if (targetX !== null && targetY !== null) {
        const originalX = canvasElement.width - targetX; // Re-calculate flipped coordinates
        const boxConnectorX = canvasElement.width - 260;
        
        canvasCtx.strokeStyle = cyberCyan;
        canvasCtx.lineWidth = 1;
        canvasCtx.beginPath();
        canvasCtx.moveTo(originalX, targetY);
        canvasCtx.lineTo(boxConnectorX, 120);
        canvasCtx.stroke();
        
        canvasCtx.fillStyle = cyberCyan;
        canvasCtx.beginPath(); canvasCtx.arc(originalX, targetY, 4, 0, 2*Math.PI); canvasCtx.fill();
    }

    // Rendering System Status Panel Box
    const boxX = canvasElement.width - 270;
    canvasCtx.fillStyle = "rgba(15, 15, 15, 0.6)";
    canvasCtx.fillRect(boxX, 40, 240, 140);
    canvasCtx.strokeStyle = neonGreen;
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeRect(boxX, 40, 240, 140);

    canvasCtx.fillStyle = neonGreen;
    canvasCtx.font = "bold 15px Courier New";
    canvasCtx.fillText("SYSTEM STATUS", boxX + 15, 65);
    canvasCtx.font = "12px Courier New";
    canvasCtx.fillText(`NEURAL_LINK: ACTIVE`, boxX + 15, 95);
    canvasCtx.fillText(`FPS TRACKING: ${Math.round(fps)}`, boxX + 15, 115);
    canvasCtx.fillText(`SYS_ID: #WEB_${Math.floor(Math.random()*900)+100}`, boxX + 15, 135);
    canvasCtx.fillStyle = "#00ff00";
    canvasCtx.fillText("STATUS: OPERATIONAL", boxX + 15, 160);

    // Evolution Bar Rendering
    const barX = canvasElement.width - 300;
    const barY = canvasElement.height - 80;
    canvasCtx.fillStyle = "#222";
    canvasCtx.fillRect(barX, barY, 260, 20);
    canvasCtx.fillStyle = neonBlue;
    canvasCtx.fillRect(barX, barY, (evolutionLevel / 100) * 260, 20);
    canvasCtx.fillText(`cyber_evolution_level: ${evolutionLevel.toFixed(1)}%`, barX, barY - 10);

    // General HUD Interfaces Text
    canvasCtx.fillStyle = neonGreen;
    canvasCtx.font = "16px Courier New";
    canvasCtx.fillText(gestureText, 40, canvasElement.height - 50);

    // Text Instructions Box
    canvasCtx.fillStyle = "#aaa";
    canvasCtx.font = "13px Courier New";
    canvasCtx.fillText("* Show your hand gestures:", 40, 50);
    canvasCtx.fillText("  - Open Palm -> Circuit Overlays", 40, 75);
}

// System Booting Sequence
const holistic = new Holistic({locateFile: (file) => `https://jsdelivr.net{file}`});
holistic.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
holistic.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => { await holistic.send({image: videoElement}); },
    width: 1280,
    height: 720
});
camera.start();
