(function () {

	function toFixed(input, precision) {
		return (input === undefined) ? '' : input.toFixed(precision);
	}

	function toDeg(input) {
		return (input === undefined) ? '' : input * 180 / Math.PI;
	}

	angular.module('app').filter('toFixed', function () { return toFixed; });
	angular.module('app').filter('toDeg', function () { return toDeg; });

})();