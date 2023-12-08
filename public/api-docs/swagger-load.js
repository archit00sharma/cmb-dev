window.onload = function () {
    let url = "http://13.233.114.39:8000/swagger.yaml"
    var arr = window.location.href.split('?url=');
    if (arr.length > 1) {
        url = arr[1]
    }
    // Begin Swagger UI call region
    const ui = SwaggerUIBundle({
        url: url,
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
            SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset
        ],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: "StandaloneLayout"
    });
    // End Swagger UI call region
    window.ui = ui;
};
