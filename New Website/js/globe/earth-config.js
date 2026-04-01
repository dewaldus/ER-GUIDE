(function () {
  'use strict';

  window.ERGuideGlobe = window.ERGuideGlobe || {};
  var assets = window.ERGuideGlobe.assets || {};

  window.ERGuideGlobe.timings = {
    lineFadeMs: 500,
    lineDrawMs: 2000,
    countryFadeInMs: 1000,
    countryVisibleMs: 5000,
    autoRotateResumeDelayMs: 2500,
  };

  window.ERGuideGlobe.earthConfig = {
    selector: 'myearth',
    location: { lat: -10.6112329, lng: 40.4384161 },
    zoom: 2,
    light: 'simple',
    lightColor: '#d2d2d2',
    lightIntensity: 1,
    lightAmbience: 0.0,
    mapImage: assets.mapImage || 'assets/hologram-map.svg',
    transparent: true,
    autoRotate: true,
    autoRotateSpeed: 0.2,
    autoRotateDelay: 100,
    autoRotateStart: 2000,
    draggable: true,
  };

  window.ERGuideGlobe.editConfig = {
    location: { lat: -4.5, lng: 24 },
    zoom: 0.92,
    autoRotate: false,
    draggable: true,
  };
})();
