class GeoJsonOverlay {
    constructor(config) {
        config.addJS('/node_modules/kosmtik-geojson-overlay/front.js');
    }
}

exports = { Plugin: plugin }
