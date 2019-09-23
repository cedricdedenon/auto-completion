# Le projet

Le projet consiste à choisir une ville de France dans le champ du formulaire, prévu à cet effet.
Une requête AJAX est effectuée pour aller chercher les noms de villes en fonction de ce que l'utilisateur entre dans le champ de saisie. La gestion des événements (clavier et souris) est prise en compte.



## Gestion des événements et requête AJAX

On récupère le texte entré au clavier sur le champ ville à chaque touche clavier appuyée

Si l'utilisateur entre un caractère, un requête AJAX est effectuée
*	Si la requête reçoit des réponses, on les affiche (10 villes maximum)
*	Sinon rien ne s'affiche

La gestion des événements sont pris en compte lorque les résultats apparaissent
*	Choisir une ville directement par le click de la souris
*	Défiler les résultats avec les touches clavier (flêche du haut et flêche du bas)
*	Choisir une ville en appuyant sur Entrée après un défilement



## Google Maps API

Si l'utilisateur posséde un clé API Google maps, il pourra visualiser où se trouve la ville qu'il a entrée.
Pour obtenir une [clé API](https://developers.google.com/maps/documentation/javascript/get-api-key)
Il faut fournir cette clé dans le fichier **config/config.php** 

> Il faut insérer une clé valide, par défaut la clé API vaut null



## Création du fichier des villes

Par défaut, le fichier **ressources/villes.txt** est fourni. Mais il peut être crée automatiquement.

Pour cela, il faut
*	Créer une base de données et insérer la table fournie dans le fichier **ressources/villes_france.sql** [Télechargement également disponible ici](https://sql.sh/736-base-donnees-villes-francaises)
*	Renseigner la base de données, ainsi que vos identifiant et mot de passe pour la connexion au serveur dans le fichier **config/config.php**
	Par défaut, les bases de données relationnelles MySQL sont utilisées 



## NOTA

Les coordonnées géographique des villes appartenants aux DOM-TOM sont erronées dans les fichiers fournis 'ressources/villes-france.sql' et 'ressources/villes_france.csv'
