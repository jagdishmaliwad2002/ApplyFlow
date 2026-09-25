# ApplyFlow - Project Status

## Current Status
ApplyFlow is deployed on AWS EC2 using Docker Compose.

## Architecture

Internet
  ↓
myapplyflow.site
  ↓
Nginx Frontend Container
  ↓ /api
Node.js Backend Container
  ↓
MongoDB Container

Frontend: Nginx
Backend: Node.js + Express
Database: MongoDB
Container platform: Docker Compose
Cloud: AWS EC2
Container registry: Amazon ECR
CI/CD: Jenkins
Domain: myapplyflow.site
SSL: Let's Encrypt

## AWS

Application EC2:
Private IP: 172.31.1.75
Elastic IP: 52.4.188.94

Jenkins EC2:
Private IP: 172.31.1.86

AWS Region:
us-east-1

## Production Containers

Frontend:
ECR image:
629229067219.dkr.ecr.us-east-1.amazonaws.com/applyflow-frontend:<BUILD_NUMBER>

Backend:
ECR image:
629229067219.dkr.ecr.us-east-1.amazonaws.com/applyflow-backend:<BUILD_NUMBER>

MongoDB:
mongo:7

Frontend public ports:
80
443

Backend:
5000 internal only

MongoDB:
27017 internal only

## HTTPS

Domain:
https://myapplyflow.site

HTTP redirects to HTTPS.

Let's Encrypt certificate:
myapplyflow.site
www.myapplyflow.site

## CI/CD

Jenkins job:
ApplyFlow-CI-CD-PROD

Current successful build:
#13

Pipeline:

Checkout
→ Validate
→ Build Backend
→ Build Frontend
→ ECR Login
→ Tag Images
→ Push Images
→ Deploy to Application EC2
→ HTTPS Health Check

Build #13 successfully deployed:

Backend: :13
Frontend: :13

Health check:

curl -f -s https://myapplyflow.site/api/health

Result:

{"status":"OK","message":"ApplyFlow API is running","database":"connected"}

## Completed

- Docker frontend
- Docker backend
- MongoDB container
- Docker Compose
- Persistent MongoDB storage
- Persistent CV uploads
- AWS EC2
- ECR
- IAM role
- Jenkins
- Jenkins SSH deployment
- CI/CD
- Versioned ECR images
- Domain
- DNS
- HTTPS
- HTTP → HTTPS redirect
- Production API health check

## NOT YET COMPLETED

1. End-to-end real application submission test
2. Automated unit/API tests
3. Trivy security scanning
4. Rollback mechanism
5. MongoDB authentication
6. Backup/recovery
7. SSL renewal reload automation
8. Monitoring
9. Centralized/log rotation
10. SSH deployment key rotation
11. Jenkins Docker credential security
12. Pipeline approval strategy
13. Production smoke tests
14. Docker BuildKit/buildx

## Next Task

Do NOT rebuild the existing pipeline.

Upgrade the existing Jenkins pipeline one stage at a time.

First:
Test a real application submission through HTTPS, including CV upload, MongoDB storage and persistent upload storage.

Then:
Add automated tests.

Then:
Add Trivy.

Then:
Add rollback.

Then:
Add backup/security/monitoring.

## Important

Never expose or request private SSH keys.

Do not replace the existing working production configuration unless necessary.

Verify each change before moving to the next step.
