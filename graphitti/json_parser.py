import json

# Function to convert class instances to dictionaries

def message_to_dict(message):
    if hasattr(message, "__dict__"):  # Check if the object has a dictionary representation
        return message.__dict__
    else:
        return str(message)  # Fallback for unexpected types

def parse_message(messages):
    messages_dict = [message_to_dict(msg) for msg in messages]
    return json.dumps(messages_dict)