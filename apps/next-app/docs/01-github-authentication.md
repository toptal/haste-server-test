# Github Authentication

Set up an OAuth app for development purposes

- Go to https://github.com/settings/developers and click `New OAuth App`
- Name it however you want
- Add `http://localhost:3000/` to the **Homepage URL**
- Add `http://localhost:3000/api/auth/callback/github` to **Authorization callback URL**
- Click **Register Application**
- On the next page, click **Generate a new client secret**
- Edit `.env` and:
  - Add the newly generated secret to `GITHUB_CLIENT_SECRET`
  - Add **Client ID** from the app you just created to `GITHUB_CLIENT_ID`
  - `NEXTAUTH_URL=http://localhost:3000/api/auth`
  - Fill out `NEXTAUTH_SECRET` with a long, unique, random string. On a Linux/Unix based terminal, you can get that by running `openssl rand -hex 32`. You can also use https://generate-secret.now.sh/32
