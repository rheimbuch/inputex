<?php



// Connexion et sélection de la base
$link = mysql_connect("localhost", "root", "root") or die("Impossible de se connecter");
//echo "Connexion réussie";
mysql_select_db("clicrdv") or die("Could not select database");

// Exécuter des requêtes SQL
$query = "SHOW fields FROM ".$_POST['table'];
$result = mysql_query($query) or die("Query failed");

$o = array();

while ($line = mysql_fetch_assoc($result)) {
   $o[] = $line;  
}


echo json_encode($o);

?>