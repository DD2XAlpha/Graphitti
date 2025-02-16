from flask import Flask, render_template, request, jsonify,send_file
from graphitti.graph import get_mermaid_graph, get_mermaid_graph_image, async_invoke_state_graph, invoke_state_graph, new_thread_id
from graphitti.json_parser import parse_message
from graphitti.filedialog import open_file, open_folder
from dotenv import load_dotenv
from io import BytesIO

app = Flask(__name__)

load_dotenv()

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/open-file')
def open_file_route():
    return open_file()

@app.route('/open-folder')
def open_folder_route():
    return open_folder()

@app.route('/mermaid', methods=['POST'])
def mermaid():
    data = request.get_json()
    path = data.get('path')
    return get_mermaid_graph(path)

@app.route('/invoke', methods=['POST'])
def invoke():
    data = request.get_json()
    message = data.get('message')
    thread_id = data.get('thread_id')
    print(thread_id)
    path = data.get('path')
    response = invoke_state_graph(path, message, thread_id)
    parsed_response = parse_message(response["messages"])
    return jsonify(parsed_response)

@app.route('/async-invoke', methods=['POST'])
def async_invoke():
    data = request.get_json()
    message = data.get('message')
    path = data.get('path')

    def generate():
        for output in async_invoke_state_graph(path, message):
            yield output

    return app.response_class(generate(), mimetype='text/plain')

@app.route('/image-download', methods=['POST'])
def image_download():
    data = request.get_json()
    path = data.get('path')
    img = get_mermaid_graph_image(path)
    return send_file(BytesIO(img), mimetype='image/png', as_attachment=True, download_name='graph.png')

@app.route('/new-thread-id', methods=['GET'])
def new_thread():
    return jsonify({"thread_id": new_thread_id()})

if __name__ == '__main__':
    app.run(debug=True)