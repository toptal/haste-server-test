# Database Support

Copy `.env.example` to `.env`.

Appropriately fill `DATABASE_URL`:

```
postgresql://[username]:[password]@[host]:[port]/[database_name]?schema=[schema_name]
```

## Adding a schema

To generate Prisma Client, run the following command:

```
prisma generate
```

or

```
yarn db:generate
```

You can now instantiate the Prisma Client in your code:

```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB
```

You need to re-run the `prisma generate` command after every change of the schema, to update the generated Prisma Client code.

Example schema:

```
    model User {
        id        Int      @id @default(autoincrement())
        createdAt DateTime @default(now())
        email     String   @unique
        name      String?
        role      Role     @default(USER)
        posts     Post[]
    }
```

## Migration

Prisma Migrate is an imperative database schema migration tool that enables you to:

Keep your database schema in sync with your Prisma schema as it evolves and
Maintain existing data in your database

### Creating the first migration

Once you have defined some models in the schema, you can create the first migration with

```
yarn db:migrate:dev --name init
```

Your Prisma schema is now in sync with your database schema, and you have initialized a migration history.

### Evolving the schema

Whenever a change is made to the schema, you can create new migrations with

```
prisma migrate dev --name add_name_to_users
```

or

```
yarn db:migrate:dev --name add_name_to_users
```

In a development environment, use the migrate dev command to generate and apply migrations:

```
prisma migrate dev
```
or

```
yarn db:migrate:dev
```


For more information, check https://www.prisma.io/docs/concepts/components/prisma-migrate.

## Seeds

To populate the database with predefined seeds, use:

```
prisma db seed
```

or

```
yarn db:seed
```

It will execute `prisma/seed.ts`.

Make sure to keep this file up to date with the schema evolution.
