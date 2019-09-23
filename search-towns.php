<?php

// On récupére les données envoyées par la requête AJAX et on les filtre 
$data = trim(strip_tags($_REQUEST['town'] ?? ""));
$length = strlen($data);
$resultFound = false;

// On teste si le champ input est vide 
if($data != ''){
	// S'il n'est pas vide, on peut alors lire dans fichier villes.txt que l'on stocke dans $towns
	$file = fopen('ressources/villes.txt', 'r');
	while(!feof($file))
	{
     	$towns[] = fgets($file);
	}

	fclose($file);

	$i=0;
	$townCompletion = [];

	// On parcourt le tableau contenant toutes les villes
	foreach ($towns as $key => $town) {
		$str = substr($town,0, $length);
		$data = ucfirst(strtolower($data));

		// On teste si les données entrées correspondent à une ou plusieurs villes 
		if($str === $data){
			$resultFound = true;
			$townCompletion[] = $town;
			$i++;
			// On limite notre résultats à 10
			if($i === 10){break;}
		}
	}

	// Si au moins une ville correspond alors on peut envoyer le résultat au format JSON
	if($resultFound){
		 echo json_encode($townCompletion);
	}
}
?>