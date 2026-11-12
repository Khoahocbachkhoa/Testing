create table if not exists users (
    id            serial primary key,
    username      varchar(100) not null unique,
    password_hash varchar(255) not null,
    fullname      varchar(100) not null,
    created_at    timestamptz not null default now()
);

create table if not exists diary_entries (
    id          serial primary key,
    user_id     integer not null references users(id) on delete cascade,
    title       varchar(200) not null default '',
    content     text not null,
    entry_date  date not null default current_date,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create index if not exists idx_diary_entries_user_date
    on diary_entries (user_id, entry_date desc);
