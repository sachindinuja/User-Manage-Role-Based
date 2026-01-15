pipeline {
    agent any

    // Adds a parameter enter the email without hardcoding it in the script
    parameters {
        string(name: 'NOTIFICATION_EMAIL', defaultValue: '', description: 'Recipient email for build status alerts')
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '25'))
        disableConcurrentBuilds()
    }

    environment {
        REGISTRY      = 'docker.io'
        NAMESPACE     = 'sachind01'
        FRONTEND_REPO = "${NAMESPACE}/sales-frontend"
        BACKEND_REPO  = "${NAMESPACE}/sales-backend"
        SIACAL_REPO   = "${NAMESPACE}/sales-sia-cal"

        IMAGE_TAG     = 'prod'
        DEPLOY_PATH   = '/sales-pipeline'
        
        // References the parameter defined above
        RECIPIENT     = "${params.NOTIFICATION_EMAIL}"
    }

    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Static Code Analysis (SAST)') {
            steps {
                script {
                    def scannerHome = tool 'sonar-scanner'
                    withSonarQubeEnv('SonarQubeServer') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=Role-Base \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://74.225.193.42:9000 \
                            -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/Backend/migrations/**,**/SIA_Cal/venv/**,**/*.png,**/*.jpg
                        """
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                }
            }
        }

        stage('Build & Security Scan (parallel)') {
            parallel {
                stage('Frontend') {
                    steps {
                        withCredentials([file(credentialsId: 'frontend-env-file', variable: 'FRONTENV')]) {
                            sh '''
                                set -eu
                                install -m 600 "$FRONTENV" Frontend/.env.production
                                DOCKER_BUILDKIT=1 docker build -t ${FRONTEND_REPO}:${IMAGE_TAG} -f Frontend/Dockerfile Frontend
                                docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                    aquasec/trivy image --severity HIGH,CRITICAL --exit-code 0 ${FRONTEND_REPO}:${IMAGE_TAG}
                                docker push ${FRONTEND_REPO}:${IMAGE_TAG}
                            '''
                        }
                    }
                }

                stage('Backend') {
                    steps {
                        sh '''
                            set -eu
                            DOCKER_BUILDKIT=1 docker build -t ${BACKEND_REPO}:${IMAGE_TAG} -f Backend/Dockerfile Backend
                            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                aquasec/trivy image --severity HIGH,CRITICAL --exit-code 0 ${BACKEND_REPO}:${IMAGE_TAG}
                            docker push ${BACKEND_REPO}:${IMAGE_TAG}
                        '''
                    }
                }

                stage('Cal_Service') {
                    steps {
                        sh '''
                            set -eu
                            DOCKER_BUILDKIT=1 docker build -t ${SIACAL_REPO}:${IMAGE_TAG} -f SIA_Cal/Dockerfile SIA_Cal
                            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                aquasec/trivy image --severity HIGH,CRITICAL --exit-code 0 ${SIACAL_REPO}:${IMAGE_TAG}
                            docker push ${SIACAL_REPO}:${IMAGE_TAG}
                        '''
                    }
                }
            }
        }

        stage('Deploy on VM') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                    file(credentialsId: 'backend-env-file', variable: 'BACKEND_ENV_FILE')
                ]) {
                    sh '''
                        set -eu
                        mkdir -p ${DEPLOY_PATH}/env
                        install -m 600 "$BACKEND_ENV_FILE" "${DEPLOY_PATH}/env/Backend.env"

                        DB_NAME=$(grep -E '^DB_NAME=' "${DEPLOY_PATH}/env/Backend.env" | tail -n1 | cut -d= -f2-)
                        DB_USER=$(grep -E '^DB_USER=' "${DEPLOY_PATH}/env/Backend.env" | tail -n1 | cut -d= -f2-)
                        DB_PASS=$(grep -E '^DB_PASSWORD=' "${DEPLOY_PATH}/env/Backend.env" | tail -n1 | cut -d= -f2- || true)

                        cat > "${DEPLOY_PATH}/env/DB.env" <<EOF
POSTGRES_DB=${DB_NAME}
POSTGRES_USER=${DB_USER}
POSTGRES_PASSWORD=${DB_PASS}
EOF

                        cat > "${DEPLOY_PATH}/.deploy.env" <<EOF
NAMESPACE=${NAMESPACE}
IMAGE_TAG=${IMAGE_TAG}
EOF

                        install -m 644 docker-compose.yml "${DEPLOY_PATH}/docker-compose.yml"
                        
                        cd "${DEPLOY_PATH}"
                        docker compose --env-file .deploy.env pull
                        docker compose --env-file .deploy.env up -d --remove-orphans
                        docker image prune -f
                    '''
                }
            }
        }
    }

    post {
        success {
            script {
                // Sends SUCCESS email
                if (env.RECIPIENT) {
                    mail to: "${env.RECIPIENT}",
                         subject: "SUCCESS: ${env.JOB_NAME} Build #${env.BUILD_ID}",
                         body: "Deployment successful!\nProject: ${env.JOB_NAME}\nBuild URL: ${env.BUILD_URL}"
                }
            }
        }
        failure {
            script {
                // Sends FAILURE email
                if (env.RECIPIENT) {
                    mail to: "${env.RECIPIENT}",
                         subject: "FAILURE: ${env.JOB_NAME} Build #${env.BUILD_ID}",
                         body: "Pipeline failed at stage: ${env.STAGE_NAME}. Please check logs: ${env.BUILD_URL}"
                }
            }
        }
        always {
            script {
                sh 'docker logout || true'
                cleanWs()
            }
        }
    }
}