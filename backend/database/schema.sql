DROP TYPE IF EXISTS EXAM_TYPE CASCADE;
DROP TYPE IF EXISTS REGISTERATION_METHOD CASCADE;
DROP TYPE IF EXISTS PERMISSIONS CASCADE;
DROP TYPE IF EXISTS AI_TUTOR_MESSAGE_SENDER CASCADE;

DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS passwords CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS favourite_exams CASCADE;
DROP TABLE IF EXISTS recently_viewed_exams CASCADE;
DROP TABLE IF EXISTS completed_exams CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS question_images CASCADE;
DROP TABLE IF EXISTS user_answers CASCADE;
DROP TABLE IF EXISTS flagged_exams CASCADE;
DROP TABLE IF EXISTS user_subjects CASCADE;
DROP TABLE IF EXISTS ai_tutor_conversations CASCADE;
DROP TABLE IF EXISTS ai_tutor_messages CASCADE;

-- Types / Domains
CREATE TYPE EXAM_TYPE AS ENUM ('TRI', 'HSC', 'TOP', 'HAF', 'T_1', 'T_2', 'T_3', 'T_4');
CREATE TYPE REGISTERATION_METHOD AS ENUM ('email', 'google', 'facebook');
CREATE TYPE PERMISSIONS AS ENUM ('REG', 'PRE', 'ADM', 'TUT');
CREATE TYPE AI_TUTOR_MESSAGE_SENDER AS ENUM ('STU', 'TUT');

-- Tables

CREATE TABLE schools (
    id                      BIGSERIAL,
    name                    VARCHAR(128) NOT NULL,
    logo_location           VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY             (id)
);

CREATE TABLE accounts (
    id                      BIGSERIAL,
    first_name              VARCHAR(50) NOT NULL,
    last_name               VARCHAR(50) NOT NULL,
    email                   VARCHAR(255) NOT NULL,
    phone                   VARCHAR(15) DEFAULT NULL,
    dob                     DATE DEFAULT NULL,
    grade                   INT DEFAULT NULL,
    school                  BIGINT DEFAULT NULL,
    registeration_method    REGISTERATION_METHOD NOT NULL,
    permission              PERMISSIONS NOT NULL DEFAULT 'REG',
    PRIMARY KEY             (id),
    FOREIGN KEY             (school) REFERENCES schools(id)
);

CREATE TABLE user_subjects (
    account                 BIGINT NOT NULL,
    subject                 VARCHAR(128) NOT NULL,
    PRIMARY KEY             (account, subject),
    FOREIGN KEY             (account) REFERENCES accounts(id)
);

CREATE TABLE passwords (
    id                      BIGSERIAL,
    password                VARCHAR(255) NOT NULL,
    time_created            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    account                 BIGINT NOT NULL,
    PRIMARY KEY             (id),
    FOREIGN KEY             (account) REFERENCES accounts(id)
);

CREATE TABLE sessions (
    id                      BIGSERIAL,
    refresh_id              VARCHAR(255) NOT NULL,
    account                 BIGINT NOT NULL,
    timestamp               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY             (id),
    FOREIGN KEY             (account) REFERENCES accounts(id)
);

CREATE TABLE exams (
    id                      BIGSERIAL,
    school                  BIGINT NOT NULL,
    exam_type               EXAM_TYPE NOT NULL,
    year                    INT NOT NULL,
    file_location           VARCHAR(255) NOT NULL,
    date_uploaded           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subject                 VARCHAR(128) NOT NULL,
    difficulty              INT NOT NULL DEFAULT 1,
    PRIMARY KEY             (id),
    FOREIGN KEY             (school) REFERENCES schools(id)
);

CREATE TABLE favourite_exams (
    account                 BIGINT NOT NULL,
    exam                    BIGINT NOT NULL,
    date_favourite          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY             (account, exam),
    FOREIGN KEY             (account) REFERENCES accounts(id),
    FOREIGN KEY             (exam) REFERENCES exams(id)
);

CREATE TABLE recently_viewed_exams (
    account                 BIGINT NOT NULL,
    exam                    BIGINT NOT NULL,
    date_viewed             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY             (account, exam, date_viewed),
    FOREIGN KEY             (account) REFERENCES accounts(id),
    FOREIGN KEY             (exam) REFERENCES exams(id)
);

CREATE TABLE completed_exams (
    account                 BIGINT NOT NULL,
    exam                    BIGINT NOT NULL,
    date_completed          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY             (account, exam, date_completed),
    FOREIGN KEY             (account) REFERENCES accounts(id),
    FOREIGN KEY             (exam) REFERENCES exams(id)
);

CREATE TABLE notifications (
    id                      BIGSERIAL,
    receiver                BIGINT NOT NULL,
    sender                  BIGINT DEFAULT NULL,
    title                   VARCHAR(255) DEFAULT '' NOT NULL,
    message                 VARCHAR(255) DEFAULT '' NOT NULL,
    link                    VARCHAR(255) DEFAULT NULL,
    date_sent               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read                    BOOLEAN DEFAULT FALSE,
    date_read               TIMESTAMP DEFAULT NULL,
    PRIMARY KEY             (id),
    FOREIGN KEY             (receiver) REFERENCES accounts(id)
);

CREATE TABLE questions (
    id                      BIGSERIAL,
    title                   TEXT NOT NULL,
    subject                 TEXT NOT NULL,
    topic                   TEXT NOT NULL,
    question                TEXT NOT NULL,
    grade                   INT NOT NULL,
    difficulty              INT NOT NULL,
    PRIMARY KEY             (id)
);

CREATE TABLE answers (
    id                      BIGSERIAL,
    question                BIGINT NOT NULL,
    answer                  TEXT NOT NULL,
    PRIMARY KEY             (id),
    FOREIGN KEY             (question) REFERENCES questions(id)
);

CREATE TABLE question_images (
    id                      BIGSERIAL,
    question                BIGINT NOT NULL,
    image_location          VARCHAR(255) NOT NULL,
    PRIMARY KEY             (id),
    FOREIGN KEY             (question) REFERENCES questions(id)
);

CREATE TABLE user_answers (
    id                      BIGSERIAL,
    account                 BIGINT NOT NULL,
    question                BIGINT NOT NULL,
    answer                  TEXT NOT NULL,
    timestamp               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY             (id),
    FOREIGN KEY             (account) REFERENCES accounts(id),
    FOREIGN KEY             (question) REFERENCES questions(id)
);

CREATE TABLE flagged_exams (
    id                      BIGSERIAL,
    exam                    BIGINT NOT NULL,
    timestamp               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY             (id),
    FOREIGN KEY             (exam) REFERENCES exams(id)
);

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