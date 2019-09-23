<?php require_once 'config/config.php'?>

<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8">
	<title>Villes de France</title>
	<link rel="stylesheet" href="css/style.css">
</head>
<body style="text-align: center;">
	<h1>Création d'un fichier texte de toutes les villes de France</h1>

	<?php
	// On crée le fichier 'villes.txt' contenant le nom, le code postal, la latitude et la longitude de chaque ville de France
	try{

		$options = [
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
        	PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
   	 	];

		$dbh = new PDO($DSN .';dbname=' . $DATABASE_NAME .';charset=utf8', $USER, $PASSWORD, $options);

		$req = 'SELECT ville_nom, ville_code_postal, ville_latitude_deg, ville_longitude_deg FROM villes_france_free WHERE ville_code_postal ORDER BY ville_nom_reel';
		$sth = $dbh->query($req);
		$towns = $sth->fetchAll();

		$fp = fopen('ressources/villes.txt', 'w+');
		foreach ($towns as $town) {
			$townFormatted = ucfirst(strtolower($town["ville_nom"])) . '|(' . $town["ville_code_postal"] . ')|' . $town["ville_latitude_deg"] . "|" . $town["ville_longitude_deg"] ."\n";
			fwrite($fp, $townFormatted);

		}
		fclose($fp);
	?>
		<main class="create-file">
			<p> Le fichier 'villes.txt' a correctement été généré.</p>
			<a href="index.php">Retourner à l'accueil</a>
		</main>
	<?php
	}catch (Exception $e){
		echo '<p style="font-size: 1.5em;">Désolé un problème est survenu ... </p>';
		die ("Voici l'erreur obtenue: " . $e->getMessage());
	}
	?>
</body>
</html>