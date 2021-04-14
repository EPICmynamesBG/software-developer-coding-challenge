
## Pre-reqs
Have installed
- docker
- postgres/psql

To create the database run:
`psql -U postgres trdrev < dump_name.sql`

For the test database, alter and run::
`psql -U postgres trdrev_test < dump_name.sql`


## Setup

1. `docker-compose build api`
2. `docker-compose start postgres`
3. [new tab] `psql -U postgres trdrev < dump_name.sql`
4. `psql -U postgres trdrev_test < dump_name.sql`
5. halt the docker process
6. `docker-compose up api` (auto starts postgres and the api server)
7. navigate to `http://localhost:3000/docs` to see API docs


### Notes

To dump updated schema:
`pg_dump --host localhost --port 5432 --username "postgres" --schema-only   --verbose --file "./api/config/schema.sql" "trdrev"`

