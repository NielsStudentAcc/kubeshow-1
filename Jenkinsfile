pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                 sh 'make build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                
                sh 'kubectl set image deployment.v1.apps/api-deployment api=gcr.io/kubeshow-224810/api --record'
                sh 'kubectl set image deployment.v1.apps/game-deployment game=gcr.io/kubeshow-224810/game --record'
                sh 'kubectl set image deployment.v1.apps/admin-deployment admin=gcr.io/kubeshow-224810/admin --record'
                sh 'kubectl set image deployment.v1.apps/api-deployment api=gcr.io/kubeshow-224810/api:latest --record'
                sh 'kubectl set image deployment.v1.apps/game-deployment game=gcr.io/kubeshow-224810/game:latest --record'
                sh 'kubectl set image deployment.v1.apps/admin-deployment admin=gcr.io/kubeshow-224810/admin:latest --record'
                sh 'kubectl apply -f https://raw.githubusercontent.com/NielsKuip/whack_a_pod/master/apps/admin/kubernetes/admin-deployment.yaml'
                sh 'kubectl apply -f https://raw.githubusercontent.com/NielsKuip/whack_a_pod/master/apps/game/kubernetes/game-deployment.yaml'
                sh 'kubectl apply -f https://raw.githubusercontent.com/NielsKuip/whack_a_pod/master/apps/api/kubernetes/api-deployment.yaml'
                
      
            }
        }
    }
}
