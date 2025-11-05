# SmartSpirit Project - Docker Hub Deployment Guide

You can run this project **without building it on your computer** by using the ready-made images directly from Docker Hub.

Follow the steps below:

---

## Requirements

- [Docker](https://www.docker.com/products/docker-desktop) must be installed

---

## 1. Quick Start: Docker Pull and Run

### Running the Backend (Spring Boot) Service

```sh
docker pull semaozylmz/smartspirit-backend:latest
docker run -d -p 8080:8080 --name smartspirit-backend semaozylmz/smartspirit-backend:latest
```
The backend service is now accessible at http://localhost:8080.

---

### Running the Frontend (React) Service

```sh
docker pull semaozylmz/smartspirit-frontend:latest
docker run -d -p 3000:80 --name smartspirit-frontend semaozylmz/smartspirit-frontend:latest
```
The frontend interface is now accessible at http://localhost:3000.

---

## 2. Running All Services Together with docker-compose

In your terminal, run:
```sh
docker-compose pull        # Pulls all images from Docker Hub
docker-compose up -d       # Starts all services
```

---

## 3. Accessing the Services

- Backend: http://localhost:8080

- Frontend: http://localhost:3000

---

## 4. Stopping the Services

To stop them individually:
```sh
docker stop smartspirit-backend smartspirit-frontend smartspirit-db
```
or if you used docker-compose:
```sh
docker-compose down
```

---

## Auto-Generated Admin User

An admin user is automatically created in the system with the following credentials:

Username: admin

Password: 12345678

Role: Admin

You can log in using this information for the first time.

---

## Notes

- You do not need to clone or build the code; all images will be pulled from Docker Hub.

- You can follow the same steps regardless of whether you are on a server or a local machine.

... by Nora
