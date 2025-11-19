<?php
// proxy.php
// Script de proxy simple para evitar problemas de CORS en solicitudes GET.

// 1. Obtener la URL del parámetro 'url'
$target_url = isset($_GET['url']) ? $_GET['url'] : '';

// 2. Comprobación de seguridad básica
if (empty($target_url) || substr($target_url, 0, 4) !== 'http') {
    http_response_code(400); // Bad Request
    echo "Error: El parámetro 'url' es obligatorio o la URL no es válida.";
    exit;
}

// 3. Obtener el contenido del recurso externo
// Usamos cURL si está disponible, ya que es más robusto que file_get_contents
if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $target_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0); // No incluimos las cabeceras en el output
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Seguimos redirecciones
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // NECESARIO para URLs HTTPS de listas que usan certificados autogenerados

    $content = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $mime_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    
    curl_close($ch);
} else {
    // Fallback: usar file_get_contents (puede tener problemas con URLs grandes o redirecciones)
    $content = @file_get_contents($target_url);
    $http_code = ($content !== FALSE) ? 200 : 502;
    // Intentamos determinar el tipo de contenido si file_get_contents funcionó
    if ($content !== FALSE) {
        $info = @get_headers($target_url, 1);
        $mime_type = (isset($info['Content-Type']) ? (is_array($info['Content-Type']) ? end($info['Content-Type']) : $info['Content-Type']) : 'text/plain');
    }
}

// 4. Manejo de errores
if ($content === FALSE || $http_code >= 400) {
    // Para depuración, podríamos enviar el código de error HTTP que obtuvimos del servidor externo
    http_response_code(502); // Bad Gateway
    echo "Error: No se pudo obtener el contenido de la URL de destino. Código de estado del servidor externo: {$http_code}.";
    exit;
}

// 5. Devolver el contenido con la cabecera correcta
header('Content-Type: ' . $mime_type);
echo $content;
?>