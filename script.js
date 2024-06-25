let map = L.map("map", {
    center: [49.8037633, 15.4749126],
    zoom: 7,
});

let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

let ortofoto = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 19,
        attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
);

osm.addTo(map);

let museumIcon = L.icon({
    iconUrl: "./img/museum.png",

    iconSize: [30, 30],
    iconAnchor: [25, 25],
});

let shopIcon = L.icon({
    iconUrl: "./img/shop.png",
    iconSize: [30, 30],
    iconAnchor: [25, 25],
});

async function getData() {
    let museums = await fetch("./data/museums.json").then((response) =>
        response.json(),
    );

    let shops = await fetch("./data/sellers.json").then((response) =>
        response.json(),
    );

    showData(museums, shops);
}

function showData(museums, shops) {
    let dataGroup = L.markerClusterGroup({
        maxClusterRadius: 30,
        iconCreateFunction: function (cluster) {
            return L.divIcon({
                html: "<p>" + cluster.getChildCount() + "</p>",
                className: "group-icon",
                iconSize: L.point(30, 30),
            });
        },
        showCoverageOnHover: false,
    });
    museums.forEach((museum) => {
        dataGroup.addLayer(
            L.marker([museum.lat, museum.lng], { icon: museumIcon }),
        );
    });

    shops.forEach((shop) => {
        dataGroup.addLayer(L.marker([shop.lat, shop.lng], { icon: shopIcon }));
    });

    map.addLayer(dataGroup);
}

getData();
