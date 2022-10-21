create table IF NOT EXISTS entries (id serial primary key, key varchar(255) not null, value text not null, expiration int, unique(key));
