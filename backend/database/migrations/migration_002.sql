CREATE TABLE flagged_exams (
    id                      BIGSERIAL,
    exam                    BIGINT NOT NULL,
    timestamp               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY             (id),
    FOREIGN KEY             (exam) REFERENCES exams(id)
);
