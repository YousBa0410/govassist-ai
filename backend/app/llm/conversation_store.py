from collections import defaultdict

MAX_MESSAGES = 10

conversations = defaultdict(list)


def get_history(session_id: str):
    return conversations[session_id]


def add_message(session_id: str, role: str, content: str):
    conversations[session_id].append({
        "role": role,
        "content": content
    })

    conversations[session_id] = conversations[session_id][-MAX_MESSAGES:]


def clear_history(session_id: str):
    conversations.pop(session_id, None)