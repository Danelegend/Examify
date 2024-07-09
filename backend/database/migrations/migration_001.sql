CREATE TABLE questions (
    id                      BIGSERIAL,
    title                   TEXT NOT NULL,
    subject                 TEXT NOT NULL,
    topic                   TEXT NOT NULL,
    question                TEXT NOT NULL,
    grade                   INT NOT NULL,
    difficulty              INT NOT NULL,
    PRIMARY KEY             (id),
    FOREIGN KEY             (exam) REFERENCES exams(id)
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
