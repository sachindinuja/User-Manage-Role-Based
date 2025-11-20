This document describes the full CI/CD pipeline used to build, push, and deploy the following services:

backend
frontend
sia-cal
DB
Redis

📌 Project Structure

├── backend/
│ ├── Dockerfile
│ ├── .dockerignore
│ └── src/...
├── sia_cal/
│ ├── Dockerfile
│ ├── .dockerignore
│ └── src/...
├── frontend/
│ ├── Dockerfile
│ ├── .dockerignore
│ ├── nginx.conf
│ └── src/...
├── docker-compose.yml
├── Jenkinsfile
├── README.md

📌 Used caching layer for Redis

Developer pushes code → triggers webhook → Jenkins Pipeline starts → Build Docker images → Push to Docker Hub → Pull new images on VM
