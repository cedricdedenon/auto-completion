<?php require_once 'config/config.php'?>

<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8">
	<title>Auto-completion</title>
	<link rel="stylesheet" href="css/style.css">
</head>
<body>
	<h1>Auto-completion</h1>
	<?php
	// Si le fichier 'ressources/villes.txt' n'existe pas, il faut le créer. S'il existe, on affiche le formulaire.
	if(!file_exists('ressources/villes.txt')){
	?>
		<div class="create-file"> 
			<p>Le fichier 'villes.txt' n'existe pas, il faut le générer à partir du fichier 'villes_france.sql'.</p>
			<p>Il vous suffit de créer une base de données, et d'y renseigner son nom, ainsi que votre identifiant et votre mot de passe dans le fichier 'config.php'</p>
			<p>Une fois ces renseignements fournis, allez sur <a href="create-town-file.php">cette page</a></p>
		</div>
	<?php
	} else{
	?>
	<p>Veuillez saisir une ville Française</p>
		<form method="POST" action="#">
			<input type="text" id="search" name="search" autocomplete="off"/>
			<div id="results"> </div>
			<div>
				<button type="submit">Valider</button>
				<button type="reset">Effacer</button>
			</div>
		</form>
		<div></div>
	<?php
	}
	?>

	<!-- Contient la map pour l'API -->
	<div id="map"></div>

	<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>

	<script src="js/auto-completion.js"></script>
	<?php
		// On teste si la clé de l'API est égale à null (par défaut) 
		if($API_KEY === null){
	?>
			<script>
				var div = document.getElementById('map');
				var a = document.createElement('a');
				div.innerHTML = 'La clé de l\'API Google Maps n\'est pas fournie. Pour obtenir une clé, rendez-vous ';

				div.style = "height: 10%; width: 100%; padding: 2%; font-size: 1.2em; background-color: rgba(255,0,0,0.5);";
				a.href = 'https://developers.google.com/maps/documentation/javascript/get-api-key';
				a.innerHTML = 'ici';
				div.appendChild(a);
				div.innerHTML += ' et insérer là dans le fichier \'config.php\'';
			</script>
		<?php
		}
		else{
			// Si la clé de l'API n'est pas nulle, on utilisera cette clé.
			// ATTENTION: si la clé n'est pas valide, une erreur s'affichera dans le console du navigateur 
		?>
			<script>
				var div = document.getElementById('map');
				div.style = "height: 450px;";
			</script>
			<script async defer id="geomap" src="https://maps.googleapis.com/maps/api/js?key=<?php 	echo $API_KEY ?>"></script>
		<?php
		}
		?>

</body>
</html>