// create the module and name it pocSPA
angular.module("pocSPA", ['ngRoute', 'ui.router'])
	// configure our routes
	.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('app', {
				url: '',
				abstract: true,
				cache: false,
				templateUrl: 'views/menu.html',
				controller: 'HomeCtrl'
			})
			.state('app.home', {
				url: '/home',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'views/home.html',
						controller: 'HomeCtrl'
					}
				}
			})
			.state('app.contato', {
				url: '/contato',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'views/contatos.html',
						controller: 'ContatoCtrl'
					}
				}
			})
			.state('app.estabelecimento', {
				url: '/estabelecimento',
				cache: false,
				views: {
					'menuContent': {
						templateUrl: 'views/estabelecimentos.html',
						controller: 'EstabelecimentoCtrl'
					}
				}
			});
		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/home');
	});