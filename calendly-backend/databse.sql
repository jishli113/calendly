
CREATE TABLE (
    forusername TEXT not null,
    followingusername TEXT not null,
    PRIMARY KEY(forusername,followingusername),
    FOREIGN KEY(forusername) REFERENCES users(username)
);

