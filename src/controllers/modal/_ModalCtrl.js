(function () {

	angular
		.module('app')
		.controller('_ModalCtrl', ['$scope', '$uibModalInstance', Controller]);

	function Controller($scope, $uibModalInstance) {

		$scope.close = close;
		$scope.cancel = close;

		function close() {
			$uibModalInstance.dismiss();
		}


	}

})();

