angular.module("vk").directive('popupGallery', function(){
	var linker = function($scope, elm, attrs)
	{
        elm
            .on("click", function(e){

                e.stopPropagation();
                if (~e.target.id.indexOf("popup_overlay"))
        		{
        			$scope.toggleModal();
        			$scope.$digest();
        		}
            })
            .on("$destroy", function(){
            	angular.element(window).off("keyup", $scope.escapeEvent);
            });

        angular.element(window).on("keyup", $scope.escapeEvent);
	}

	var controller = function($scope)
	{
        $scope.toggleModal = function()
		{
            $scope.modal.flag = !$scope.modal.flag;
        }
		$scope.escapeEvent = function(e)
		{
            if (e.which == 27)
        	{
        		$scope.toggleModal();
        		$scope.$digest();
        	}
        }
        $scope.goRight = function()
        {
    		//early return technique
    		if ($scope.modal.parent == $scope.modal.parentMax
    			&& $scope.modal.index == $scope.modal.parentMaxIndex) return;

        	if ($scope.modal.index != 4) $scope.modal.index++;
    		else
    		{
    			$scope.modal.index = 0;
    			$scope.modal.parent++;
    		}
        }
        $scope.goLeft = function()
        {
    		//early return technique
        	if ($scope.modal.parent == 0 && $scope.modal.index == 0) return;

        	if ($scope.modal.index != 0) $scope.modal.index--;
    		else
    		{
    			$scope.modal.index = 4;
    			$scope.modal.parent--;
    		}
        }

	}

	return {
		restrict: "E",
		scope: {
			activeImg: "=",
			modal: "="
	    },
		templateUrl: '/test/app/templates/modal-template.html',
		link: linker,
		controller: controller
	}
});