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

window.addEventListener('load', () => {
    const firstBottomPanel = document.querySelector('.vertical-stack .panel.bottom');
    if (firstBottomPanel) {
        firstBottomPanel.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
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

// kaarten
const zoomArea = document.getElementById("zoom-area");
const originalMap = document.getElementById("original-map");
const zoomedMap = document.getElementById("zoomed-map");
const zoomIcoon = document.querySelector('.zoom-icoon');
const clickIcoon = document.querySelector('.click-icoon');

originalMap.addEventListener('wheel', e => {
  e.preventDefault();
}, { passive: false });

originalMap.addEventListener('touchmove', e => {
  e.preventDefault();
}, { passive: false });

function showOriginalMap() {
    originalMap.style.display = "block";
    zoomedMap.style.display = "none";
    zoomArea.classList.remove("hidden");
}

function showZoomedMap() {
    originalMap.style.display = "none";
    zoomedMap.style.display = "block";
    zoomArea.classList.add("hidden");
}

zoomArea.addEventListener('click', function () {
    originalMap.style.display = 'none';
    zoomedMap.style.display = 'block';
    zoomIcoon.style.display = 'none';
    clickIcoon.style.display = 'block';
});

clickIcoon.style.display = 'none';

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

document.getElementById("zoom-area-2").addEventListener("click", () => {
    const panels = document.querySelectorAll(".panel.bottom");
    panels[1].scrollIntoView({ behavior: "smooth" });
});

// ➕ Blokkeer horizontaal swipen in panel.bottom
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".panel.bottom").forEach(panel => {
        let startX = 0;
        let startY = 0;

        panel.addEventListener("touchstart", function (e) {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        });

        panel.addEventListener("touchmove", function (e) {
            if (e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - startX;
                const deltaY = e.touches[0].clientY - startY;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    e.preventDefault(); // blokkeer horizontale swipe
                }
            }
        }, { passive: false });
    });
});

// Blokkeer omlaag scrollen in section.start .panel.bottom
document.addEventListener("DOMContentLoaded", () => {
    const startSection = document.querySelector("section.start");
    if (startSection) {
        const startBottomPanel = startSection.querySelector(".panel.bottom");

        if (startBottomPanel) {
            startBottomPanel.addEventListener("wheel", function (e) {
                const goingUp = e.deltaY > 0;
                const horizontalScroll = e.deltaX !== 0;
                if (goingUp || horizontalScroll) {
                    e.preventDefault(); // Blokkeer scroll omlaag
                }
            }, { passive: false });

            let startX = 0;
            let startY = 0;

            startBottomPanel.addEventListener("touchstart", function (e) {
                if (e.touches.length === 1) {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                }
            });

            startBottomPanel.addEventListener("touchmove", function (e) {
                if (e.touches.length === 1) {
                    const deltaX = e.touches[0].clientX - startX;
                    const deltaY = e.touches[0].clientY - startY;

                    const movingHorizontaal = Math.abs(deltaX) > Math.abs(deltaY);
                    const movingUp = deltaY > 0;

                    if (movingHorizontaal || movingUp) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });

            startBottomPanel.addEventListener("keydown", function (e) {
                if (e.key === "ArrowDown" || e.key === "PageDown") {
                    e.preventDefault(); // Blokkeer pijltjestoetsen omlaag
                }
            });
        }
    }
});

// Blokkeer scrollen in section.start .panel.top
document.addEventListener("DOMContentLoaded", () => {
    const startSection = document.querySelector("section.start");
    if (startSection) {
        const startTopPanel = startSection.querySelector(".panel.top");

        if (startTopPanel) {
            startTopPanel.addEventListener("wheel", function (e) {
                const goingUp = e.deltaY > 0;
                const horizontalScroll = e.deltaX !== 0;
                if (goingUp || horizontalScroll) {
                    e.preventDefault(); // Blokkeer scroll omlaag
                }
            }, { passive: false });

            let startX = 0;
            let startY = 0;

            startTopPanel.addEventListener("touchstart", function (e) {
                if (e.touches.length === 1) {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                }
            });

            startTopPanel.addEventListener("touchmove", function (e) {
                if (e.touches.length === 1) {
                    const deltaX = e.touches[0].clientX - startX;
                    const deltaY = e.touches[0].clientY - startY;

                    const movingHorizontaal = Math.abs(deltaX) > Math.abs(deltaY);
                    const movingUp = deltaY > 0;

                    if (movingHorizontaal || movingUp) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });

            startTopPanel.addEventListener("keydown", function (e) {
                if (e.key === "ArrowDown" || e.key === "PageDown") {
                    e.preventDefault(); // Blokkeer pijltjestoetsen omlaag
                }
            });
        }
    }
});

// Blokkeer scrollen in section.deel2 .panel.bottom
document.addEventListener("DOMContentLoaded", () => {
    const deel2Section = document.querySelector("section.deel2");
    if (deel2Section) {
        const deel2BottomPanel = deel2Section.querySelector(".panel.bottom");

        if (deel2BottomPanel) {
            // Blokkeer muiswiel en horizontale scroll
            deel2BottomPanel.addEventListener("wheel", function (e) {
                e.preventDefault();
            }, { passive: false });

            // Blokkeer touch swipe (zowel verticaal als horizontaal)
            let startX = 0;
            let startY = 0;

            deel2BottomPanel.addEventListener("touchstart", function (e) {
                if (e.touches.length === 1) {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                }
            });

            deel2BottomPanel.addEventListener("touchmove", function (e) {
                if (e.touches.length === 1) {
                    const deltaX = e.touches[0].clientX - startX;
                    const deltaY = e.touches[0].clientY - startY;

                    const movingHorizontaal = Math.abs(deltaX) > Math.abs(deltaY);
                    const movingUpOrDown = Math.abs(deltaY) > 0;

                    if (movingHorizontaal || movingUpOrDown) {
                        e.preventDefault();
                    }
                }
            }, { passive: false });

            // Blokkeer toetsenbord scroll (zoals pijltjes of PageDown)
            deel2BottomPanel.addEventListener("keydown", function (e) {
                if (
                    e.key === "ArrowDown" ||
                    e.key === "ArrowUp" ||
                    e.key === "PageDown" ||
                    e.key === "PageUp" ||
                    e.key === "Home" ||
                    e.key === "End"
                ) {
                    e.preventDefault();
                }
            });
        }
    }
});


const zoomArea3 = document.getElementById("zoom-area-3");
const overviewPoliepen = document.querySelector(".overview-poliepen");
const closeupPoliepen = document.querySelector(".closeup-poliepen");
const achtergrondCloseup = document.querySelector(".achtergrond-closeup");
const achtergrondVissen = document.querySelector(".achtergrond-vissen-2");

// voorkom scroll/zoom gedrag op touchscreens
overviewPoliepen.addEventListener('wheel', e => {
  e.preventDefault();
}, { passive: false });

overviewPoliepen.addEventListener('touchmove', e => {
  e.preventDefault();
}, { passive: false });

// functie om in te zoomen
function showCloseupPoliepen() {
  achtergrondCloseup.classList.add("visible");
  achtergrondVissen.style.opacity = "0";
  zoomArea3.classList.add("hidden");
}

// klik op zoomArea3 activeert inzoomen
zoomArea3.addEventListener("click", function () {
  showCloseupPoliepen();
});

// optioneel: controle op touch
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}








