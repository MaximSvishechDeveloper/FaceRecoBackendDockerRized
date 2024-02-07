BEGIN TRANSACTION;

INSERT into users (name,age,pet,email,entries,joined) values ('Jes',28,'Rio', 'jes@gmail.com',5, '2018-01-01');
INSERT into login (hash, email) values ('$2a$08$HYApMMFprA5dj2xZoNghmOv5PHPkQbgCcK9wDaPtJb9lZ2h9xb8Zy', 'jes@gmail.com');

COMMIT;