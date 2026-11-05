create table users (
    id serial primary key,
    username varchar(100) not null unique,
    password_raw varchar(100) not null,
    fullname varchar(100) not null
);
