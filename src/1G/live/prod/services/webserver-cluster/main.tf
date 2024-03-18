terraform {
  backend "s3" {
    key = "prod/services/webserver-cluster/terraform.tfstate"
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

module "webserver-cluster" {
  source = "../../../../modules/services/hello-world-app"

  ami                    = "ami-039e8f15ccb15368a"
  server_text            = "New server text"
  cluster_name           = "webservers-prod"
  db_remote_state_bucket = "k2works-poc-202402-terraform-state"
  db_remote_state_key    = "stage/data-stores/mysql/terraform.tfstate"
  instance_type          = "t2.micro"
  max_size               = 2
  min_size               = 2
  enable_autoscaling     = true

  custom_tags = {
    Owner      = "team-foo"
    DeployedBy = "terraform"
  }
}
