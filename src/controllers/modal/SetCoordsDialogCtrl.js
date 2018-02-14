(function () {

	angular
		.module('app')
		.controller('SetCoordsDialogCtrl', ['$scope', 'coords', '$controller', '$uibModalInstance', Controller]);

	function Controller($scope, coords, $controller, $uibModalInstance) {

		// расширяем контроллер
		$controller('_ModalCtrl', { $scope: $scope, $uibModalInstance: $uibModalInstance });

		$scope.coords = coords;

		$scope.save = function () {
			$uibModalInstance.close($scope.coords);
		}

	}

})();

