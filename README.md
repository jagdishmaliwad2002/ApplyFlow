# ApplyFlow

A simple dynamic job application system built with a separate frontend, backend API, and MongoDB database.

## Architecture

```text
                    Internet
                       │
                       ▼
                ┌───────────────┐
                │   Frontend    │
                │     Nginx     │
                │ Docker        │
                │ Port 80       │
                └───────┬───────┘
                        │
                     /api
                        │
                        ▼
                ┌───────────────┐
                │    Backend    │
                │ Node.js       │
                │ Express       │
                │ Docker        │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │    MongoDB    │
                │ Docker        │
                └───────────────┘
```

## Features

* Applicant name
* Date of birth
* Phone number
* Gender
* CV upload
* Message
* REST API
* MongoDB database
* CV persistent storage
* Health-check API
* Docker containers
* Docker Compose
* Nginx reverse proxy

## Project Structure

```text
applyflow/
│
├── data/
│   ├── mongodb/
│   │   └── .gitkeep
│   │
│   └── uploads/
│       └── .gitkeep
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── .env
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Technologies

* HTML
* CSS
* JavaScript
* Nginx
* Node.js
* Express.js
* MongoDB
* Docker
* Docker Compose
* AWS EC2

## API Endpoints

### Health Check

```text
GET /api/health
```

### Create Application

```text
POST /api/applications
```

Form fields:

```text
name
dob
phone
gender
cv
message
```

### Get Applications

```text
GET /api/applications
```

### Get Application

```text
GET /api/applications/:id
```

### Delete Application

```text
DELETE /api/applications/:id
```

## Run Locally

Clone the repository:

```bash
git clone <YOUR-GITHUB-REPOSITORY>
cd applyflow
```

Create the data directories:

```bash
mkdir -p data/mongodb
mkdir -p data/uploads
```

Create the environment file:

```bash
cp .env.example .env
```

Build and start the containers:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

Open:

```text
http://localhost
```

## Stop Application

```bash
docker compose down
```

## Stop and Remove Database Container

```bash
docker compose down
```

The MongoDB data remains in:

```text
data/mongodb/
```

CV files remain in:

```text
data/uploads/
```

## AWS EC2 Deployment

Launch an Ubuntu EC2 instance and install Docker and Docker Compose.

Clone the project:

```bash
git clone <YOUR-GITHUB-REPOSITORY>
cd applyflow
```

Create the data directories:

```bash
mkdir -p data/mongodb
mkdir -p data/uploads
```

Start the application:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
```

Access the application:

```text
http://<EC2-PUBLIC-IP>
```

## Security Group

Allow:

```text
22   SSH
80   HTTP
443  HTTPS
```

Do not expose:

```text
27017 MongoDB
5000  Backend
```

MongoDB and the backend communicate internally through the Docker network.

## Data Persistence

MongoDB data:

```text
./data/mongodb:/data/db
```

CV uploads:

```text
./data/uploads:/app/uploads
```

This means recreating the containers does not remove the application data.

## Future Improvements

* HTTPS with Let's Encrypt
* AWS S3 for CV storage
* GitHub Actions CI/CD
* MongoDB Atlas
* Application monitoring
* Docker image registry
* AWS Load Balancer
