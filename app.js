const canvasElement = document.getElementById('hud_canvas');
const canvasCtx = canvasElement.getContext('2d');

// Cyberpunk Neon Color Palette Setup
const neonGreen = "#00ffb2";
const neonBlue = "#00d7ff";
const cyberCyan = "#00ffff";

function drawCornerRect(ctx, x, y, w, h, color, thickness = 2, lineLen = 20) {
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    
    // Tech-style corner bracket highlights
    ctx.beginPath(); ctx.moveTo(x, y + lineLen); ctx.lineTo(x, y); ctx.lineTo(x + lineLen, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w, y + lineLen); ctx.lineTo(x + w, y); ctx.lineTo(x + w - lineLen, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + h - lineLen); ctx.lineTo(x, y + h); ctx.lineTo(x + lineLen, y + h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w, y + h - lineLen); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - lineLen, y + h); ctx.stroke();
    
    // Thin framing outer box bounding line
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x, y, w, h);
}

function renderStaticHUD() {
    // Clear display buffer and apply cinematic ambient background
    canvasCtx.fillStyle = "#0c0f12";
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // 1. Biometric Facial Scanner Bounding Box Display
    const faceX = 490, faceY = 180, faceW = 300, faceH = 340;
    drawCornerRect(canvasCtx, faceX, faceY, faceW, faceH, neonGreen, 3);
    
    canvasCtx.fillStyle = neonGreen;
    canvasCtx.font = "bold 14px Courier New";
    canvasCtx.fillText("BIOMETRIC: FACE DETECTED", faceX, faceY - 15);

    // 2. Hand Gesture Node Array Tracking Constellation Mesh Simulation
    const handPoints = [
        {x: 250, y: 450}, {x: 220, y: 400}, {x: 200, y: 340}, {x: 210, y: 280},
        {x: 260, y: 260}, {x: 290, y: 310}, {x: 320, y: 360}, {x: 310, y: 420}
    ];

    // Connect node pathways
    canvasCtx.strokeStyle = "rgba(0, 255, 255, 0.4)";
    canvasCtx.lineWidth = 1;
    canvasCtx.beginPath();
    handPoints.forEach((pt, i) => {
        if(i === 0) canvasCtx.moveTo(pt.x, pt.y);
        else canvasCtx.lineTo(pt.x, pt.y);
    });
    canvasCtx.stroke();

    // Render cyber nodes
    handPoints.forEach(pt => {
        canvasCtx.beginPath();
        canvasCtx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
        canvasCtx.fillStyle = cyberCyan;
        canvasCtx.fill();
    });

    // 3. Dynamic Technical Vector Interface Connector Line
    const boxX = canvasElement.width - 270;
    canvasCtx.strokeStyle = cyberCyan;
    canvasCtx.lineWidth = 1;
    canvasCtx.beginPath();
    canvasCtx.moveTo(320, 360); // Knuckle node anchor point
    canvasCtx.lineTo(boxX, 120);  // HUD diagnostics module target 
    canvasCtx.stroke();

    // 4. System Telemetry Diagnostic Monitor Panel
    canvasCtx.fillStyle = "rgba(15, 25, 20, 0.8)";
    canvasCtx.fillRect(boxX, 40, 240, 140);
    canvasCtx.strokeStyle = neonGreen;
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeRect(boxX, 40, 240, 140);

    canvasCtx.fillStyle = neonGreen;
    canvasCtx.font = "bold 15px Courier New";
    canvasCtx.fillText("SYSTEM STATUS", boxX + 15, 65);
    canvasCtx.font = "12px Courier New";
    canvasCtx.fillText(`NEURAL_LINK: ACTIVE`, boxX + 15, 95);
    canvasCtx.fillText(`FPS TRACKING: 60.0`, boxX + 15, 115);
    canvasCtx.fillText(`SYS_ID: #WEB_739B`, boxX + 15, 135);
    canvasCtx.fillStyle = "#00ff00";
    canvasCtx.fillText("STATUS: OPERATIONAL", boxX + 15, 160);

    // 5. Progression Monitoring Metrics (Cyber Evolution Status Indicator)
    const barX = canvasElement.width - 300;
    const barY = canvasElement.height - 80;
    canvasCtx.fillStyle = "#222";
    canvasCtx.fillRect(barX, barY, 260, 20);
    canvasCtx.fillStyle = neonBlue;
    canvasCtx.fillRect(barX, barY, 260 * 0.85, 20); // Simulating 85% processing output
    canvasCtx.fillStyle = neonGreen;
    canvasCtx.fillText(`cyber_evolution_level: 85.0%`, barX, barY - 10);

    // UI Feedback System Labels
    canvasCtx.font = "16px Courier New";
    canvasCtx.fillText("GESTURE: OPEN_PALM", 40, canvasElement.height - 50);

    // Execution Context Commands Box
    canvasCtx.fillStyle = "#aaa";
    canvasCtx.font = "13px Courier New";
    canvasCtx.fillText("* Show your hand gestures:", 40, 50);
    canvasCtx.fillText("  - Open Palm -> Circuit Overlays", 40, 75);
}

// Instantiate automated graphic engine pipeline on bootstrap sequence
window.onload = renderStaticHUD;
