(function () {
  'use strict';

  var registry = window.ERGuideGlobe = window.ERGuideGlobe || {};
  var countries = registry.countries || [];
  var config = registry.earthConfig || {};
  var editConfig = registry.editConfig || {};
  var timings = registry.timings || {};
  var colors = registry.colors || {};

  function GlobeController() {
    this.earth = null;
    this.sprites = [];
    this.photoOverlay = null;
    this.clippedLine = null;
    this.source = 0;
    this.destination = 1;
    this.currentMarker = null;
    this.live = true;
  }

  GlobeController.prototype.init = function () {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.attachEarth.bind(this), { once: true });
      return;
    }

    this.attachEarth();
  };

  GlobeController.prototype.attachEarth = function () {
    if (window.Earth) {
      this.createEarth();
      return;
    }

    window.addEventListener('earthjsload', this.createEarth.bind(this), { once: true });
  };

  GlobeController.prototype.getCountryScale = function (country) {
    return country.scale;
  };

  GlobeController.prototype.setGlobeClass = function (className, enabled) {
    var globeElement = document.getElementById(config.selector);
    if (!globeElement) return;
    globeElement.classList.toggle(className, enabled);
  };

  GlobeController.prototype.createEarth = function () {
    var earthOptions;

    if (!this.live) return;

    earthOptions = {
      location: config.location,
      zoom: config.zoom,
      light: config.light,
      lightColor: config.lightColor,
      lightIntensity: config.lightIntensity,
      lightAmbience: config.lightAmbience,
      mapImage: config.mapImage,
      transparent: config.transparent,
      autoRotate: config.autoRotate,
      autoRotateSpeed: config.autoRotateSpeed,
      autoRotateDelay: config.autoRotateDelay,
      autoRotateStart: config.autoRotateStart,
      draggable: config.draggable,
    };

    if (registry.isEditMode) {
      earthOptions.location = editConfig.location || earthOptions.location;
      earthOptions.zoom = editConfig.zoom || earthOptions.zoom;
      earthOptions.autoRotate = editConfig.autoRotate;
      earthOptions.draggable = editConfig.draggable;
    }

    this.earth = new window.Earth(config.selector, earthOptions);

    this.bindEarthEvents();
  };

  GlobeController.prototype.bindEarthEvents = function () {
    var self = this;

    this.earth.addEventListener('ready', function () {
      if (!self.live) {
        self.destroy();
        return;
      }

      self.setGlobeClass('earth-ready', true);
      self.createOverlay();
      self.createCountryHighlights();
      self.startSequence();
    });

    this.earth.addEventListener('dragstart', function () {
      self.setGlobeClass('earth-dragging', true);
      self.earth.stopAutoRotate();
    });

    this.earth.addEventListener('dragend', function () {
      self.setGlobeClass('earth-dragging', false);
      setTimeout(function () {
        if (self.earth) self.earth.startAutoRotate();
      }, timings.autoRotateResumeDelayMs);
    });

    this.earth.addEventListener('change', function () {
      if (self.currentMarker && !self.earth.autoRotate) {
        if (window.Earth.getAngle(self.earth.location, self.currentMarker.location) > 45) {
          self.closePhoto();
        }
      }
    });
  };

  GlobeController.prototype.createOverlay = function () {
    this.photoOverlay = this.earth.addOverlay({
      content: '<div class="card"><p id="country-name"></p></div>',
      visible: false,
      containerScale: 1,
      depthScale: 0.5,
    });
  };

  GlobeController.prototype.createCountryHighlights = function () {
    var self = this;

    countries.forEach(function (country, index) {
      self.sprites[index] = self.earth.addImage({
        location: country.location,
        image: country.image,
        scale: self.getCountryScale(country),
        offset: 0.01,
        imageResolution: 256,
        align: true,
        opacity: registry.isEditMode ? 1 : 0,
        hotspot: true,
      });
    });
  };

  GlobeController.prototype.startSequence = function () {
    if (registry.isEditMode) return;
    if (this.live) this.shootLine();
  };

  GlobeController.prototype.shootLine = function () {
    var self = this;

    if (!this.earth || !this.live) return;

    var lineConfig = {
      locations: [ countries[this.source].location, countries[this.destination].location ],
      clip: 0,
      offset: -0.3,
      offsetFlow: 2,
      color: colors.neonGreen || '#02e67f',
      width: 0.3,
    };

    function animateLine() {
      self.clippedLine = self.earth.addLine(lineConfig);
      self.clippedLine.animate('clip', 1, {
        loop: false,
        oscillate: false,
        duration: timings.lineDrawMs,
        complete: function () {
          self.pulse(self.destination);
        },
      });
    }

    if (this.clippedLine) {
      this.clippedLine.animate('opacity', 0, {
        loop: false,
        oscillate: false,
        duration: timings.lineFadeMs,
        complete: function () {
          self.clippedLine.remove();
          animateLine();
        },
      });
      return;
    }

    animateLine();
  };

  GlobeController.prototype.pulse = function (index) {
    var self = this;
    var sprite = this.sprites[index];

    if (!sprite) return;

    this.closePhoto();

    sprite.animate('opacity', 1, {
      duration: timings.countryFadeInMs,
      complete: function () {
        self.openPhoto(countries[index]);

        self.source++;
        self.destination = self.source + 1;

        if (self.destination >= self.sprites.length) self.destination = 0;
        if (self.source >= self.sprites.length) {
          self.source = 0;
          self.destination = self.source + 1;
        }

        if (self.live) self.shootLine();

        sprite.animate('opacity', 0, {
          duration: timings.countryVisibleMs,
          complete: function () {}
        });
      },
    });
  };

  GlobeController.prototype.openPhoto = function (country) {
    var label = document.getElementById('country-name');

    if (label) label.innerHTML = country.name;

    if (this.photoOverlay) {
      this.photoOverlay.location = country.location;
      this.photoOverlay.visible = true;
    }

    this.currentMarker = country;
  };

  GlobeController.prototype.closePhoto = function () {
    if (this.photoOverlay) this.photoOverlay.visible = false;
    this.currentMarker = null;
  };

  GlobeController.prototype.destroy = function () {
    this.live = false;

    if (this.earth) {
      this.earth.destroy();
      this.earth = null;
    }
  };

  registry.GlobeController = GlobeController;
})();
