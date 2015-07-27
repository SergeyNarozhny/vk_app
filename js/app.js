/*VK.init({
	apiId: 5008136
});*/

var app = angular.module("vk", ['ui.router', 'angularUtils.directives.dirPagination']);
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/");
	$stateProvider
		.state('user', {
			url: "/:code?{p:int}&{s:string}",
			templateUrl: "/test/app/templates/user-photos.html",
			controller: 'VkCtrl',
			resolve: {
				userData: ['vkData', '$q', '$stateParams', function(vkData, $q, $stateParams){
					var q = $q.defer(), offset;

					if ($stateParams.code)
					{
						offset = (+$stateParams.p - 1) * 50;

						vkData.user($stateParams.code, offset, $stateParams.s)
							.then(function(totalData){
								//resolve any data, including VK errors
								q.resolve(totalData);
							});
					}
					else q.resolve(false);

					return q.promise;
				}]
			}
		});
}]);

app.controller("VkCtrl", ['$scope', 'vkData', '$state', 'userData', function($scope, vkData, $state, userData){

	$scope.error = {};
	$scope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error){
		$scope.error.msg = error.error_msg || error.msg;
	});
	$scope.modal = { flag: false };

	//console.log("userData:", userData);

	if (userData.data && userData.data.length)
	{
		$scope.allWall = userData.data;
		$scope.user = $state.params.code;
		$scope.currentPage = $state.params.p || 1;
		$scope.totalItems = Math.floor(+userData.count / 5); //for proper pag calculation
		$scope.modal.parentMax = userData.data.length - 1;
	}
	else if (userData.error)
	{
		//error, thrown up by resolve error's check
		$scope.error.msg = userData.error.error_msg || userData.error.msg;
	}
	else $scope.hideWall = true;
	//otherwise if userData is false -> no code param is entered
	//turn off the pagination


	$scope.findWall = function(user)
	{
		$state.go('user', { code: user, p: 1 });
	}
	$scope.pageChanged = function(pageNo)
	{
		$state.go('user', { code: $state.params.code, p: pageNo });
	}
	$scope.openPopup = function(index, parent)
	{
		$scope.activeImg = $scope.allWall[parent][index];
		$scope.modal.parent = parent;
		$scope.modal.index = index;
		$scope.modal.parentMaxIndex = $scope.allWall[$scope.allWall.length - 1].length - 1; //last index of last array
		$scope.modal.flag = true;
	}
	
	//using two-way data binding between controller and directive
	//defined inside directive as modal: "="
	$scope.$watch("modal", function(vnew, vold){
		if (angular.isNumber(vnew.parent) && angular.isNumber(vnew.index))
		{
			$scope.activeImg = $scope.allWall[vnew.parent][vnew.index];
		}			
	}, true);

}]);