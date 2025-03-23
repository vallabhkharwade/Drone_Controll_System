// Establish WebSocket Connection

let socket;

function connectESP32() {
    let statusText = document.getElementById("connection-status");
    let wifiIcon = document.getElementById("wifi-icon");

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        socket = new WebSocket("ws://<ESP32-IP>:81/");

        socket.onopen = function () {
            statusText.textContent = "Connected";
            statusText.classList.remove("disconnected");
            statusText.classList.add("connected");
            wifiIcon.src = "images/wifi-connected.png";
            console.log("ESP32 Connected");
        };

        socket.onclose = function () {
            statusText.textContent = "Disconnected";
            statusText.classList.remove("connected");
            statusText.classList.add("disconnected");
            wifiIcon.src = "images/wifi-disconnected.png";
            console.log("ESP32 Disconnected");
        };

        socket.onerror = function (error) {
            console.log("WebSocket Error: ", error);
        };
    } else {
        socket.close();
    }
}

// Send Commands to ESP32

function sendCommand(command) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(command);
        console.log("Sent Command: " + command);
    } else {
        console.log("WebSocket not connected");
    }
}

function togglePower() {
    let powerSwitch = document.getElementById("power-toggle");
    let command = powerSwitch.checked ? "POWER_ON" : "POWER_OFF";
    sendCommand(command);
}

function setMode(mode) {
    let autoMode = document.getElementById("auto-mode-toggle");
    let manualMode = document.getElementById("manual-mode-toggle");

    if (mode === "auto") {
        autoMode.checked = true;
        manualMode.checked = false;
        sendCommand("AUTO_MODE");
    } else {
        manualMode.checked = true;
        autoMode.checked = false;
        sendCommand("MANUAL_MODE");
    }
}

function moveDrone(direction) {
    sendCommand("MOVE_" + direction.toUpperCase());
}
