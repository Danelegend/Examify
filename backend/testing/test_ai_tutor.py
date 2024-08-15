from functionality.ai.ai_tutor import AiTutorManager


def test_ai_tutor_creation():
    # Create a new conversation
    conversation_id = 1

    AiTutorManager.create_ai_tutor()