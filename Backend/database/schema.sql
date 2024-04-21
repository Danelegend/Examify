DROP TYPE IF EXISTS EXAM_TYPE CASCADE;
DROP TYPE IF EXISTS REGISTERATION_METHOD CASCADE;
DROP TYPE IF EXISTS PERMISSIONS CASCADE;

-- Types / Domains
CREATE TYPE EXAM_TYPE AS ENUM ('TRI', 'HSC', 'TOP', 'HAF', 'T_1', 'T_2', 'T_3', 'T_4');
CREATE TYPE REGISTERATION_METHOD AS ENUM ('email', 'google', 'facebook');
CREATE TYPE PERMISSIONS AS ENUM ('REG', 'PRE', 'ADM');

-- Tables

CREATE TABLE users (
    id                      BIGSERIAL,
    first_name              VARCHAR(50) NOT NULL,
    last_name               VARCHAR(50) NOT NULL,
    email                   VARCHAR(255) NOT NULL,
    phone                   VARCHAR(15),
    dob                     DATE NOT NULL,
    grade                   INT NOT NULL,
    school                  BIGINT NOT NULL,
    permission              PERMISSIONS NOT NULL DEFAULT 'REG',
    PRIMARY KEY             (id),
    FOREIGN KEY             (school) REFERENCES schools(id)
);

CREATE TABLE schools (
    id                      BIGSERIAL,
    name                    VARCHAR(128) NOT NULL,
    logo_location           VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY             (id)
);

CREATE TABLE passwords (
    id                      BIGSERIAL,
    password                VARCHAR(255) NOT NULL,
    time_created            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user                    BIGINT NOT NULL,
    PRIMARY KEY             (id),
    FOREIGN KEY             (user) REFERENCES users(id)
);

CREATE TABLE sessions (
    id                      BIGSERIAL,
    refresh_id              VARCHAR(255) NOT NULL,
    user                    BIGINT NOT NULL,
    timestamp               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY             (id),
    FOREIGN KEY             (user) REFERENCES users(id)
);

CREATE TABLE exams (
    id                      BIGSERIAL,
    school                  BIGINT NOT NULL,
    exam_type               EXAM_TYPE NOT NULL,
    year                    INT NOT NULL,
    file_location           VARCHAR(255) NOT NULL,
    date_uploaded           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subject                 VARCHAR(128) NOT NULL,
    PRIMARY KEY             (id),
    FOREIGN KEY             (school) REFERENCES schools(id)
);

CREATE TABLE favourite_exams (
    user                    BIGINT NOT NULL,
    exam                    BIGINT NOT NULL,
    PRIMARY KEY             (user, exam),
    FOREIGN KEY             (user) REFERENCES users(id),
    FOREIGN KEY             (exam) REFERENCES exams(id)
);

CREATE TABLE recently_viewed_exams (
    user                    BIGINT NOT NULL,
    exam                    BIGINT NOT NULL,
    PRIMARY KEY             (user, exam),
    FOREIGN KEY             (user) REFERENCES users(id),
    FOREIGN KEY             (exam) REFERENCES exams(id)
);