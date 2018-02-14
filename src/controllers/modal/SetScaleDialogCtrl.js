(function () {

	angular
		.module('app')
		.controller('SetScaleDialogCtrl', ['$scope', 'scale', '$controller', '$uibModalInstance', Controller]);

	function Controller($scope, scale, $controller, $uibModalInstance) {

		// расширяем контроллер
		$controller('_ModalCtrl', { $scope: $scope, $uibModalInstance: $uibModalInstance });

		$scope.scale = scale;

		$scope.save = function () {
			$uibModalInstance.close($scope.scale);
		}

	}

})();

