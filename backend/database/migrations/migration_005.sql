CREATE TYPE AI_TUTOR_MESSAGE_SENDER AS ENUM ('STU', 'TUT');

CREATE TABLE ai_tutor_conversations (
    conversation_id         BIGSERIAL,
    account                 INT NOT NULL,
    time_created            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subject                 VARCHAR(255) NOT NULL,
    topic                   VARCHAR(255) NOT NULL,
    title                   VARCHAR(255) NOT NULL,
    PRIMARY KEY             (conversation_id),
    FOREIGN KEY             (account) REFERENCES accounts(id)  
);

CREATE TABLE ai_tutor_messages (
    message_id              BIGSERIAL,
    conversation_id         INT NOT NULL,
    supporting_image_loc    VARCHAR(255) DEFAULT NULL,
    message_contents        TEXT NOT NULL DEFAULT '',
    sender                  AI_TUTOR_MESSAGE_SENDER NOT NULL,
    time_created            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY             (message_id),
    FOREIGN KEY             (conversation_id) REFERENCES ai_tutor_conversations(conversation_id)                
);