CREATE TABLE user_subjects (
    account                 BIGINT NOT NULL,
    subject                 VARCHAR(128) NOT NULL,
    PRIMARY KEY             (account, subject),
    FOREIGN KEY             (account) REFERENCES accounts(id)
);