(function () {
  'use strict';

  window.ERGuideGlobe = window.ERGuideGlobe || {};
  var assets = window.ERGuideGlobe.assets || {};

  var countries = [
    { id: 'south-africa', name: 'South Africa', order: 1, lat: -28.347968, lng: 25.235125, assetKey: 'south_africa', assetPath: 'assets/globe/south_africa.svg', scale: 1.9 },
    { id: 'zambia', name: 'Zambia', order: 2, lat: -12.888319, lng: 28.471788, assetKey: 'zambia', assetPath: 'assets/globe/zambia.svg', scale: 1.8 },
    { id: 'south-africa', name: 'South Africa', order: 1, lat: -28.347968, lng: 25.435125, assetKey: 'south_africa', assetPath: 'assets/globe/south_africa.svg', scale: 2 },
    { id: 'uganda', name: 'Uganda', order: 3, lat: 1.23389, lng: 30.49063, assetKey: 'uganda', assetPath: 'assets/globe/uganda.svg', scale: 1.2 },
    { id: 'tanzania', name: 'Tanzania', order: 4, lat: -6.540242, lng: 36.499742, assetKey: 'tanzania', assetPath: 'assets/globe/tanzania.svg', scale: 1.2 },
    { id: 'mauritius', name: 'Mauritius', order: 5, lat: -20.288987, lng: 57.604131, assetKey: 'mauritius', assetPath: 'assets/globe/mauritius.svg', scale: 0.3 },
    { id: 'malawi', name: 'Malawi', order: 6, lat: -11.579902, lng: 35.255198, assetKey: 'malawi', assetPath: 'assets/globe/malawi.svg', scale: 1.2 },
    { id: 'kenya', name: 'Kenya', order: 7, lat: 0.208868, lng: 38.298401, assetKey: 'kenya', assetPath: 'assets/globe/kenya.svg', scale: 1.3 },
    { id: 'ghana', name: 'Ghana', order: 8, lat: 8.64274, lng: -0.162885, assetKey: 'ghana', assetPath: 'assets/globe/ghana.svg', scale: 1.0 },
    { id: 'ethiopia', name: 'Ethiopia', order: 9, lat: 9.320113, lng: 42.56498, assetKey: 'ethiopia', assetPath: 'assets/globe/ethiopia.svg', scale: 1.6 },
    { id: 'democratic-republic-of-the-congo', name: 'Democratic Republic of the Congo', order: 10, lat: -5.2182928, lng: 22.1973187, assetKey: 'congo', assetPath: 'assets/globe/congo.svg', scale: 2 },
    { id: 'namibia', name: 'Namibia', order: 11, lat: -21.965682, lng: 19.53689, assetKey: 'namibia', assetPath: 'assets/globe/namibia.svg', scale: 1.8 },
    { id: 'angola', name: 'Angola', order: 12, lat: -11.38468, lng: 19.137262, assetKey: 'angola', assetPath: 'assets/globe/angola.svg', scale: 2 },
    { id: 'eswatini', name: 'Eswatini', order: 13, lat: -26.60879, lng: 31.487988, assetKey: 'eswatini', assetPath: 'assets/globe/eswatini.svg', scale: 0.7 },
    { id: 'lesotho', name: 'Lesotho', order: 14, lat: -29.64702, lng: 28.255827, assetKey: 'lesotho', assetPath: 'assets/globe/lesotho.svg', scale: 0.3 },
    { id: 'botswana', name: 'Botswana', order: 15, lat: -23.653204, lng: 23.936888, assetKey: 'botswana', assetPath: 'assets/globe/botswana.svg', scale: 1.4 },
    { id: 'nigeria', name: 'Nigeria', order: 16, lat: 8.9999, lng: 9.336075, assetKey: 'nigeria', assetPath: 'assets/globe/nigeria.svg', scale: 1.54 },
    { id: 'mozambique', name: 'Mozambique', order: 17, lat: -18.435608, lng: 36.312983, assetKey: 'mozambique', assetPath: 'assets/globe/mozambique.svg', scale: 2. }
  ];

  window.ERGuideGlobe.countries = countries.map(function (country) {
    return {
      id: country.id,
      name: country.name,
      order: country.order,
      location: { lat: country.lat, lng: country.lng },
      image: assets[country.assetKey] || country.assetPath,
      assetPath: country.assetPath,
      scale: country.scale,
      anchorOffsetLat: 0,
      anchorOffsetLng: 0,
      notes: '',
    };
  });
})();
