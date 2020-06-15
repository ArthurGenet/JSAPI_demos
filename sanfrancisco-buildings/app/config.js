define([], function () {
  return {
    portalUrl: "http://jsapi.maps.arcgis.com/",
    itemId: "abd5e3c4b173417f8c14f1283dee33c6",
    buildingLayerTitle: "BAG 3D - WGS - BAG 3D",
    heightField: "nr_ground_pts",
    usageField: "Gebruiksdoel",
    yearField: "Bouwjaar",
    timeline: {
      bin: 5,
      minYear: 1900,
      maxYear: 2020
    },
    noDataColor: "white",
    otherColor: "#FFB55A",
    yearClasses: [{
      minYear: 0,
      maxYear: 1899,
      color: "#bd0026",
      label: "<1900"
    }, {
      minYear: 1900,
      maxYear: 1924,
      color: "#f03b20",
      label: "1900 - 1924"
    }, {
      minYear: 1925,
      maxYear: 1949,
      color: "#fd8d3c",
      label: "1925 - 1949"
    }, {
      minYear: 1950,
      maxYear: 1974,
      color: "#feb24c",
      label: "1951 - 1974"
    }, {
      minYear: 1975,
      maxYear: 1999,
      color: "#fed976",
      label: "1975 - 1999"
    }, {
      minYear: 2000,
      maxYear: 2020,
      color: "#ffffb2",
      label: "2000 - 2020"
    }],
    heightVariable: {
      stops: [
        { value: 10, color: "#e0ecf4", label: "< 10m" },
        { value: 70, color: "#8856a7", label: "> 70m" }
      ],
      binSize: 10
    },
    usageValues: [{
      value: "MIPS",
      color: "#FD7F6F",
      label: "Office"
    }, {
      value: "RESIDENT",
      color: "#7EB0D5",
      label: "Residential"
    }, {
      value: "MIXRES",
      color: "#BD7EBE",
      label: "Mixed use"
    }, {
      value: "MIXED",
      color: "#B2E061",
      label: "Mixed use without residential"
    }]
  }
});
