terraform {
  backend "s3" {
    key     = "stage/services/webserver-cluster/terraform.tfstate"
    profile = "k2works-poc-202402"
  }
}

provider "aws" {
  region  = "ap-northeast-1"
  profile = "k2works-poc-202402"
}

module "webserver-cluster" {
  source                 = "../../../modules/services/webserver-cluster"
  cluster_name           = "webservers-stage"
  db_remote_state_bucket = "k2works-poc-202402-terraform-state"
  db_remote_state_key    = "stage/data-stores/mysql/terraform.tfstate"
  instance_type          = "t2.micro"
  max_size               = 2
  min_size               = 2
}

resource "aws_security_group_rule" "allow_http_inbound" {
  type              = "ingress"
  security_group_id = module.webserver-cluster.alb_security_group_id

  from_port   = 12345
  to_port     = 12345
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}
