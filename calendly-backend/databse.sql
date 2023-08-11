
CREATE TABLE cachedevents(
    username TEXT,
    eventname TEXT,
    images JSON ARRAY,
    eventdate TEXT,
    PRIMARY KEY(username, eventname)
);

SELECT *
FROM events INNER JOIN (SELECT following FROM users WHERE username = 'jli') feedusers
ON events.username = feedusers.following