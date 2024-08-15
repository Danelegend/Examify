import os
from openai import AsyncOpenAI

from typing import Generator, List, Literal, Optional

from pydantic import BaseModel

API_KEY = os.environ.get("OPENAI_API_KEY", "")

client = AsyncOpenAI(
    api_key=API_KEY
)

class MessageContext(BaseModel):
    user: Literal["user", "system", "assistant"]
    message: str
    image_base64: Optional[str] = None

def create_generator(context: List[MessageContext]) -> Generator[str, None, None]:
    openai_stream = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[[
            {
                "role": message.user,
                "content": message.message,
            } for message in context
        ]],
        temperature=0.0,
        stream=True,
    )

    for event in openai_stream:
        if "content" in event["choices"][0].delta:
            current_response = event["choices"][0].delta.content
            yield {"content": current_response}

async def send_response(context: List[MessageContext]) -> str:
    messages = [_message_context_to_dict(message) for message in context]

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.0,
    )

    return response.choices[0].message.content

def _message_context_to_dict(message_context: MessageContext):
    d = {
        "role": message_context.user,
        "content": []
    }

    d["content"].append({"type": "text", "text": message_context.message})

    if message_context.image_base64 is not None:
        d["content"].append({"type": "image_url", "image_url": {
            "url": f"data:image/jpeg;base64,{message_context.image_base64}"
        }})

    return d