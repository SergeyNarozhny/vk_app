<!DOCTYPE html>
<html ng-app="vk">
<head>
	<title>VK app</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta http-equiv="X-UA-Compatible" />
	<link rel="stylesheet" href="/test/app/css/bootstrap.min.css">
	<link rel="stylesheet" href="/test/app/css/style.css">
	<script src="/test/app/js/angular.min.js"></script>
	<script src="/test/app/js/angular-ui-router.min.js"></script>
	<script src="/test/app/js/dirPagination.js"></script>
</head>

<body>

	<div id="main_container" class="text-center">
		<div ui-view></div>
	</div>

	<!-- <script src="http://vkontakte.ru/js/api/openapi.js" type="text/javascript"></script> -->
	<script src="/test/app/js/app.js"></script>
	<script src="/test/app/js/services.js"></script>
	<script src="/test/app/js/directives.js"></script>
</body>
</html>