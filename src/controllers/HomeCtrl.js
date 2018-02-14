(function () {

	angular.module('app').controller('HomeCtrl',
		['$scope', 'Upload', '$timeout', '$uibModal',
			function ($scope, Upload, $timeout, $uibModal) {


				$scope.upload = function (file) {
					Upload.upload({
						url: 'upload-url',
						data: { file: file }
					})
					//.then(function (resp) { }, function (resp) { }, function (evt) { }).finally(function (a) {})
				};

				
				// modals: 

				$scope.openSetCoordsDialog = function () {
					var modalInstance = $uibModal.open({
						animation: false,
						templateUrl: 'views/modal/setCoordsDialog.html',
						controller: 'SetCoordsDialogCtrl',
						resolve: {
							coords: function () { return $scope.coords; }
						}
					});

					modalInstance.result.then(function (coords) {
						$scope.setCoords = coords;
					});

				}


				$scope.openSetScaleDialog = function () {
					var modalInstance = $uibModal.open({
						animation: false,
						templateUrl: 'views/modal/setScaleDialog.html',
						controller: 'SetScaleDialogCtrl',
						resolve: {
							scale: function () { return $scope.scale; }
						}
					});

					modalInstance.result.then(function (scale) {
						$scope.setScale = scale;
					});

				}

				$scope.openSetAngleDialog = function () {
					var modalInstance = $uibModal.open({
						animation: false,
						templateUrl: 'views/modal/setAngleDialog.html',
						controller: 'SetAngleDialogCtrl',
						resolve: {
							angle: function () { return $scope.angle; }
						}
					});

					modalInstance.result.then(function (angle) {
						$scope.setAngle = angle;
					});

				}				


				


			}]);

})();