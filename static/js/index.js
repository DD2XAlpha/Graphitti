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
    let thread = $("#thread-id").html();
    var graphitti = new Graphitti();
    graphitti.invoke_graph(file_path, prompt, thread);

})

$("#download-graph-png").on('click', () => {
    var graphitti = new Graphitti();
    graphitti.download_graph_as_png(file_path);
});

$("#download-graph-svg").on('click', () => {
    var graphitti = new Graphitti();
    graphitti.download_graph_as_svg();
});

$("#new-thread").on('click', () => {
    graphitti = new Graphitti();
    graphitti.new_thread_id();
});

$("#copy-thread").on('click', () =>{
    let thread = $("#txt-thread-json").val();
    copyToClipboard(thread).then(success => {});
});

$("#copy-thread-id").on('click', () =>{
    let thread = $("#thread-id").html();
    copyToClipboard(thread).then(success => {});
});

$("#download-thread").on('click', () =>{
    downloadJSON("txt-thread-json");
});