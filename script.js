let museumsGroup = createClusterGroup();
let shopsGroup = createClusterGroup();

function createTileLayer(url, maxZoom, attribution) {
    return L.tileLayer(url, {
        maxZoom: maxZoom,
        attribution: attribution,
    });
}

let osm = createTileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    18,
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
);

let ortofoto = createTileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    18,
    "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
);

let map = L.map("map", {
    center: [49.8037633, 15.4749126],
    zoom: 7,
    layers: [osm, museumsGroup, shopsGroup],
});

let baseMaps = {
    OSM: osm,
    Ortofoto: ortofoto,
};

let layerControl = L.control.layers(baseMaps, null).addTo(map);

let IconClass = L.Icon.extend({
    options: {
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -5],
    },
});

let museumIcon = new IconClass({ iconUrl: "./img/museum.png" });

let shopIcon = new IconClass({ iconUrl: "./img/shop.png" });

async function getData() {
    let museums = await fetch("./data/museums.json").then((response) =>
        response.json(),
    );

    let shops = await fetch("./data/sellers.json").then((response) =>
        response.json(),
    );

    showData(museums, museumsGroup, museumIcon);
    showData(shops, shopsGroup, shopIcon);

    layerControl.addOverlay(museumsGroup, "Muzea");
    layerControl.addOverlay(shopsGroup, "Prodejci");
}

function showData(items, group, icon) {
    items.forEach((item) => {
        group.addLayer(
            L.marker([item.lat, item.lng], {
                icon: icon,
                title: item.title,
            }).bindPopup(
                "<b>Název:</b> " +
                    item.title +
                    "<br><b>Adresa:</b> " +
                    item.address +
                    "<br><b>Město:</b> " +
                    item.city,
            ),
        );
    });
}

function createClusterGroup() {
    return L.markerClusterGroup({
        maxClusterRadius: 30,
        showCoverageOnHover: false,
    });
}

getData();
