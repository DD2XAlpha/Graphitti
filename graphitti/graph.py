from langchain_core.messages import HumanMessage
from graphitti.listener import lookup_for_state_graph
from langgraph.checkpoint.memory import MemorySaver
from typing import Optional
import uuid

memory = MemorySaver()

def get_mermaid_graph(script_path: str) -> str:
    builder  = lookup_for_state_graph(script_path)
    state_graph = builder.compile()
    return state_graph.get_graph().draw_mermaid()

def get_mermaid_graph_image(script_path: str) -> str:
    builder  = lookup_for_state_graph(script_path)
    state_graph = builder.compile()
    return state_graph.get_graph().draw_mermaid_png()

def invoke_state_graph(script_path: str, prompt: str, thread_id: Optional[str] = None) -> None:
    config = {"configurable": {"thread_id": thread_id}}
    builder  = lookup_for_state_graph(script_path)
    state_graph = builder.compile(checkpointer=memory)
    return state_graph.invoke({"messages" :  [HumanMessage(content=prompt)]}, config)

async def async_invoke_state_graph(script_path: str, prompt: str):
    state_graph = lookup_for_state_graph(script_path)
    async for chunk in state_graph.stream({"messages": [HumanMessage(content=prompt)]}):
        yield chunk

def new_thread_id() -> str:
    return str(uuid.uuid4())