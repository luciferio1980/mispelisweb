<?php
// Permitir solicitudes CORS desde cualquier dominio (por seguridad, puedes especificar tu dominio).
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// Opcional: Configurar Content-Type si es necesario para el navegador.
// Esta parte se manejará en el JavaScript.

// Obtener la URL del parámetro 'url'
$target_url = isset($_GET['url']) ? $_GET['url'] : '';

// Asegurarse de que se ha proporcionado una URL válida
if (empty($target_url) || !filter_var($target_url, FILTER_VALIDATE_URL)) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "URL no válida."]);
    exit();
}

// Configurar los encabezados de la solicitud
$options = array(
    'http' => array(
        'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36\r\n"
    )
);
$context = stream_context_create($options);

// Descargar el contenido de la URL de destino
$content = @file_get_contents($target_url, false, $context);

// Manejar los posibles errores de la solicitud
if ($content === FALSE) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Error al cargar el recurso. Puede que la URL no sea accesible o que esté bloqueada."]);
} else {
    // Si la descarga es exitosa, reenviar el contenido al navegador.
    // Usamos `json_decode` y `json_encode` para asegurarnos de que el JSON de Xtream se maneje correctamente.
    // Para M3U, esto no afectará nada.
    $json_decoded = json_decode($content, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        // Es un JSON válido, lo devolvemos con el encabezado correcto
        header('Content-Type: application/json');
        echo json_encode($json_decoded);
    } else {
        // No es un JSON, lo devolvemos como texto plano (para M3U)
        header('Content-Type: application/x-mpegURL');
        echo $content;
    }
}
?>