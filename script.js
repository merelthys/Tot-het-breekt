// Detecteer scroll status per sectie (boven/onder water)
document.querySelectorAll('section').forEach((section, index) => {
    section.addEventListener('scroll', () => {
        const scrollPos = section.scrollTop;
        const vh = window.innerHeight;

        if (scrollPos < vh / 2) {
            console.log(`Section ${index + 1}: boven water`);
        } else {
            console.log(`Section ${index + 1}: onder water`);
        }
    });
});

// Zorg dat Datawrapper iframes hun hoogte correct krijgen
(function () {
    "use strict";
    window.addEventListener("message", function (a) {
        if (a.data["datawrapper-height"] !== undefined) {
            var iframes = document.querySelectorAll("iframe");
            for (var chartId in a.data["datawrapper-height"]) {
                for (var i = 0; i < iframes.length; i++) {
                    if (iframes[i].contentWindow === a.source) {
                        iframes[i].style.height = a.data["datawrapper-height"][chartId] + "px";
                    }
                }
            }
        }
    });
})();

// Elementen ophalen
const zoomArea = document.getElementById("zoom-area");
const originalMap = document.getElementById("original-map");
const zoomedMap = document.getElementById("zoomed-map");

function showOriginalMap() {
    originalMap.style.display = "block";
    zoomedMap.style.display = "none";
    zoomArea.style.display = "block";
}

function showZoomedMap() {
    originalMap.style.display = "none";
    zoomedMap.style.display = "block";
}

// 🔍 Nieuw: klik om in te zoomen op desktop
zoomArea.addEventListener("click", function () {
    if (!isTouchDevice()) {
        showZoomedMap();
    }
});

// 🔍 Touch pinch-zoom detectie
let initialDistance = null;

originalMap.addEventListener("touchstart", function (e) {
    if (e.touches.length > 1) {
        e.preventDefault(); // voorkom native zoom
    }
}, { passive: false });

zoomArea.addEventListener("touchstart", function (e) {
    if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistance = Math.sqrt(dx * dx + dy * dy);
    }
}, false);

zoomArea.addEventListener("touchmove", function (e) {
    if (e.touches.length === 2 && initialDistance !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        if (currentDistance - initialDistance > 80) {
            showZoomedMap();
            initialDistance = null;
        }
    }
}, false);

zoomArea.addEventListener("touchend", function (e) {
    if (e.touches.length < 2) {
        initialDistance = null;
    }
}, false);

// Fullscreen foto's
function openFullscreen(imgElement) {
    const fullscreen = document.getElementById("fullscreen-photo");
    const fullscreenImg = document.getElementById("fullscreen-img");

    fullscreenImg.src = imgElement.src;
    fullscreen.style.display = "flex";
}

function closeFullscreen() {
    const fullscreen = document.getElementById("fullscreen-photo");
    fullscreen.style.display = "none";
}

// Viewport-zoom mobiel aanpassen
document.addEventListener("DOMContentLoaded", function () {
    const viewportMeta = document.querySelector("meta[name=viewport]");
    let isZoomEnabled = false;

    zoomArea.addEventListener("touchstart", function () {
        if (!isZoomEnabled) {
            viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes");
            isZoomEnabled = true;
        }
    });

    document.body.addEventListener("touchstart", function (e) {
        if (!zoomArea.contains(e.target)) {
            viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no");
            isZoomEnabled = false;
        }
    });
});

// Detecteer of het een touchscreen is
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
