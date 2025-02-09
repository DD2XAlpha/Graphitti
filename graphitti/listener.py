from langgraph.graph.state import CompiledStateGraph



def get_vars_and_exec(script_path: str) -> dict:
    vars = {}
    with open(script_path, 'r') as script:
        exec(script.read(), vars)
        return vars

def lookup_for_state_graph(script_path: str):
    vars = get_vars_and_exec(script_path)
    for var_name, value in vars.items():
        if isinstance(value, CompiledStateGraph):
            print(f"Found state graph: {var_name}")
            return value

