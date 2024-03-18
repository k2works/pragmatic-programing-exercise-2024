bucket = "k2works-poc-202402-terraform-state"
region  = "ap-northeast-1"
key = "stage/services/webserver-cluster/terraform.tfstate"
dynamodb_table = "k2works-poc-202402-terraform-state-locks"
encrypt = true
