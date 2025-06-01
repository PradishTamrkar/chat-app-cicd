pipeline {
    agent any

    environment {
        scannerHome = tool 'sonar7.0'
        NODE_ENV = 'development'
        HARBOR_URL = 'harbor.registry.local'
        HARBOR_PROJECT = 'devops_project'
        IMAGE_NAME = 'chat-app'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Unit Test') {
            steps {
                echo 'Running unit tests with Jest...'
                dir('server') {
                    sh 'npx jest --coverage --detectOpenHandles'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube Analysis...'
                withSonarQubeEnv('MySonarQube') {
                    dir('server') {
                        sh '''
                            ${scannerHome}/bin/sonar-scanner \
                              -Dsonar.projectKey=chat-app \
                              -Dsonar.projectName=chat-app \
                              -Dsonar.sources=. \
                              -Dsonar.exclusions=node_modules/** \
                              -Dsonar.tests=. \
                              -Dsonar.test.inclusions=**/*.test.js \
                              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Waiting for SonarQube quality gate result...'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh '''
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ./server
                '''
            }
        }

        stage('Push to Harbor Registry') {
            steps {
                echo 'Tagging and pushing Docker image to Harbor...'
                withCredentials([usernamePassword(credentialsId: 'harbor-creds', usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                    sh '''
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG}
                        echo $HARBOR_PASS | docker login ${HARBOR_URL} -u $HARBOR_USER --password-stdin
                        docker push ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:${IMAGE_TAG}
                    '''
                }
            }
        }
    }
}
