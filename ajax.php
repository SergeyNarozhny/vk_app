<?

//+++
function objectToArray($d)
{
	if (is_object($d)) $d = get_object_vars($d);
	if (is_array($d)) return array_map(__FUNCTION__, $d);
	else return $d;
}
$postdata = file_get_contents("php://input");
$post = objectToArray(json_decode($postdata));

if (!empty($post) && $post["method"] == "wall.get")
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "http://api.vk.com/method/wall.get?extended=1&owner_id=".$post["data"]["owner_id"]."&filter=all&count=50".($post["data"]["offset"] ? '&offset='.$post["data"]["offset"] : '')); 
	//curl_setopt($ch, CURLOPT_REFERER, "http://www.russianpost.ru");
	//curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 YaBrowser/15.2.2214.3645 Safari/537.36");
	//curl_setopt($ch, CURLOPT_COOKIE, $cookie);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_TIMEOUT, 3000);
	$output = curl_exec($ch);
	curl_close($ch);
	
	echo $output;
}
elseif (!empty($post) && $post["method"] == "users.get")
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, "http://api.vk.com/method/users.get?uids=".$post["data"]["uids"]); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_TIMEOUT, 3000);
	$output = curl_exec($ch);
	curl_close($ch);
	
	echo $output;
}

?>