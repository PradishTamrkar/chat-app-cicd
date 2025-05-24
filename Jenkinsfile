pipeline {
    agent any

    environment {
        scannerHome = tool 'sonar7.0' // Must be defined in Jenkins Global Tool Configuration
        NODE_ENV = 'development'
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
                sh 'docker build -t chat-app:latest ./server'
            }
        }

        stage('Push to Local Registry') {
            steps {
                echo 'Pushing image to local Docker registry...'
                sh '''
                    docker tag chat-app:latest localhost:5000/chat-app:latest
                    docker push localhost:5000/chat-app:latest
                '''
            }
        }
    }
}
