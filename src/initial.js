(function () {

	var app = angular.module('app', ['ngFileUpload', 'ui.bootstrap', 'app-templates', 'ui.router']);

	app.config(['$stateProvider', '$urlRouterProvider', config]);

	function config($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise("/");

		$stateProvider
			.state('home', {
				url: '/',
				views: {
					'main': {
						templateUrl: 'views/home.html',
						controller: 'HomeCtrl'
					}
				}
			});

	}




})();