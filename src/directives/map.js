(function () {
	'use strict';

	angular.module('app')
		.directive('map', ['$window', '$timeout', leaflet]);


	function leaflet($window, $timeout) {
		return {
			restrict: "E",
			template: '',
			scope: {
				imageSrc: '<',
				coords: '=',
				angle: '=',
				scale: '=',
				setCoords: '<',
				setAngle: '<',
				setScale: '<',
				
			},
			link: function (scope, elem, attrs) {

				var div = angular.element('<div style="height: 100%; width: 100%; display: block;"></div>');
				elem.append(div);

				var mymap = $window.L.map(div[0], {
					center: [55, 37],
					zoom: 8,
					zoomAnimation: true
				});

				$window.L.tileLayer(
					'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
					{
						attribution: 'Map data &copy; <a href="http://osm.org">OpenStreetMap</a> contributors',
						maxZoom: 18,
						detectRetina: false,
						updateWhenZooming: false,
						updateWhenIdle: true,
						reuseTiles: false
					}
				).addTo(mymap);


				scope.$watch('imageSrc', function (imageSrc) {
					if (!imageSrc) { return };

					var image = (new $window.L.AdvancedImageOverlay(imageSrc)).addTo(mymap);

					image.on('update', function (e) {
						$timeout(function () {
							scope.coords = e.point;
							scope.angle = e.angle;
							scope.scale = e.scale;
						});
					});

					(['Scale', 'Angle', 'Coords']).forEach(function (paramName) {
						(function (name) { // closure
							scope.$watch('set' + name, function (value) { if (!value && value !== 0) { return }; image.setParam(name.toLocaleLowerCase(), value); })
						})(paramName);
					});

				});


			}
		}
	}

})();