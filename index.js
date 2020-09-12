class GeoJsonOverlay {
    constructor(config) {
        config.addJS('/node_modules/kosmtik-geojson-overlay/front.js');
    }
}

exports = module.exports = { Plugin: GeoJsonOverlay }
