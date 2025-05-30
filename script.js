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

// Datawrapper iframe hoogte fix
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

// Toon originele kaart
function showOriginalMap() {
    originalMap.style.display = "block";
    zoomedMap.style.display = "none";
    zoomArea.style.display = "block";
}

// Toon ingezoomde kaart en verberg alles wat niet nodig is
function showZoomedMap() {
    originalMap.style.display = "none";
    zoomedMap.style.display = "none";
    zoomArea.style.display = "none"; // DIT is de sleutel
}

// Desktop klik om in te zoomen
zoomArea.addEventListener("click", function () {
    if (!isTouchDevice()) {
        showZoomedMap();
    }
});

// Fullscreen foto's
document.querySelectorAll("#zoom-area img").forEach(img => {
    img.addEventListener('click', () => {
        if (!img.classList.contains('fullscreen')) {
            img.classList.add('fullscreen');
            showZoomedMap();
        } else {
            img.classList.remove('fullscreen');
            showOriginalMap();
        }
    });
});

// Pinch-zoom touch logica
let initialDistance = null;

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

// Fullscreen-foto los
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

// Viewport zoom op mobiel aanzetten bij aanraking zoomArea
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

// Detecteer touchscreen
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
