// =============================================================================
// Jenkinsfile for Off The Screen 2 CI/CD Pipeline
// =============================================================================

pipeline {
    agent any

    options {
        timeout(time: 60, unit: 'MINUTES')
        disableResume()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        DOCKER_BUILDKIT = '1'
        BE_IMAGE_2 = 'off-be-2:latest'
        FE_IMAGE_2 = 'off-fe-2:latest'
        DATABASE_URL = credentials('POSTGRES_BASE_URL')
        PUBLIC_DATA_API_KEY = credentials('PUBLIC_DATA_API_KEY')
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
                sh 'git log --oneline -3'
            }
        }


        stage('Build Frontend 2') {
            steps {
                retry(2) {
                    sh '''
                        echo "Building Frontend 2..."
                        docker build \
                            --build-arg VITE_API_URL=https://off-toss.eekky.com/api \
                            --build-arg VITE_GOOGLE_MAPS_KEY=AIzaSyB_7fgirj-R6DRUcYhy1VF30wAtK2_HiHY \
                            --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB_7fgirj-R6DRUcYhy1VF30wAtK2_HiHY \
                            --build-arg VITE_GOOGLE_CLIENT_ID=971714018482-04vb86gts4kntmhrvt18en861ua5fe57.apps.googleusercontent.com \
                            --build-arg VITE_FILE_SERVICE_URL=https://file.eekky.com \
                            -t ${FE_IMAGE_2} -f Off_sol/Dockerfile Off_sol/
                    '''
                }
            }
            post {
                failure {
                    sh 'docker logs off-fe-2 2>&1 || true'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    echo "Deploying Stack 2 (Frontend Only)..."
                    # Force remove existing Stack 2 Frontend
                    docker rm -f off-fe-2 || true
                    
                    # Start only Stack 2 Frontend
                    docker compose up -d off-fe-2
                    sleep 10
                    docker compose ps
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Health Check for Stack 2 (Frontend Only)..."

                    # Frontend 2 health check
                    echo "Checking Frontend 2..."
                    for i in $(seq 1 12); do
                        if docker exec off-fe-2 wget --spider -q http://localhost:80; then
                            echo "Frontend 2 is healthy!"
                            break
                        fi
                        echo "Waiting for frontend 2... ($i/12)"
                        sleep 5
                    done

                    # Final Status Check
                    echo ""
                    echo "Final status check..."
                    docker compose ps

                    FE_2_RUNNING=$(docker inspect --format='{{.State.Running}}' off-fe-2 2>/dev/null || echo "false")
                    echo "Frontend 2 running: $FE_2_RUNNING"

                    if [ "$FE_2_RUNNING" = "true" ]; then
                        echo "Stack 2 Frontend is operational!"
                        exit 0
                    else
                        echo "Stack 2 Check Failed: FE2=$FE_2_RUNNING"
                        exit 1
                    fi
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                    echo "Cleanup..."
                    docker image prune -f || true
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose ps 2>/dev/null || true'
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            sh '''
                echo "=== Backend Logs ==="
                docker logs off-be --tail=100 2>&1 || true
                echo ""
                echo "=== Frontend Logs ==="
                docker logs off-fe --tail=50 2>&1 || true
            '''
        }
    }
}
