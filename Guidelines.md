# Docker Guidelines

## Backend

Build image
```
cd backend
docker build -t futsal-api .
```

Run image
```
docker run -d --name futsal-api-container -p 8089:8089 -e MONGODB_URL=mongodb://host.docker.internal:27017/futsal-buddy-db futsal-api
```

## Frontend

Build image
```
cd frontend
docker build --add-host=host.docker.internal:host-gateway -t futsal-web .
```

Run image
```
docker run -d --name futsal-web-container -p 3001:3001 futsal-web
```

## Using Compose File

```
docker compose up --build
```