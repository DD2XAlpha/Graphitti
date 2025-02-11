var file_path = '';

$('#open-file').on('click', () => {
    $('#graphContainer').html('');
    graphitti = new Graphitti();
    graphitti.open_file(function (data) {
        file_path = data;
    });
    $('#graphitti-start').attr('hidden', 'hidden');
    $('#graphitti').removeAttr('hidden');
    let graph_viewer_width = $("#graph-viewer").width();
    $("#input-zone").css("max-width", graph_viewer_width);
});

$('#btn-invoke').on('click', () => {
    let prompt = $('#txt-message').val();
    var graphitti = new Graphitti();
    graphitti.invoke_graph(file_path, prompt);

})

$("#download-graph-png").on('click', () => {
    var graphitti = new Graphitti();
    graphitti.download_graph_as_png(file_path);
});

$("#download-graph-svg").on('click', () => {
    var graphitti = new Graphitti();
    graphitti.download_graph_as_svg();
});