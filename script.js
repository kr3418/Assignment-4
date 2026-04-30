mapboxgl.accessToken = "pk.eyJ1Ijoia3IzNDE4IiwiYSI6ImNtbnl3Zmx5cjA2cTQycXBtb3JxdXY2YXQifQ.o0QeMLlc__XbEGpIbeWDxQ";

// Initializing the map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-73.96, 40.78],
  zoom: 12,
  minZoom: 10,
  maxZoom: 16,
  bearing: 29,
  pitch: 0,
  maxBounds: [
  [-74.1, 40.68], // southwest
  [-73.85, 40.88] // northeast
]
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
    // Subway Lines 
  map.addSource("subway-lines", {
    type: "geojson",
    data: "subwaylines.geojson"
  });
// Subway Lines Layer
  map.addLayer({
    id: "subway-lines-layer",
    type: "line",
    source: "subway-lines",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
        "line-color": ["concat", "#", ["get", "color"]],
        "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, 1,
            12, 3,
            15, 6],
      "line-opacity": 0.6
    }
  });

//Q line Extension 
  map.addSource("q-extension", {
    type: "geojson",
    data: "q_extension.geojson"
  });
//Q line Extension Layer
  map.addLayer({
    id: "q-extension-layer",
    type: "line",
    source: "q-extension",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
          "line-color": "#FCCC0A",
          "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10, 2,
              12, 5,
              15, 10
          ],
          "line-opacity": 1,
          "line-dasharray": [2, 2]
      }
  });
  //Stations for Q line extension
map.addSource("q-extension-stations", {
  type: "geojson",
  data: "q_extension_stations.geojson"
});

map.addLayer({
  id: "q-extension-stations-layer",
  type: "circle",
  source: "q-extension-stations",
  paint: {
    "circle-radius": 7,
    "circle-color": "#FCCC0A",
    "circle-stroke-color": "#000000",
    "circle-stroke-width": 2
  }
});
// Popup for Q line extension stations
map.on("click", "q-extension-stations-layer", (e) => {
  const station = e.features[0].properties.station_name;
  const population = e.features[0].properties.Population;
  const nearby = e.features[0].properties.Nearby;
  const coords = e.features[0].geometry.coordinates;

  map.flyTo({
    center: coords,
    zoom: 14,
    speed: 0.3
  });

  new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true,
    offset: 20
  })
  // Set the popup content and position
    .setLngLat(coords)
    .setHTML(`
  <div style="
    font-family: Arial, sans-serif;
    padding: 22px 24px;
    background: #ffffff;
    border-top: 8px solid #FCCC0A;
    border-radius: 14px;
    min-width: 280px;
    max-width: 320px;
  ">
    <h3 style="
      margin: 0 0 16px 0;
      font-size: 22px;
      font-weight: 700;
      color: #111;
    ">
      ${station}
    </h3>

    <div style="
      margin-bottom: 14px;
      padding-bottom: 14px;
      border-bottom: 1px solid #ddd;
      font-size: 15px;
      line-height: 1.5;
      color: #333;
    ">
      <strong>Population served:</strong><br>
      ${Number(population).toLocaleString()} people
    </div>

    <div style="
      font-size: 15px;
      line-height: 1.5;
      color: #333;
    ">
      <strong>Nearby places:</strong><br>
      ${nearby}
    </div>
  </div>
`)
    .addTo(map);
  });
});
