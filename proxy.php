<?php
// Permitir solicitudes CORS desde cualquier dominio.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// Obtener la URL del parámetro 'url'
$target_url = isset($_GET['url']) ? $_GET['url'] : '';

// Asegurarse de que se ha proporcionado una URL válida
if (empty($target_url) || !filter_var($target_url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(["error" => "URL no válida."]);
    exit();
}

// Configurar un agente de usuario para evitar bloqueos
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
    http_response_code(500);
    echo json_encode(["error" => "Error al cargar el recurso. La URL puede estar caída."]);
    exit();
}

// Limpiar el contenido de caracteres invisibles o espacios en blanco.
$content = trim($content);

// Intentar decodificar el JSON.
$json_decoded = json_decode($content, true);

if (json_last_error() === JSON_ERROR_NONE) {
    // Es un JSON válido, lo devolvemos con el encabezado correcto
    header('Content-Type: application/json');
    echo json_encode($json_decoded);
} elseif (strpos($content, '#EXTINF') === 0 || strpos($content, '#EXTM3U') === 0) {
    // No es JSON, pero parece ser una lista M3U.
    header('Content-Type: application/x-mpegURL');
    echo $content;
} else {
    // Si no es ni JSON ni M3U, es un error inesperado.
    http_response_code(500);
    echo json_encode(["error" => "Respuesta inesperada del servidor. Contenido no reconocido."]);
}
?>