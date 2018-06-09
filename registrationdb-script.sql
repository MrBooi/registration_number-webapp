drop table towns;
drop table registrationNo;

create table towns (
id serial not null primary key,
town_name text not null,
town_tag text not null
);

CREATE TABLE registrationNo(
 id serial not null primary key,
 reg_number text not null,
 town int not null,
  foreign key (town) references towns(id)
);