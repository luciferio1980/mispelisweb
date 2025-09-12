<?php
// Habilitar CORS para que tu página HTML pueda recibir la respuesta.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/x-mpegURL"); // Opcional, pero ayuda a los navegadores a entender el formato.

// Obtener la URL de la lista M3U del parámetro 'url'
$m3u_url = isset($_GET['url']) ? $_GET['url'] : '';

// Comprobar que la URL es válida antes de intentar cargarla
if (filter_var($m3u_url, FILTER_VALIDATE_URL)) {
    // Usar file_get_contents para descargar el contenido de la URL
    $content = @file_get_contents($m3u_url);
    if ($content !== FALSE) {
        // Si la descarga es exitosa, imprime el contenido
        echo $content;
    } else {
        // En caso de error, muestra un mensaje
        http_response_code(500);
        echo "Error al cargar el contenido de la URL.";
    }
} else {
    // Si la URL no es válida, muestra un mensaje de error
    http_response_code(400);
    echo "URL no válida.";
}
?>