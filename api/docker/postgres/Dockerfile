FROM postgres:13.2

ENV PGDATA=/var/lib/postgresql/data

COPY config/schema.sql /home/postgres/seed/schema.sql

CMD ["postgres"]
