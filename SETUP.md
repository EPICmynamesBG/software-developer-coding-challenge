1. Install docker and ensure Docker is running
2. Create env files
```
# /ui/.env
PORT=8080
REACT_APP_PUBLIC_URL=localhost:8080
REACT_APP_API_URI=http://localhost:3000
```
```
# /api/.env
NODE_ENV=development
PORT=3000
HOST_DOMAIN=http://localhost

DATABASE_CONN_DETAILS=postgresql://postgres:postgres@postgres:5432/trdrev

JWT_PUBLIC=TRDREV
JWT_SECRET=zAdeSbFWNWCz0joOA9iKHr1n5X3Db17z

ENCRYPTION_KEY=XAdeSZFWNWCz0joOA9zKHr1n5X3Db17z
APP_URI=http://localhost:8080
```

_Note: The provided secrets are provided and intended for local usage only. Please be sure to generate new secrets
and update connection secrets when choosing to deploy in a production environment._

3. In the project directory, run the below
```
docker-compose build
```
3. Initialize the database. Note if asked for a password, this is defined in the docker-compose.yaml file. The default is "postgres"
```
docker-compose up postgres
[new tab]
psql -U postgres trdrev < dump_name.sql
docker-compose down
[ctrl+C]
```
4. Launch the DB, api and ui server via
```
docker-compose up
```
Tip: use the `-d` option to run in daemon mode and not have the process consume your terminal.
5. Navigate to the app at `localhost:8080`


### Nice to Haves
- auto-reloading of API code/server when code changes
