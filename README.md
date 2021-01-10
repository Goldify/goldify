[Goldify Logo](public/goldify_logo.png)

# Goldify

A react-based application that you can use to build custom playlists based on your Spotify listening history.

## How to run

To build with docker, the following commands can be run:

```
docker-compose build
docker-compose up -d
```

If you prefer to run without docker, you can also run the following:

```
yarn install
yarn run start
```

## Testing/Linting

All changes made to this repo should pass testing and linting standards, and will be checked by GitHub Actions.

To test and lint your changes locally, the following commands can be used:

```
docker-compose exec goldify yarn test
docker-compose exec goldify yarn lint
```
