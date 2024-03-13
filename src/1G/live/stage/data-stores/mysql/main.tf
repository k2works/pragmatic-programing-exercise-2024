terraform {
  backend "s3" {
    bucket         = "k2works-poc-202402-terraform-state"
    key            = "stage/data-stores/mysql/terraform.tfstate"
    region         = "ap-northeast-1"
    dynamodb_table = "k2works-poc-202402-terraform-state-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

locals {
  db_cred = jsondecode(data.aws_secretsmanager_secret_version.creds.secret_string)
}

resource "aws_db_instance" "example" {
  identifier_prefix   = "terraform-up-and-running"
  engine              = "mysql"
  allocated_storage   = 10
  instance_class      = "db.t2.micro"
  skip_final_snapshot = true
  db_name             = "example_database"

  username = local.db_cred.username
  password = local.db_cred.password
}

data "aws_secretsmanager_secret_version" "creds" {
  secret_id = "db-creds"
}