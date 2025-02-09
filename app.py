from flask import Flask, render_template, request, jsonify
from graphitti.graph import get_mermaid_graph, async_invoke_state_graph, invoke_state_graph
from graphitti.json_parser import parse_message
from graphitti.filedialog import open_file, open_folder
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html")

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
    print("Message", message)
    path = data.get('path')
    response = invoke_state_graph(path, message)
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

if __name__ == '__main__':
    app.run(debug=True)