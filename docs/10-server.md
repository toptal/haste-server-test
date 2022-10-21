# Server

This is an [Express.js](https://nextjs.org/) project that is rewritten from [haste-server](https://github.com/toptal/haste-server)

`This document will be updated !`

Haste is an open-source pastebin software written in node.js, which is easily
installable in any network. It can be backed by either redis or filesystem,
and has a very easy adapter interface for other stores. A publicly available
version can be found at [hastebin.com](http://hastebin.com)

Major design objectives:

- Be really pretty
- Be really simple
- Be easy to set up and use

Haste works really well with a little utility called
[haste-client](https://github.com/seejohnrun/haste-client), allowing you
to do things like:

`cat something | haste`

which will output a URL to share containing the contents of `cat something`'s
STDOUT. Check the README there for more details and usages.

## Tested Browsers

- Firefox >=68
- Chrome >=78
- Safari >=13
- Edge >= 20

## Installation

1.  Download the package, and expand it
2.  `yarn`

## Running the project

> Explore the settings inside of `apps/server/config/config.ts`, but the defaults should be good

### Development

1.  `yarn`
2.  `yarn dev`

### Production

1.  `yarn`
2.  `yarn build` to build the package
3.  `yarn start` to start the server

## Configuration

### How it works

All project settings are defined inside of `apps/server/config/config.ts`. Some settings are hardcoded there, but all environment-dependent values can be (and should be) set by environment variables.

Config file is constructed in a way that env vars should override defaults defined in `config.ts`

Example:

```ts
export const config: Config = {
  host: process.env.HOST || '0.0.0.0'
  // ...
}
```

You can change the default `0.0.0.0` in `config.ts` or just set `HOST` env var which will overwrite the default.

### Options overview

|    Key name     |             Default value             |                          Description                          |
| :-------------: | :-----------------------------------: | :-----------------------------------------------------------: |
|      host       |               `0.0.0.0`               |                  the host the server runs on                  |
|      port       |                `7777`                 |                  the port the server runs on                  |
|    basePath     |                 `''`                  | base url for the server app. By default it works on root path |
| documetationUrl | `http://localhost:3000/documentation` |              url for the api documentation page               |
|    keyLength    |                 `10`                  |                the length of the keys to user                 |
|    maxLength    |               `400000`                |                   maximum length of a paste                   |
|     storage     |                `file`                 |                  storage options (see below)                  |
|     logging     |          verbose (see below)          |                      logging preferences                      |
|  keyGenerator   |         phonetic (see below)          |               key generator options (see below)               |
|   rateLimits    |              (see below)              |            settings for rate limiting (see below)             |

## Rate Limiting

When present, the `rateLimits` option enables built-in rate limiting courtesy
of `connect-ratelimit`. Any of the options supported by that library can be
used and set in `apps/server/config/config.ts`.

Default value:

```ts
rateLimits: {
  categories: {
    normal: {
      totalRequests: 500,
      every: 60000
    }
  }
}
```

See the README for [connect-ratelimit](https://github.com/dharmafly/connect-ratelimit)
for more information!

## Key Generation

### Phonetic

Attempts to generate phonetic keys, similar to `pwgen`

```ts
keyGenerator: {
    type: 'phonetic'
},
```

### Random

Generates a random key

```ts
keyGenerator: {
    type: 'random',
    keyspace: 'abcdef' // The optional keySpace argument is a string of acceptable characters for the key.
}
```

## Storage

First you need to select storage you want to use by setting `STORAGE_TYPE` env var:

|      Name      |   Default value   |                                                                                              Accepted values                                                                                               |
| :------------: | :---------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  STORAGE_TYPE  | `file-data-store` | `amazon-s3-data-store`, `file-data-store`, `google-cloud-data-store`, `google-cloud-storage`, `memcached-data-store`, `mongo-data-store`, `postgres-data-store`, `redis-data-store`,`rethinkdb-data-store` |
| STORAGE_EXPIRE |     undefined     |                                                 (optional) number of seconds to expire keys in. This is off by default. Not supported by `file-data-store`                                                 |

### File

with `STORAGE_TYPE` set to `file-data-store`

|   Name    | Default value | Required? |                Description                 |
| :-------: | :-----------: | :-------: | :----------------------------------------: |
| FILE_PATH |   `./data`    |    no     | represents where you want the files stored |

File storage currently does not support paste expiration.

### Redis

with `STORAGE_TYPE` set to `redis-data-store`

|      Name      | Default value | Required? |      Description      |
| :------------: | :-----------: | :-------: | :-------------------: |
|   REDIS_HOST   |  `127.0.0.1`  |    no     |   redis server host   |
|   REDIS_PORT   |    `6379`     |    no     |   redis server port   |
|    REDIS_DB    |      `0`      |    no     |    redis db index     |
| REDIS_USERNAME |   undefined   |    no     |   redis server user   |
| REDIS_PASSWORD |   undefined   |    no     | redis server password |

### Postgres

with `STORAGE_TYPE` set to `postgres-data-store`

|     Name     | Default value | Required? |       Description       |
| :----------: | :-----------: | :-------: | :---------------------: |
| DATABASE_URL |   undefined   |    yes    | database connection url |

You will have to manually add a table to your postgres database:

`create table entries (id serial primary key, key varchar(255) not null, value text not null, expiration int, unique(key));`

### MongoDB

with `STORAGE_TYPE` set to `mongo-data-store`

|     Name     | Default value | Required? |                            Description                            |
| :----------: | :-----------: | :-------: | :---------------------------------------------------------------: |
| DATABASE_URL |   undefined   |    yes    | database connection url e.g. `mongodb://localhost:27017/database` |

Unlike with postgres you do NOT have to create the table in your mongo database prior to running.

### Memcached

with `STORAGE_TYPE` set to `mongo-data-store`

|      Name      | Default value | Required? |      Description      |
| :------------: | :-----------: | :-------: | :-------------------: |
| MEMCACHED_HOST |  `localhost`  |    no     | memcached server host |
| MEMCACHED_PORT |    `11211`    |    no     | memcached server port |

### RethinkDB

with `STORAGE_TYPE` set to `rethinkdb-data-store`

|       Name       | Default value | Required? |        Description        |
| :--------------: | :-----------: | :-------: | :-----------------------: |
|   RETHINK_HOST   |  `127.0.0.1`  |    no     |   rethinkDB server host   |
|   RETHINK_PORT   |    `28015`    |    no     |   rethinkDB server port   |
|    RETHINK_DB    |    `haste`    |    no     |     rethinkDB db name     |
| RETHINK_USERNAME |   undefined   |    no     |   rethinkDB server user   |
| RETHINK_PASSWORD |   undefined   |    no     | rethinkDB server password |

In order for this to work, the database must be pre-created before the script is ran.
Also, you must create an `uploads` table, which will store all the data for uploads.

### Google Datastore

with `STORAGE_TYPE` set to `google-cloud-data-store`

Authentication is handled automatically by [Google Cloud service account credentials](https://cloud.google.com/docs/authentication/getting-started), by providing authentication details to the GOOGLE_APPLICATION_CREDENTIALS environmental variable.

### Google Cloud Storage

with `STORAGE_TYPE` set to `google-cloud-storage`

|    Name    | Default value | Required? |    Description    |
| :--------: | :-----------: | :-------: | :---------------: |
|  GCS_PATH  |     `''`      |    yes    | storage base path |
| GCS_BUCKET |     `''`      |    yes    |  storage bucket   |

Authentication is handled automatically by [Google Cloud service account credentials](https://cloud.google.com/docs/authentication/getting-started), by providing authentication details to the GOOGLE_APPLICATION_CREDENTIALS environmental variable.

### Amazon S3

with `STORAGE_TYPE` set to `amazon-s3-data-store`

|   Name    | Default value | Required? |   Description    |
| :-------: | :-----------: | :-------: | :--------------: |
| S3_BUCKET |     `''`      |    yes    | your bucket name |
| S3_REGION |     `''`      |    yes    | your region name |

Authentication is handled automatically by the client. Check
[Amazon's documentation](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)
for more information. You will need to grant your role these permissions to
your bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::your-bucket-name-goes-here/*"
    }
  ]
}
```

## Token Validation

To be able to activate token validation, first we need to migrate database that is added from next-app:

- `cp apps/next-app/.env.example apps/next-app/.env`
- Edit `apps/next-app/.env` and appropriately fill the `DATABASE_URL`.
- `yarn && yarn db:migrate:dev && yarn db:seed`, ( this will generate the db that is specified in next-app in your machine)

When we have these tables in our database, we should connect it with knex for our server.

- `cp apps/server/.env.example apps/server/.env`
- Edit `apps/server/.env` and appropriately fill the `DATABASE_URL`.
- Change `NEXT_PUBLIC_FF_USER_AUTH` to `enabled`

After this, when you start the server, you will be able to access token validation endpoints.

## Author

John Crepezzi <john.crepezzi@gmail.com>

## License

(The MIT License)

Copyright © 2011-2012 John Crepezzi

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the ‘Software’), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE

### Other components:

- highlight.js: Copyright © 2006, Ivan Sagalaev
- highlightjs-coffeescript: WTFPL - Copyright © 2011, Dmytrii Nagirniak
