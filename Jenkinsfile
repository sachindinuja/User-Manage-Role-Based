pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '25'))
    disableConcurrentBuilds()
  }

  environment {
    REGISTRY      = 'docker.io'
    NAMESPACE     = 'sachind01'                 // Docker Hub account
    FRONTEND_REPO = "${NAMESPACE}/sales-frontend"
    BACKEND_REPO  = "${NAMESPACE}/sales-backend"
    SIACAL_REPO   = "${NAMESPACE}/sales-sia-cal"

    IMAGE_TAG     = 'prod'                      // moving tag (no rollback)
    DEPLOY_PATH   = '/sales-pipeline'           // path on THIS VM
  }

  stages {
    stage('Checkout') {
      steps {
        deleteDir()
        checkout scm
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

    stage('Build & Push Images (parallel)') {
      parallel {
        stage('Frontend (Vite build)') {
          steps {
            withCredentials([file(credentialsId: 'frontend-env-file', variable: 'FRONTENV')]) {
              sh '''
                set -eu
                # Provide Vite env at build time
                install -m 600 "$FRONTENV" Frontend/.env.production

                DOCKER_BUILDKIT=1 docker build \
                  -t ${FRONTEND_REPO}:${IMAGE_TAG} \
                  -f Frontend/Dockerfile Frontend

                rm -f Frontend/.env.production || true
                docker push ${FRONTEND_REPO}:${IMAGE_TAG}
              '''
            }
          }
        }

        stage('Backend') {
          steps {
            sh '''
              set -eu
              DOCKER_BUILDKIT=1 docker build \
                -t ${BACKEND_REPO}:${IMAGE_TAG} \
                -f Backend/Dockerfile Backend

              docker push ${BACKEND_REPO}:${IMAGE_TAG}
            '''
          }
        }

        stage('SIA_Cal') {
          steps {
            sh '''
              set -eu
              DOCKER_BUILDKIT=1 docker build \
                -t ${SIACAL_REPO}:${IMAGE_TAG} \
                -f SIA_Cal/Dockerfile SIA_Cal

              docker push ${SIACAL_REPO}:${IMAGE_TAG}
            '''
          }
        }
      }
    }

    stage('Deploy (local VM)') {
      steps {
        withCredentials([
          usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
          file(credentialsId: 'backend-env-file',  variable: 'BACKEND_ENV_FILE')
        ]) {
          sh '''
            set -eu

            mkdir -p ${DEPLOY_PATH}/env

            # --- Backend.env from Jenkins secret file ---
            install -m 600 "$BACKEND_ENV_FILE" "${DEPLOY_PATH}/env/Backend.env"

            # Ensure DB defaults if absent
            add_or_default() {
              key="$1"; def="$2"; file="${DEPLOY_PATH}/env/Backend.env"
              grep -q "^${key}=" "$file" || echo "${key}=${def}" >> "$file"
            }
            add_or_default DB_NAME "SALES_INCENTIVE"
            add_or_default DB_USER "postgres"
            add_or_default DB_HOST "db"
            add_or_default DB_PORT "5432"

            # Create DB.env for Postgres from Backend.env values
            DB_NAME=$(  grep -E '^DB_NAME='      "${DEPLOY_PATH}/env/Backend.env" | tail -n1 | cut -d= -f2-)
            DB_USER=$(  grep -E '^DB_USER='      "${DEPLOY_PATH}/env/Backend.env" | tail -n1 | cut -d= -f2-)
            DB_PASS=$(  grep -E '^DB_PASSWORD='  "${DEPLOY_PATH}/env/Backend.env" | tail -n1 | cut -d= -f2- || true)

            install -m 600 /dev/null "${DEPLOY_PATH}/env/DB.env"
            cat > "${DEPLOY_PATH}/env/DB.env" <<EOF
POSTGRES_DB=${DB_NAME}
POSTGRES_USER=${DB_USER}
POSTGRES_PASSWORD=${DB_PASS}
EOF

            # Compose variable substitution (for image names/tags)
            install -m 600 /dev/null "${DEPLOY_PATH}/.deploy.env"
            cat > "${DEPLOY_PATH}/.deploy.env" <<EOF
NAMESPACE=${NAMESPACE}
IMAGE_TAG=${IMAGE_TAG}
EOF

            # Put compose in place
            install -m 644 docker-compose.yml "${DEPLOY_PATH}/docker-compose.yml"

            # Pull & run the moving 'prod' tag
            echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
            cd "${DEPLOY_PATH}"
            export $(cat .deploy.env | xargs)
            docker compose --env-file .deploy.env pull
            docker compose --env-file .deploy.env up -d --remove-orphans
            docker image prune -f
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
      cleanWs()
    }
  }
}
