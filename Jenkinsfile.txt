pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ftd6299/bdsbusiness'
        DOCKER_TAG = 'latest'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Récupération du code...'
                checkout scm
            }
        }

        stage('Tests Unitaires') {
            steps {
                echo '🧪 Lancement des tests...'
                sh 'npm ci'
                sh 'npm test --if-present'
            }
        }

        stage('Qualité du code') {
            steps {
                echo '🔍 Analyse SonarQube...'
                echo 'SonarQube à configurer'
            }
        }

        stage('Build Docker') {
            steps {
                echo '🐳 Construction de l image Docker...'
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }

        stage('Scan Sécurité Trivy') {
            steps {
                echo '🔐 Scan de sécurité Trivy...'
                sh "trivy image --exit-code 0 --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }

        stage('Push Docker Hub') {
            steps {
                echo '📤 Push sur Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_TOKEN'
                )]) {
                    sh "docker login -u ${DOCKER_USER} -p ${DOCKER_TOKEN}"
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Déploiement') {
            steps {
                echo '🚀 Déploiement sur Kubernetes...'
                sh 'kubectl apply -f k8s/ --kubeconfig /etc/rancher/k3s/k3s.yaml'
            }
        }

    }

    post {
        success {
            echo '✅ Pipeline réussi ! App déployée avec succès.'
        }
        failure {
            echo '❌ Pipeline échoué ! Vérifiez les logs.'
        }
    }
}