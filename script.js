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
  
  // Voor pinch-to-zoom detectie
  let initialDistance = null;
  
  const originalMap = document.getElementById("original-map");
  const zoomedMap = document.getElementById("zoomed-map");
  
  originalMap.addEventListener("touchstart", function (e) {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialDistance = Math.sqrt(dx * dx + dy * dy);
    }
  }, false);
  
  originalMap.addEventListener("touchmove", function (e) {
    if (e.touches.length === 2 && initialDistance !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
  
      // Als je inzoomt met vingers (afstand neemt toe), activeer de zoom-kaart
      if (currentDistance - initialDistance > 80) { // drempelwaarde
        showZoomedMap();
        initialDistance = null; // reset
      }
    }
  }, false);
  
  originalMap.addEventListener("touchend", function (e) {
    if (e.touches.length < 2) {
      initialDistance = null;
    }
  }, false);
  
  // Toon de ingezoomde kaart, verberg originele
  function showZoomedMap() {
    originalMap.style.display = "none";
    zoomedMap.style.display = "block";
  }
  
  // Foto fullscreen functionaliteit
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
  