<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$target_url = isset($_GET['url']) ? $_GET['url'] : '';

if (empty($target_url) || !filter_var($target_url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(["error" => "URL no válida."]);
    exit();
}

$options = array(
    'http' => array(
        'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36\r\n"
    )
);
$context = stream_context_create($options);

$content = @file_get_contents($target_url, false, $context);

if ($content === FALSE) {
    http_response_code(500);
    echo json_encode(["error" => "Error al cargar el recurso. Puede que la URL no sea accesible o que esté bloqueada."]);
    exit();
}

$contentType = get_headers($target_url, 1)['Content-Type'];

if (strpos($contentType, 'application/json') !== false || strpos($contentType, 'application/x-json') !== false) {
    $json_decoded = json_decode($content, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        header('Content-Type: application/json');
        echo json_encode($json_decoded);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Respuesta no válida del servidor. Verifica tus credenciales de Xtream."]);
    }
} elseif (strpos($contentType, 'mpegurl') !== false || strpos($contentType, 'octet-stream') !== false || empty($contentType)) {
    if (empty(trim($content))) {
        http_response_code(500);
        echo json_encode(["error" => "La lista M3U está vacía o tiene un formato incorrecto."]);
    } else {
        header('Content-Type: application/x-mpegURL');
        echo $content;
    }
} else {
    http_response_code(500);
    echo json_encode(["error" => "Respuesta inesperada del servidor (Tipo: $contentType)."]);
}
?>