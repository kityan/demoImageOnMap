(function () {

	angular
		.module('app')
		.controller('SetAngleDialogCtrl', ['$scope', 'angle', '$controller', '$uibModalInstance', Controller]);

	function Controller($scope, angle, $controller, $uibModalInstance) {

		// расширяем контроллер
		$controller('_ModalCtrl', { $scope: $scope, $uibModalInstance: $uibModalInstance });

		$scope.angle = angle * (180 / Math.PI);

		$scope.save = function () {
			$uibModalInstance.close($scope.angle);
		}

	}

})();

