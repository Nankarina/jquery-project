<?php
	header('content-type:text/html;charset=utf-8');
	require "public.php";
	if(isset($_POST['name'])){//获取值
		$name=$_POST['name'];
		$pass=md5($_POST['pass']);
		
	}else{
		exit('非法操作');
	}
	/*$name="zhangsan345";
	$pass=md5(123456);*/
	$query="select * from user where username='$name' and password='$pass'";
	$result=mysql_query($query);
	if(mysql_fetch_array($result)){
		echo true;
		
	}else{
		echo false;
	}
	
?>