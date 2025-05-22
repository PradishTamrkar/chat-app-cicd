pipeline {
    agent any

    environment {
        scannerHome = tool 'sonar7.0'
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
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube Analysis...'
                withSonarQubeEnv('sonar') {
                    dir('server') {
                        sh '''${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=chat-app \
                          -Dsonar.projectName=chat-app \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=node_modules/** \
                          -Dsonar.tests=. \
                          -Dsonar.test.inclusions=**/*.test.js \
                          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info'''
                    }
                }
            }
        }

        stage("Build Docker Image") {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t chat-app:latest ./server'
            }
        }

        stage("Push to Local Registry") {
            steps {
                echo 'Pushing image to local Docker registry...'
                sh '''
                docker tag chat-app:latest localhost:5000/chat-app:latest
                docker push localhost:5000/chat-app:latest
                '''
            }pipeline {
    agent any

    environment {
        scannerHome = tool 'sonar7.0'
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
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube Analysis...'
                withSonarQubeEnv('sonar') {
                    dir('server') {
                        sh '''${scannerHome}/bin/sonar-scanner \
                          -Dsonar.projectKey=chat-app \
                          -Dsonar.projectName=chat-app \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=node_modules/** \
                          -Dsonar.tests=. \
                          -Dsonar.test.inclusions=**/*.test.js \
                          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info'''
                    }
                }
            }
        }

        stage("Build Docker Image") {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t chat-app:latest ./server'
            }
        }

        stage("Push to Local Registry") {
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

        }
    }
}

