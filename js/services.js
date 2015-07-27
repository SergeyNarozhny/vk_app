angular.module("vk").factory('vkData', ['$q', '$http', function($q, $http){

	//vk public page example
	var starNumber = -37512548;
	var checkNick = function(str)
	{
		var check = (Number(str.toString().replace(/id/ig,''))).toString();
		return check === "NaN";
	}
	var errorFn = function(err)
	{
		return { error : { code : err.error_code, msg : err.error_msg }};
	}
	var compare = function(prop)
	{
		return function sort(a, b)
		{
			if (a[prop] > b[prop])
				return -1;
			if (a[prop] < b[prop])
				return 1;
			
			return 0;
		}
	}
	var prepareAttaches = function(arr, count, sort)
	{
		var i = 0, len = arr.length, tmp = [];

		for (i; i < len; i++)
		{
			var obj = {
				id : arr[i].id,
				date : (new Date(+arr[i].date * 1000)).toLocaleString(),
				likes : arr[i].likes.count,
				comments : arr[i].comments.count,
			};

			if (arr[i].attachments && arr[i].attachments.length)
			{
				var attlen = arr[i].attachments.length;

				for (var z = 0; z < attlen; z++)
				{
					if (arr[i].attachments[z].type == "photo")
					{
						var photoBig = arr[i].attachments[z].photo.src_xxxbig
										|| arr[i].attachments[z].photo.src_xxbig
										|| arr[i].attachments[z].photo.src_xbig
										|| arr[i].attachments[z].photo.src_big;
						obj.photosBig = photoBig;

						var photoSmall = arr[i].attachments[z].photo.src
										|| arr[i].attachments[z].photo.src_small;
						obj.photosSmall = photoSmall;
					}
				}

				//only if photos are found - pushing inside if check
				// && it is trully photos (not other types of attachment) - checking property
				if (obj.photosSmall) tmp.push(obj);
			}
		}

		//here sort is possible
		if (sort == "likes" || sort == "comments")
		{
			tmp.sort(compare(sort));
		}

		//prepare chunks % 5
		if (tmp.length)
		{
			var result = [], y = 0, rlen = tmp.length, chunk = 5;
			for (y; y < rlen; y += chunk)
			{
			    result.push(tmp.slice(y, y + chunk));
			}

			return { data: result, count: count };
		}
		else
		{
			return { error: { msg : "This page has no photos." } };
		}
		
		//old stuff
		//return { data: tmp, count: count };
	}

	var apiCall = function(method, data)
	{
		var q = $q.defer();
/*
		//somehow early monday morning VK openapi js cease to respond!
		VK.Api.call(method, data, function(r){
			if (r.response) q.resolve(r.response);
			else if (r.error) q.reject(r.error);
		});
*/
		$http.post("/test/app/ajax.php", { method: method, data: data })
			.success(function(r, status, headers, config){
				if (r.error) q.reject(r.error);					
				else if (r.response) q.resolve(r.response);
			})
			.error(function(e, status, headers, config){
				console.log("e:", e);
				q.reject(e);
			});

		return q.promise;
	}
	var wallCall = function(codeName, offset)
	{
		// unfortunately, count maximum - is 100 items
		// it limits the pagination in total
		var sendData = {
			extended: 1,
			filter: 'all',
			count: 50,
			offset: offset || 0
		};
		if (checkNick(codeName))
		{
			return apiCall('users.get', { uids: codeName })
				.then(function(userData){

					//if no errors, userId is always in [0].uid
					sendData.owner_id = userData[0].uid;

					return apiCall('wall.get', sendData)
						.then(function(res){
							return res.wall;
						}, errorFn);

				}, errorFn);
		}
		else
		{
			sendData.owner_id = codeName;

			return apiCall('wall.get', sendData)
				.then(function(res){
					return res.wall;
				}, errorFn);
		}
	}

	var totalCollect = function(user, offset, sort)
	{
		var modified = (!!user && user != "star") ?
						user
						:
						(user == "star" ?
							starNumber
							:
							null);

		return wallCall(modified, offset).then(function(res){
			if (res[0])
			{
				//if the wall is not empty and without internal errors
				return prepareAttaches(res.slice(1), res.slice(0,1).join(""), sort);
			}
			else if (res.error)
			{
				//returning an error from resolve
				return res;
			}
			else if (!res[0])
			{
				// wall is empty, some kind of error also
				return { error: { msg : "Wall is empty." } };
			}
		});
	}

	return {
		user : totalCollect
	}
}]);