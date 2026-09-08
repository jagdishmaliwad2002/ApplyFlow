pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate') {
            steps {
                sh '''
                    echo "Checking project structure..."

                    test -f docker-compose.yml
                    test -f backend/Dockerfile
                    test -f backend/package.json
                    test -f backend/server.js
                    test -f frontend/Dockerfile
                    test -f frontend/nginx.conf
                    test -f frontend/index.html

                    echo "Project validation passed."
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    ssh \
                    -i /var/lib/jenkins/.ssh/applyflow_deploy \
                    -o StrictHostKeyChecking=accept-new \
                    ubuntu@172.31.1.75 \
                    "cd ~/ApplyFlow && \
                     git pull origin main && \
                     docker compose up -d --build && \
                     docker compose ps"
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Waiting for ApplyFlow API..."

                    for i in {1..12}; do

                        if ssh \
                            -i /var/lib/jenkins/.ssh/applyflow_deploy \
                            -o StrictHostKeyChecking=accept-new \
                            ubuntu@172.31.1.75 \
                            "curl -f -s http://localhost/api/health"; then

                            echo
                            echo "Health check passed."
                            exit 0
                        fi

                        echo "API not ready yet. Waiting 5 seconds..."
                        sleep 5
                    done

                    echo "Health check failed."
                    exit 1
                '''
            }
        }
    }

    post {

        success {
            echo 'ApplyFlow deployment successful!'
        }

        failure {
            echo 'ApplyFlow deployment failed!'
        }
    }
}
