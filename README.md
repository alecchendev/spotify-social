# Spotify Social
A simple web app to share and connect with friends on data pulled from the Spotify API.

### Motive
I'd been [messing around with the Spotify API](https://github.com/alecchendev/spotify-refresh-token)
for a bit with the idea for this app in the back of my mind, and a friend and I had started work on a
different version of a similar premise. There's some cool data that's easily pulled from the Spotify API
that you can't see in Spotify itself. I figured people would be interested in a way to sort of activate 
your profile to not only see your stats for yourself, but also to share with others. And thus, Spotify Social was born.

### Next Steps
I'll probably be posting updates on my Twitter. As for next steps, these are my plans as of now:
- Refactor API/Spotify API calls
- Refactor frontend to Nextjs
- Deploy to Vercel (maybe with serverless?) + Digital Ocean
- Search - search for users on platform by username/display name
- Similarity reports when logged in user views another profile
- Account reccommendations based on following

## Setup Locally
The following steps should get you from 0 setup to being able to run and develop the code in this repo.

### Install Node and PostgreSQL
- Node: https://nodejs.org/en/
- PostgreSQL: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
  - Currently using Heroku for database management.

### .env
- API_VERSION=v1
- CLIENT_ID
- CLIENT_SECRET
- DATABASE_URL
- JWT_TOKEN_SECRET

### Install dependencies
Just the commands (from root directory):

```
npm install
cd frontend && npm install && cd ..
```

1. Run npm install in the root directory.
2. Run npm install in the frontend directory.

### Run
```
npm run dev
```

See package.json for other commands.
