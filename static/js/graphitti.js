class Graphitti {

    open_file(callback) {
        $.ajax({
            url: `/open-file`,
            type: 'GET',
            success: (data) => {
                console.log(data);
                this.get_graph(data);
                callback(data);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error('Error fetching graph:', textStatus, errorThrown);
            }
        });
    }

    get_graph(path) {
        $.ajax({
            url: `/mermaid`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ path: path }),
            success: (data) => {
                this.draw_graph('graphContainer', data);
                //this.invoke_graph(path); //remove
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error('Error fetching graph:', textStatus, errorThrown);
            }
        });
    }

    draw_graph(element_id, data) {
        $("#graph-viewer").append('<div id="graph_pre"></div>')
        mermaid.render('graph_pre', data).then(({ svg, bindFunctions }) => {
            $(`#${element_id}`).html(svg);
            let current_graph_viewer_height = $('#graph-viewer').height();
            $(`#${element_id} svg`).css('max-width', 'none').css('max-height', `${current_graph_viewer_height - 200}px`);
            $('#graph-drop').removeClass('disabled');
            $('#thread-drop').removeClass('disabled');
        });
    }

    invoke_graph(path, prompt) {
        $.ajax({
            url: '/invoke',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: prompt, path: path }),
            success: (response) => {
                let data = JSON.parse(response);
                console.log(data); ``

                for (var i = 0; i < data.length; i++) {
                    $("#graph-execution").append(new GraphittiComponent().render_interaction(data[i]));
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error('Error invoking graph:', textStatus, errorThrown);
            }
        });
    }

    download_graph_as_png(path) {
        $.ajax({
            url: `image-download`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ path: path }),
            xhrFields: {
                responseType: 'blob'
            },
            success: function (response) {
                // Create a blob URL from the response
                const blob = new Blob([response], { type: 'image/jpeg' });
                const url = window.URL.createObjectURL(blob);

                // Create a temporary link and trigger download
                const link = document.createElement('a');
                link.href = url;
                link.download = "graph.png";
                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            },
            error: function (xhr, status, error) {
                console.error('Error downloading image:', error);
                alert('Failed to download image');
            }
        });
    }

    download_graph_as_svg() {
        const svgElement = document.querySelector('svg');

        // Get the SVG content as a string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);

        // Create a blob with the SVG data
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = window.URL.createObjectURL(blob);

        // Create temporary link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'graph.svg';
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

}

class GraphittiComponent {

    render_interaction(interaction) {
        if (interaction.type == 'human') {
            return this.human_card(interaction);
        }
        else if (interaction.type == 'tool') {
            return this.tool_card(interaction);
        }
        else if (interaction.type == 'ai') {
            return this.ai_card(interaction);
        }
    }

    human_card(interaction) {
        let card = `<div class="card border-primary m-3">
                        <div class="card-header bg-primary text-white"><i class="fa-solid fa-user"></i><b> ${interaction.type}</b></div>
                        <div class="card-body text-primary">
                            <p class="card-text">${interaction.content}</p>
                        </div>
                    </div>`
        return card;
    }

    tool_card(interaction) {
        let card = `<div class="card border-info m-3">
                        <div class="card-header bg-info"><i class="fa-solid fa-screwdriver-wrench"></i><b> ${interaction.type}</b></div>
                        <div class="card-body">
                            <p class="card-text">${interaction.content}</p>
                        </div>
                    </div>`
        return card;
    }

    ai_card(interaction) {

        let table = this.generateTable(interaction);

        let card = `<div class="card border-custom-purple m-3">
                        <div class="card-header bg-custom-purple text-white"><i class="fa-solid fa-brain"></i><b> ${interaction.type}</b></div>
                        <div class="card-body">
                            ${table}
                            <p class="card-text">${marked.parse(interaction.content)}</p>
                        </div>
                    </div>`
        return card;
    }

    generateTable(data) {
        let tool_call_list = ''

        data.tool_calls.forEach(tool => {
            const row = document.createElement("tr");

            // Name column
            const nameCell = document.createElement("td");
            nameCell.textContent = tool.name;
            row.appendChild(nameCell);

            // Args column
            const argsCell = document.createElement("td");
            const argsArray = Object.entries(tool.args).map(([key, value]) => `${key}: ${value}`);
            argsCell.textContent = argsArray.join(", ");
            row.appendChild(argsCell);

            tool_call_list += row.innerHTML;
        });

        if (tool_call_list == '') {
            return '';
        }

        let table = `<table class="table">
                        <thead>
                            <tr>
                                <th>Tool</th>
                                <th>Arguments</th>
                            </tr>
                        </thead>
                        <tbody>${tool_call_list}</tbody>
                    </table>`
        return table;
    }
}