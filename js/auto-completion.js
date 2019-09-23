/*
	Fichier: auto-completion.js
	Description: effectue une auto-completion (requête AJAX) et utilise l'API Google Maps
	Auteur: Cédric Dedenon
	Date de création: 23/10/2018
	Version: 1.1.0 (modifié le 23/09/2019)
*/

$(function(){

	/* *************************
	*  Variables globales
	***************************/
	$villes = [];			// Stocke les résultats de la requête ajax
	$isFirst = true;		// Premier résultat de la requête
	$requestBusy = false;	// Si une requête est déjà en cours, on n'en relance pas d'autre(s) 


	/**
	 * initMap(): crée une Google Maps et affiche un marqueur en fonction de la latitude et de longitude
	 * @param String - name (nom de la ville)
	 * @param float - latitude
	 * @param float - longitude
	 * @return void
	 */
	function initMap(name, latitude, longitude) {
		var villeChoisie = {lat: latitude, lng: longitude};
		var map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: villeChoisie});
		var marker = new google.maps.Marker({position: villeChoisie, map: map, label: name });
	}


	// On donne le focus au champ du formulaire par défaut
	$('#search').focus();


	/* *************************
	* 	Gestion des évenéments 
	***************************/
	/*
	*	On récupère le texte entré au clavier sur le champ ville à chaque touche clavier appuyée
	*	Si l'utilisateur entre un caractère, une requête AJAX est effectuée
	*/
	$('#search').on('keyup', function(e){
		e.preventDefault();

		// On stocke dans des variables la premiere ville, la derniere ville et ville pré-séléctionnée des résultats
		$firstResult = $('.res:first-child');
		$lastResult = $('.res:last-child');
		$resSelected = $('.result_focus');

		switch (e.key){
			case 'ArrowUp':
				// On teste si la touche appuyée est la flêche du haut
				// On fait en sorte de ne pas aller plus haut que la première ville
				// Pour la ville sélectionnée, on lui rajoute une classe pour la distinguer 
				if($($resSelected).html() != $firstResult.html() ){
					$('.res').removeClass('result_focus');
					$($resSelected).prev().addClass('result_focus');
				}
				break;

			case 'ArrowDown':
				// Sinon, on teste si la touche appuyée est la flêche du bas
				// On fait en sorte de ne pas aller plus bas que la dernière ville	
				if($isFirst === true)
					$('.res:first-child').addClass('result_focus');
				else{		
					if($($resSelected).html() != $lastResult.html() ){
						$('.res').removeClass('result_focus');
						$($resSelected).next().addClass('result_focus');
					}
				}
				$isFirst = false;
				break;

			case 'Enter':
				// On teste si la touche appuyée est la touche entrée
				// On affiche la ville sélectionnée dans le champ input
				$e = $('.result_focus').html();
				if($e != ''){
					$('#search').val($e);
					$('#results').html('');
					$cityFound = true;
				}
				break;

			case 'Shift':
				break;

			default:
				// On peut lancer une requête ajax si aucune autre requête n'est en cours
				if(!$requestBusy){
					$requestBusy = true;
					$cityFound = false;
					
					// On récupére le(s) caractère(s) que l'utilisateur a entré(s) 
					$townUser = $('#search').val();
					$town = { town: $townUser }
					$afficher = '';

					$.ajax({
						method: 'GET',
						url: 'search-towns.php',
						data: $town,
						success: function(response){
							$isFirst = true;
							// On teste si la requete renvoie au moins une ville
							if(response.length > 1){
							    // On n'oublie pas de parser notre objet au format JSON 
								$JSONResponse = JSON.parse(response);
								for ($town in $JSONResponse)
								{
									// On parcourt le tableau, et pour chaque ville on l'insére dans une balise div
									$JSONResponseSplit = $JSONResponse[$town].split('|');
									$afficher += `<div class="res">${$JSONResponseSplit[0]} ${$JSONResponseSplit[1]}</div>`;

									//On stocke les 5 villes dans un tableau d'objects
									$villes.push({
										name: $JSONResponseSplit[0],
										zipcode: $JSONResponseSplit[1],
										latitude: $JSONResponseSplit[2],
										longitude: $JSONResponseSplit[3]
									});
								}

								// On affiche les villes
								$('#results').html($afficher);
							}
							else{
						 		// Si aucune ville n'a été trouvé, on n'affiche rien
							 	$('#results').html('');
							}
							$requestBusy = false;
						},
						error: function(err){
							console.log("Erreur :" + err);
							$requestBusy = false;
						}
					});
				}
				break;
		}
	});


	/*
	*	Affiche dans le champ input le résultat sélectionné par la souris
	*/
	$('#results').on('click', function(e){
		$('#search').val(e.target.innerHTML);
		$('.res').remove();
		$cityFound = true;
	});


	/* 
	*	Si on clique n'importe ou dans la fenêtre (sauf dans les résultats) alors on efface tous les résultats affichés
	*/
	$(window).on('click', function(){
		$('#results').html('');
	});


	/*
	*	Si on déplace la souris, la ville pre-sélectionnée par les touches clavier sera effacé
	*/
	$(window).on('mousemove', function(){
		$('.res').removeClass('result_focus');
	});
	
	
	/*
	*	On désactive la soumission du formulaire par la touche entrée
	*/
	$('input').on('keypress', function(e) { 
		return e.key != 'Enter'; 
	});


	/*
	*	Lors du reset, on retire le message et on donne le focus sur le champ d'entrée
	*/
	$('button[type="reset"').on('click', function(){
		$('#search').focus();
		$('form+div').hide();
	});


	/*
	*	Lors de la validation de la ville, on affiche un message avec la ville sélectionnée
	*	Si la ville est correcte, on effectue une requête sur l'API Google Maps
	*/
	$('form').on('submit', function(e){
		e.preventDefault();
		$city = $('#search').val();
		
		if($city != '' && $cityFound){
			$('form+div').html('Vous avez choisi: <strong>' +$city + '</strong>').css('backgroundColor','lightgreen').show();

			$villes.forEach(function(value, index){
				$v = value.name + ' ' + value.zipcode;
				if($v === $city)
				{
					$src = $('#geomap').attr('src');
					if($src != null){
						$latitude = parseFloat(value.latitude);
						$longitude = parseFloat(value.longitude);
						initMap(value.name,$latitude, $longitude);
					}
				}
			});
		}
		else
			$('form+div').html('<strong>ERREUR:</strong> veuillez entrer une ville figurant sur la liste').css('backgroundColor','rgba(255,0,0,0.5)').show();
		
		$length = $villes.length;
		for($i=0; $i<$length; $i++)
			$villes.pop();
		$('#search').val('').focus();
	});
});