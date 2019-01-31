<?php
//连接数据库
	$conn=@mysql_connect('localhost','root','123456');
	if(!$conn){
		die('数据库连接失败'.mysql_error());
	}
	mysql_select_db('meici');
	mysql_query('SET NAMES UTF8');
?>