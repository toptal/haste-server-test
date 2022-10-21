# Getting Started

Install your dependencies

```sh
yarn install
```

Run the development server and next-app:

```bash
yarn dev
```

To be able to run server or next-app:

```bash
yarn dev --scope='hastebin-app'
yarn dev --scope='hastebin-server'
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can start editing the page by modifying `apps/next-apppages/index.tsx`. The page auto-updates as you edit the file.

You can start to send requests to your server from [http://localhost:7777](http://localhost:7777).

## Docker

### Development mode

There is a `docker-compose.yml` which runs haste-server together with postgres

If you are running this project for the first time, you also need to run db migrations and seed:

```bash
docker-compose run app ./bin/setup.sh
```

Then

```bash
docker-compose run app yarn build
```

```bash
docker-compose up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also start to send requests to your server from [http://localhost:7777](http://localhost:7777).

#### Github Authentication

By default, development environment starts with a mock authentication provider. It is set up using `NEXT_PUBLIC_BYPASS_SESSION=enabled`

If you want to test Github Authentication locally, you're going to need override this configuration by exporting NEXT_PUBLIC_BYPASS_SESSION=disabled before spinning up the docker container.

You're also going to need to export valid `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

```bash
export NEXT_PUBLIC_BYPASS_SESSION=disabled
export GITHUB_CLIENT_ID=xxx
export GITHUB_CLIENT_SECRET=yyy
docker-compose up
```

For more information, check out [the dedicated documentation](apps/next-app/docs/01-github-authentication.md).

### Production mode for E2E tests

Start the DB. Docker compose can be used.

```bash
docker-compose -f docker-compose.db.yml
```

### Configuration

The docker image is configured using environmental variables as you can see in the example above.

Here is a list of all the environment variables

|         Name          | Default value |                                                                                              Accepted values                                                                                               |
| :-------------------: | :-----------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|     STORAGE_TYPE      |   memcached   | 'amazon-s3-data-store', 'file-data-store', 'google-cloud-data-store', 'google-cloud-storage', 'memcached-data-store', 'mongo-data-store', 'postgres-data-store', 'redis-data-store','rethinkdb-data-store' |
|         HOST          |    0.0.0.0    |                                                                                         any hostname or ip address                                                                                         |
|      SERVER_PORT      |     7777      |                                                                                               any valid port                                                                                               |
| NEXT_PUBLIC_BASE_PATH |    `empty`    |                                                                            any valid base path e.g. `/developers/labs-hastebin`                                                                            |

There are also environment variables per storage type, described in [server documentation](10-server.md).
