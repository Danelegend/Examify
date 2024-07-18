import os

import google.generativeai as genai

from functools import cache

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json"
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

@cache
def send_message(message: str) -> str:
    """
    Send a message to gemini and get the response
    """
    chat_session = model.start_chat(
      history=[
      ]
    )

    response = chat_session.send_message(message)

    return response.text