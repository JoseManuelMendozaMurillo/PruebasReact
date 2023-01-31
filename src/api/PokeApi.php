<?php
$namePokemon = empty($_POST["namePokemon"]) ? "" : $_POST["namePokemon"];
$urlSearch = "https://pokeapi.co/api/v2/pokemon/" . $namePokemon;


/**
 * facade
 * 
 * @param string $urlSearch 
 * @return array
 */
function facade(String $urlSearch):array{
    // Función que servira como fachada para conectarnos a la PokeApi

    // Inicializamos y configuramos curl
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $urlSearch);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Ejecutamos la consulta a la poke api
    $response = curl_exec($ch);

    // Cerramos la sesión
    curl_close($ch);
}

// Inicializamos curl y los configuramos para hacer la petición
$ch = curl_init();


