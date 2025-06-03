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

    document.querySelector('.kaart-toelichting').innerHTML =
      'De grootste en bekendste is het <strong>Great Barrier Reef</strong> in Australië: een keten van bijna <strong>3.000 afzonderlijke riffen</strong>, die zich uitstrekt over 2.300 kilometer langs de noordoostkust van Queensland. Het is het grootste koraalrif ter wereld en staat sinds 1981 op de Werelderfgoedlijst van <strong>UNESCO</strong>.';
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

// Swipe omlaag op .panel.bottom → scroll naar .panel.top in section.start
document.addEventListener("DOMContentLoaded", () => {
    const startSection = document.querySelector("section.start");
    if (!startSection) return;

    const startBottomPanel = startSection.querySelector(".panel.bottom");
    const startTopPanel = startSection.querySelector(".panel.top");

    if (!startBottomPanel || !startTopPanel) return;

    // Blokkeer omlaag scroll met muis of horizontale scroll
    startBottomPanel.addEventListener("wheel", function (e) {
        const goingUp = e.deltaY > 0;
        const horizontalScroll = e.deltaX !== 0;
        if (goingUp || horizontalScroll) {
            e.preventDefault();
        }
    }, { passive: false });

    // Swipe naar boven (dus vinger omlaag) detecteren
    let touchStartY = 0;

    startBottomPanel.addEventListener("touchstart", function (e) {
        if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
        }
    });

    startBottomPanel.addEventListener("touchend", function (e) {
        if (e.changedTouches.length === 1) {
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchEndY - touchStartY;

            if (deltaY > 50) {
                // Swipe omlaag → scroll naar boven
                startTopPanel.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    });

    // Blokkeer pijltjestoetsen omlaag
    startBottomPanel.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
            e.preventDefault();
        }
    });
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

// 👉 Verwijder deze oude click-handler als je deze hebt:
// document.getElementById("zoom-area-2").addEventListener("click", () => { ... });

// ✅ Nieuw gedrag voor zoom-area-2
const zoomArea2 = document.getElementById("zoom-area-2");

if (zoomArea2) {
    let initialDistance2 = null;

    // Touch: detecteer pinch-zoom
    zoomArea2.addEventListener("touchstart", function (e) {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            initialDistance2 = Math.sqrt(dx * dx + dy * dy);
        }
    }, false);

    zoomArea2.addEventListener("touchmove", function (e) {
        if (e.touches.length === 2 && initialDistance2 !== null) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);

            if (currentDistance - initialDistance2 > 80) {
                window.location.href = "deel2.html"; // ✅ Ga naar nieuwe pagina
                initialDistance2 = null;
            }
        }
    }, false);

    zoomArea2.addEventListener("touchend", function (e) {
        if (e.touches.length < 2) {
            initialDistance2 = null;
        }
    }, false);

    // Click voor desktop
    zoomArea2.addEventListener("click", function () {
        if (!isTouchDevice()) {
            window.location.href = "deel2.html"; // ✅ Ga naar nieuwe pagina
        }
    });
}



// Elementselecties
const zoomArea3 = document.getElementById("zoom-area-3");
const zoomArea4 = document.getElementById("zoom-area-4");
const zoomArea5 = document.getElementById("zoom-area-5");

const achtergrondVissen = document.querySelector(".achtergrond-vissen-2");
const closeupPoliepen = document.querySelector(".closeup-poliepen");
const closeupWit = document.querySelector(".closeup-wit");
const closeupKleur = document.querySelector(".closeup-kleur");

const tekstBottom2 = document.querySelector(".tekst-bottom-2");
const tekstBottom3 = document.querySelector(".tekst-bottom-3");
const tekstBottom4 = document.querySelector(".tekst-bottom-4");
const tekstBottom5 = document.querySelector(".tekst-bottom-5");

const overviewPoliepen2 = document.querySelector(".overview-poliepen-2");

let isKleurZichtbaar = false;
let tekstGewisseld = false;

// Zoom van overview naar close-up
function showCloseupPoliepen() {
  zoomArea3.classList.add("deactivated");

  // Bereken middenpunten van zoom-area en afbeelding
  const zoomRect = zoomArea3.getBoundingClientRect();
  const imgRect = achtergrondVissen.getBoundingClientRect();

  const zoomCenterX = zoomRect.left + zoomRect.width / 2;
  const zoomCenterY = zoomRect.top + zoomRect.height / 2;
  const imgCenterX = imgRect.left + imgRect.width / 2;
  const imgCenterY = imgRect.top + imgRect.height / 2;

  // Offset berekenen
  const offsetX = zoomCenterX - imgCenterX;
  const offsetY = zoomCenterY - imgCenterY;

  const scale = 2.4;
  const translateX = -offsetX * (scale - 1);
  const translateY = -offsetY * (scale - 1);

  achtergrondVissen.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  achtergrondVissen.style.transformOrigin = "center center";

  // Fade-in closeup en fade-out overview
  setTimeout(() => {
    closeupPoliepen.classList.add("visible");
    achtergrondVissen.style.opacity = "0";
    tekstBottom2.classList.add("hidden");
  }, 500);
}

// Klik op zoom-area-3 → zoom-in
zoomArea3.addEventListener("click", showCloseupPoliepen);

// Klik op zoom-area-4 → toggle closeup kleur en tekstwissel
zoomArea4.addEventListener("click", () => {
  isKleurZichtbaar = !isKleurZichtbaar;

  if (isKleurZichtbaar) {
    closeupKleur.classList.add("visible");
    closeupWit.style.opacity = "0";
  } else {
    closeupKleur.classList.remove("visible");
    closeupWit.style.opacity = "1";
  }

  if (!tekstGewisseld) {
    tekstBottom3.classList.add("hidden");
    tekstBottom4.classList.add("visible");
    tekstGewisseld = true;
  }
});

// Klik op zoom-area-5 → terug naar overview-poliepen-2
zoomArea5.addEventListener("click", () => {
  // Verberg close-up
  closeupPoliepen.classList.remove("visible");

  // Reset zoom en opacity
  achtergrondVissen.style.opacity = "1";
  achtergrondVissen.style.transform = "none";

  // Reset afbeeldingen en tekst
  closeupKleur.classList.remove("visible");
  closeupWit.style.opacity = "1";
  isKleurZichtbaar = false;
  tekstGewisseld = false;

  tekstBottom2.classList.add("hidden");
  tekstBottom3.classList.add("hidden");
  tekstBottom4.classList.remove("visible");

  // Toon nieuwe overview
  overviewPoliepen2.classList.add("visible");
  tekstBottom5.classList.add("visible");
});

const top1 = document.querySelector('.top1');

// Scroll van .overview-poliepen-2 naar .top1 als je  scrollt
overviewPoliepen2.addEventListener('wheel', (e) => {
  if (e.deltaY < 0) {
    e.preventDefault();
    top1.scrollIntoView({ behavior: 'smooth' });
  }
}, { passive: false });

let touchStartY = 0;
let touchEndY = 0;

overviewPoliepen2.addEventListener('touchstart', (e) => {
  touchStartY = e.changedTouches[0].screenY;
});

overviewPoliepen2.addEventListener('touchend', (e) => {
  touchEndY = e.changedTouches[0].screenY;
  const swipeDown = touchEndY - touchStartY > 50;

  if (swipeDown) {
    top1.scrollIntoView({ behavior: 'smooth' });
  }
});
