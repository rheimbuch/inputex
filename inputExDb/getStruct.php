<?php
$link = mysql_connect("localhost", "root", "root") or die("Unable to connect to mysql: ".mysql_error());
mysql_select_db($_POST['db']) or die("Could not select database: ".mysql_error());
$result = mysql_query("SHOW tables") or die("Query failed: ".mysql_error());
$o = array();
while ($table = mysql_fetch_assoc($result)) {
   $name = $table['Tables_in_'.$_POST['db']];
   $o[$name]= array();
   $r = mysql_query("SHOW fields FROM $name") or die("Query failed: ".mysql_error());
   while ($field = mysql_fetch_assoc($r)) {
      $o[$name][] = $field;
   }
}
echo json_encode($o);
?>