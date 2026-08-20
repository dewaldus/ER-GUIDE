(function () {
  'use strict';

  var registry = window.ERGuideGlobe = window.ERGuideGlobe || {};
  var params = new URLSearchParams(window.location.search);
  var requestedMode = params.get('globeMode') || window.localStorage.getItem('erguide-globe-mode') || 'default';

  if (!registry.GlobeController) return;

  registry.mode = requestedMode === 'edit' ? 'edit' : 'default';
  registry.isEditMode = registry.mode === 'edit';
  registry.getMode = function () {
    return registry.mode;
  };
  registry.setMode = function (mode) {
    var nextMode = mode === 'edit' ? 'edit' : 'default';
    var nextUrl = new URL(window.location.href);

    if (nextMode === 'edit') {
      window.localStorage.setItem('erguide-globe-mode', 'edit');
      nextUrl.searchParams.set('globeMode', 'edit');
    } else {
      window.localStorage.removeItem('erguide-globe-mode');
      nextUrl.searchParams.delete('globeMode');
    }

    window.location.href = nextUrl.toString();
  };

  var controller = null;

  function startGlobe() {
    if (controller && controller.earth) return;
    controller = new registry.GlobeController();
    controller.init();
  }

  startGlobe();

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (controller) controller.destroy();
      return;
    }

    startGlobe();
  });
})();
