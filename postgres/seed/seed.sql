BEGIN TRANSACTION;

INSERT into users (name,email,entries,joined) values ('Jes', 'jes@gmail.com',5, '2018-01-01');
INSERT into login (hash, email) values ('$2a$08$HYApMMFprA5dj2xZoNghmOv5PHPkQbgCcK9wDaPtJb9lZ2h9xb8Zy', 'jes@gmail.com');

COMMIT;