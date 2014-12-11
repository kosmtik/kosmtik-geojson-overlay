L.K.Map.addInitHook(function () {
    this.whenReady(function () {
        var container = L.DomUtil.create('div', 'geojson-overlay-container'),
            title = L.DomUtil.create('h3', '', container),
            pointToLayer = function (feature, latlng) {
                return L.circleMarker(latlng);
            },
            onEachFeature = function (feature, layer) {
                layer.bindPopup(L.K.Util.renderPropertiesTable(feature.properties));
            },
            style = {
                color: '#F89406',
                weight: 3,
            },
            params = {
                active: false,
                data: null
            },
            addGeojson = function () {
                var geojson;
                try {
                    geojson = JSON.parse(params.data);
                } catch (err) {
                    return;
                }
                this.setState('loading');
                this.geojsonOverlay.clearLayers();
                this.geojsonOverlay.addData(geojson);
                L.bind(syncState, this)();
                this.unsetState('loading');
            },
            syncState = function () {
                if (params.active) {
                    this.geojsonOverlay.addTo(this);
                } else {
                    this.removeLayer(this.geojsonOverlay);
                }
                builder.fetchAll();
            },
            toggle = function () {
                params.active = !params.active;
                L.bind(syncState, this)();
            },
            builder = new L.K.FormBuilder(params, [
                ['active', {handler: L.K.Switch, label: 'Active (ctrl+alt+G)'}],
                ['data', {handler: 'Textarea', placeholder: 'Paste your geojson here.'}]
            ], {id: 'geojson-overlay-form'});
        title.innerHTML = 'GeoJSON overlay';
        this.geojsonOverlay = L.geoJson(null, {pointToLayer: pointToLayer, onEachFeature: onEachFeature, style: style});
        builder.on('synced', function (e) {
            if (e.field === 'data') L.bind(addGeojson, this)();
            else if (e.field === 'active') L.bind(syncState, this)();
        }, this);
        container.appendChild(builder.build());
        this.sidebar.addTab({
            label: 'GeoJSON',
            className: 'geojson-overlay',
            content: container,
            callback: function () {builder.helpers.data.input.focus();},
        });
        this.commands.add({
            keyCode: L.K.Keys.G,
            ctrlKey: true,
            altKey: true,
            callback: toggle,
            context: this,
            name: 'GeoJSON overlay: toggle'
        });
        this.commands.add({
            callback: function () {this.sidebar.open('.geojson-overlay');},
            context: this,
            name: 'GeoJSON overlay: configure'
        });
    });
});