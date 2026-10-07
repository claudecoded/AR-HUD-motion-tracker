# 🌐 AR HUD Engine

A complex Real-Time Augmented Reality Heads-Up Display (HUD) built with **JavaScript**, **HTML5 Canvas**, and **Google MediaPipe Holistic**. This application tracks face landmarks and hand gestures to render an interactive, futuristic cyberpunk overlay directly in your web browser.

## 🚀 Features
* **Biometric Face Tracking:** Real-time facial area localization with adaptive bounding boxes.
* **Hand Constellation Mesh:** Interactive circuit overlay drawn dynamically when an open palm gesture is detected.
* **Vector HUD Connectors:** Dynamic lines targeting knuckle coordinates to update system telemetry.
* **Zero Installation:** Runs purely on client-side WebAssembly. No Python or environment setups required.

## 🛠️ How to Run Locally
1. Clone this repository or download the files.
2. Ensure both `index.html` and `app.js` are in the same directory.
3. Open `index.html` using any modern web browser (Chrome, Edge, Firefox).
4. Grant webcam permissions and test the gestures!

## 🎮 Controls
* **Open Palm:** Activates the cybernetic mesh and charges the `cyber_evolution` meter.
* **No Hands:** Enters diagnostic scanning and cooling loop.
