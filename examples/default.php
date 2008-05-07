<?php
   $jsonValue = stripslashes($_POST["value"]);
   //echo $jsonValue."\n";
   $obj = json_decode($jsonValue);
   print_r($obj);
?>