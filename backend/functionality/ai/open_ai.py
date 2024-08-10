import os
import openai

from typing import Generator, List, Literal

from pydantic import BaseModel

openai.api_key = os.environ.get("OPENAI_API_KEY", "")

class MessageContext(BaseModel):
    user: Literal["user", "system", "assistant"]
    message: str

def create_generator(context: List[MessageContext]) -> Generator[str, None, None]:
    openai_stream = openai.ChatCompletion.create(
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