# Testing

Check [Test documentation on Confluence](https://toptal-core.atlassian.net/wiki/spaces/SACQ/pages/2476737125/Testing+process+and+tools) for more detailed information about test automation levels and instructions.

## Unit tests

It will run unit test command on every package:

```bash
yarn test:unit
```

To be able to run unit tests on a specific package:

```bash
yarn test:unit --scope='package-name'
```

Check documentation about [Unit tests best practices](https://toptal-core.atlassian.net/wiki/spaces/SACQ/pages/2561835118/Unit+tests+best+practices) for more quality driven tests.

### Code coverage for unit tests

It will run separated code coverages command on every package:

```bash
yarn test:unit:coverage
```

To be able to run code coverage on a specific package:

```bash
yarn test:unit:coverage --scope='package-name'
```

Open the link is shown on the terminal, click on right up side "%Coverage" and check it up.

## End-to-end tests

`.env` file needs to have some environment variables:

```
GITHUB_CLIENT_ID=******
GITHUB_CLIENT_SECRET=******
NEXTAUTH_URL=http://localhost:3000/api/auth
NEXTAUTH_SECRET=******
NEXT_PUBLIC_BASE_API_URL=http://localhost:7777
NEXT_PUBLIC_FF_USER_AUTH=enabled
DATABASE_URL=postgresql://toptal:toptal@localhost:5432/hastebin
```

It will run e2e test command on next-app:

```bash
docker-compose -f docker-compose.db.yml up
yarn db:migrate:deploy && yarn db:seed
yarn turbo run start --filter=hastebin-server
yarn test:e2e
```

Check documentation about [Playwright tests best practices](https://toptal-core.atlassian.net/wiki/spaces/SACQ/pages/2562032213/Playwright+best+practices) for more quality driven tests.

### Code coverage for end-to-end tests

It will run e2e code coverage command on next-app:

```bash
docker-compose -f docker-compose.db.yml up
yarn db:migrate:deploy && yarn db:seed
yarn turbo run start --filter=hastebin-server
yarn test:e2e:coverage
yarn nyc:report
```

Open html generated report on browser:

```bash
http://localhost:5500/test-coverage/e2e/index.html
```

## Visual regression tests

### Happo settings

Go to LastPass and get Happo login credentials, so you can access the dashboard from our account. If don’t have the credentials, reach out to IT Ops channel on Slack.

Add to your global environment variables on your next-app or on your local machine.

```
HAPPO_API_KEY=XXX
HAPPO_API_SECRET=XXX
```

### Running Happo tests

It will run happo tests commands on next-app:

```bash
yarn install && yarn build
yarn happo run
```

You can compare runs between two commit hashes with:

```bash
yarn happo compare first-commit-hash second-commit-hash
```

You can run by test component with:

```bash
yarn happo run --only component-name
```

Check documentation about [Happo tests best practices](https://toptal-core.atlassian.net/wiki/spaces/SACQ/pages/2561933682/Happo+tests+best+practices) for more quality driven tests.

### Accessibility tests

Basic A11y tests are in place at `apps/next-app/test/e2e/a11y.e2e.test.ts`

Make sure to keep it up to date, covering any new pages, dialogs, collapsable menus, etc.
