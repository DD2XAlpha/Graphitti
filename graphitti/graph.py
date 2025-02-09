from langgraph.graph import StateGraph
from langchain_core.messages import HumanMessage
from graphitti.listener import lookup_for_state_graph

def get_mermaid_graph(script_path: str) -> str:
    state_graph  = lookup_for_state_graph(script_path)
    return state_graph.get_graph().draw_mermaid()

def invoke_state_graph(script_path: str, prompt: str) -> None:
    state_graph = lookup_for_state_graph(script_path)
    return state_graph.invoke({"messages" :  [HumanMessage(content=prompt)]})

async def async_invoke_state_graph(script_path: str, prompt: str):
    state_graph = lookup_for_state_graph(script_path)
    async for chunk in state_graph.stream({"messages": [HumanMessage(content=prompt)]}):
        yield chunk