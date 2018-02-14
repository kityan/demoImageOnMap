(function () {

	var _ImageOverlay = L.ImageOverlay.extend({
		initialize: function (aio, url, bounds) {
			L.ImageOverlay.prototype.initialize.call(this, url, bounds, { interactive: true });
			this._aio = aio;
		},
		_animateZoom: function (e) {
			var scale = 'scale(' + this._map.getZoomScale(e.zoom) + ')';
			var topLeftFuture = this._map._latLngToNewLayerPoint(this._aio._corners[0], e.zoom, e.center);			
			var translation = this._getTranslateString(topLeftFuture);
			var rotate = 'rotate(' + this._aio._angle + 'rad)';
			this._image.style[L.DomUtil.TRANSFORM] = [translation, rotate, scale].join(' ');			
		},
		onAdd: function (e) {
			L.ImageOverlay.prototype.onAdd.call(this, e);
			var draggable = new L.Draggable(this._image);
			draggable.enable();
			draggable.on('drag', function (e) {
				// preserve rotation				
				var rotate = 'rotate(' + this._aio._angle + 'rad)';
				this._image.style[L.DomUtil.TRANSFORM] += [rotate].join(' ');
			}.bind(this));
			draggable.on('drag dragend', function (e) {
				// get diff and update corners and/or markers
				//var diff = draggable._newPos.subtract(draggable._startPos); // error?
				var diff = draggable._newPos.subtract(this._map.latLngToLayerPoint(this._aio._corners[0])); // error?
				this._aio._imageDragging(diff, e.type == 'dragend')
			}.bind(this));
		},
		_reset: function () {
			if (!this._aio._corners[0]) { return; }
			var map = this._map;
			var topLeft = map.latLngToLayerPoint(this._aio._corners[0]);
			var opposite = map.latLngToLayerPoint(this._aio._corners[2]);
			this._image._leaflet_pos = topLeft;
			var translation = this._getTranslateString(topLeft);
			var rotate = 'rotate(' + this._aio._angle + 'rad)';
			this._image.style[L.DomUtil.TRANSFORM] = [translation, rotate].join(' ');
			// get current diagonal width and update width and height
			var currDiagonal = Math.sqrt(Math.pow(topLeft.y - opposite.y, 2) + Math.pow(topLeft.x - opposite.x, 2));
			var factor = currDiagonal / this._aio._diagonal;
			this._image.width = factor * this._aio._width;
			this._image.height = factor * this._aio._height;
		},
		_getTranslateString: function (point) {
			var is3d = L.Browser.webkit3d,
				open = 'translate' + (is3d ? '3d' : '') + '(',
				close = (is3d ? ',0' : '') + ')';
			return open + point.x + 'px,' + point.y + 'px' + close;
		},
	});


	L.AdvancedImageOverlay = L.LayerGroup.extend({

		setParam: function (name, value) {
			switch (name) {
				case 'angle': this._angle = value * (Math.PI / 180); break;
				case 'coords':
					var map = this._map;
					var c0 = map.latLngToLayerPoint(this._corners[0]);
					var c0new = map.latLngToLayerPoint(value);
					this._imageDragging(c0new.subtract(c0), true);
					break;
				case 'scale': this._userScale = value; break;
			}
			this._updateCorners(true);
			this._fireUpdateEvent();
		},

		initialize: function (url) {
			L.LayerGroup.prototype.initialize.call(this);
			this._url = url;
			this._imageLayer = null;
			this._width = null; // internal image width
			this._height = null; // internal image height
			this._userScale = 1; // proportional image scale made by user
			this._corners = []; // clockwise from lefttop
			this._markers = []; // clockwise from lefttop
			this._c02angle = null; // between corner[0] and corner[2]
			this._initialMeterPerPixel = 1;
			this._diagonal = null; // initial diagonal
			this._angle = 0;
		},

		_init: function (width, height) {
			// place symmetrically, center of the image to center of the map
			var map = this._map;
			var centerPoint = map.latLngToLayerPoint(map.getCenter());

			this._width = width;
			this._height = height;
			this._diagonal = Math.sqrt(Math.pow(this._width, 2) + Math.pow(this._height, 2));
			this._corners[0] = map.layerPointToLatLng(centerPoint.subtract(new L.Point(this._width / 2, this._height / 2)));
			this._corners[1] = map.layerPointToLatLng(centerPoint.add(new L.Point(this._width / 2, 0)).subtract(new L.Point(0, this._height / 2)));
			this._corners[2] = map.layerPointToLatLng(centerPoint.add(new L.Point(this._width / 2, this._height / 2)));
			this._corners[3] = map.layerPointToLatLng(centerPoint.subtract(new L.Point(this._width / 2, 0)).add(new L.Point(0, this._height / 2)));
			this._corners.forEach(function (corner, i) {
				this._markers[i] = new L.Marker(this._corners[i], { draggable: i == 2 }).addTo(map);
				this._markers[i].on('drag dragend', this._onMarkerDrag.bind(this));
			}.bind(this))
			// calculate initial angle
			var c0 = map.latLngToLayerPoint(this._corners[0]);
			var c2 = map.latLngToLayerPoint(this._corners[2]);
			this._c02angle = Math.atan2(c2.y - c0.y, c2.x - c0.x);
			this._imageLayer._reset();
			this._fireUpdateEvent();
		},


		_getMeterPerPixel: function () {
			var map = this._map;
			var y = map.getSize().y, x = map.getSize().x;
			var maxMeters = map.containerPointToLatLng([0, y]).distanceTo(map.containerPointToLatLng([x, y]));
			var MeterPerPixel = maxMeters / x;
			return MeterPerPixel;
		},

		onAdd: function (map) {
			// for manipulating on different zooms?
			this._initialMeterPerPixel = this._getMeterPerPixel();

			// preload image to find out its dimensions
			var center = map.getCenter();
			this._imageLayer = new _ImageOverlay(this, this._url, [center, center]).addTo(map);

			this._imageLayer.on('load', function (e) {
				this._init(e.target._image.naturalWidth, e.target._image.naturalHeight);
				//imageLayer.removeFrom(map);				
			}.bind(this));
		},

		_fireUpdateEvent: function () {
			this.fire('update', {
				point: this._corners[0],
				angle: this._angle,
				scale: this._userScale
			});
		},

		_imageDragging: function (diff, updateCorners) {
			var map = this._map;
			for (var i = 0; i < 4; i++) {
				if (updateCorners) {
					this._corners[i] = map.layerPointToLatLng(map.latLngToLayerPoint(this._corners[i]).add(diff));
					this._markers[i].setLatLng(this._corners[i]);
				} else {
					this._markers[i].setLatLng(map.layerPointToLatLng(map.latLngToLayerPoint(this._corners[i]).add(diff)));
				}
				if (updateCorners) {
					this._updateImage();
					this._fireUpdateEvent();
				}
			}
		},



		_updateCorners: function (updateC2) {
			var map = this._map;
			var c0 = map.latLngToLayerPoint(this._corners[0]);
			var zoomScaled = this._initialMeterPerPixel / this._getMeterPerPixel();
			var ratio = this._height / this._width;
			var c3new = new L.Point(
				c0.x + Math.cos(this._angle + Math.PI / 2) * this._width * zoomScaled * this._userScale * ratio,
				c0.y + Math.sin(this._angle + Math.PI / 2) * this._height * zoomScaled * this._userScale
			);
			var c1new = new L.Point(
				c0.x + Math.cos(this._angle) * this._width * zoomScaled * this._userScale,
				c0.y + Math.sin(this._angle) * this._height * zoomScaled * this._userScale / ratio
			);
			this._corners[3] = map.layerPointToLatLng(c3new);
			this._corners[1] = map.layerPointToLatLng(c1new);

			var c2new = new L.Point(
				c0.x + Math.cos(this._angle + this._c02angle) * this._diagonal * zoomScaled * this._userScale,
				c0.y + Math.sin(this._angle + this._c02angle) * this._diagonal * zoomScaled * this._userScale
			);

			if (updateC2) { // on dragend marker				
				this._corners[2] = map.layerPointToLatLng(c2new);
			}

			this._updateMarkers();
		},

		_updateMarkers: function (dontUpdateImage) {
			for (var i = 0; i < 4; i++) {
				this._markers[i].setLatLng(this._corners[i]);
			}
			this._updateImage();
		},

		_updateImage: function () {
			this._imageLayer._reset();
		},

		_onMarkerDrag: function (e) {
			var map = e.target._map;

			// calculate angle
			var c0 = map.latLngToLayerPoint(this._corners[0]);
			var coords = e.latlng || e.target.getLatLng();
			var c2new = map.latLngToLayerPoint(coords);
			var angle = Math.atan2(c2new.y - c0.y, c2new.x - c0.x);
			angle -= this._c02angle;
			this._corners[2] = coords;
			this._angle = angle;

			// calculate scale
			var zoomScaled = this._initialMeterPerPixel / this._getMeterPerPixel();
			var initialDiagonalZoomScaled = this._diagonal * zoomScaled;
			var currentDiagonal = Math.sqrt(Math.pow(c2new.y - c0.y, 2) + Math.pow(c2new.x - c0.x, 2));
			this._userScale = currentDiagonal / initialDiagonalZoomScaled;

			this._updateCorners(e.type == 'dragend');
			this._fireUpdateEvent();
		}

	});


})();