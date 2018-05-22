# Channeler

## Project Setup

Our application uses:

- Python (3.6.4)
- Django (2.0.5)
- Postgres (10.4)
- Redis (4.0.8)

Open your terminal and create a new PostgreSQL user and database. Enter a password when prompted.

```bash
computer$ createuser -d -e -s -W channeler
Password: <your_password>
CREATE ROLE example_search SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;
computer$ createdb -e -O "channeler" -W channeler
Password: <your_password>
CREATE DATABASE example_search OWNER example_search;
```

Export environment variables for your new database name, user, and password.

```bash
computer$ export PGDATABASE=channeler PGUSER=channeler PGPASSWORD=<your_password> PGHOST=localhost PGPORT=5432
```

Make a new Python virtual environment and install the project dependencies with `pip`. (We are using [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/).)

```bash
computer$ mkvirtualenv channeler
(channeler) computer$ pip install -r requirements.txt
```

Run the `python manage.py migrate` command in your terminal to install the initial database tables. You should see the following output.

```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying sessions.0001_initial... OK
```

Open a new terminal window (or tab). Connect to the database with `psql` and confirm that the tables exist.

```bash
(channeler) computer$ psql -U channeler
channeler=# \c channeler
channeler=# \dt
                      List of relations
 Schema |            Name            | Type  |  Owner
--------+----------------------------+-------+----------
 public | auth_group                 | table | channeler
 public | auth_group_permissions     | table | channeler
 public | auth_permission            | table | channeler
 public | auth_user                  | table | channeler
 public | auth_user_groups           | table | channeler
 public | auth_user_user_permissions | table | channeler
 public | django_admin_log           | table | channeler
 public | django_content_type        | table | channeler
 public | django_migrations          | table | channeler
 public | django_session             | table | channeler
(10 rows)
```

Open a new terminal window (or tab). Connect to the Redis server with `redis-server`.

```
(channeler) computer$ npm install -g wscat
(channeler) computer$ wscat ws://localhost:8000/tasks/
```

```
(channeler) computer$ curl -X POST http://localhost:8000/tasks/ -H 'Content-Type: application/json' -d '{}'
```