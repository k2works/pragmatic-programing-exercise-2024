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

module "mysql" {
  source = "../../../../modules/data-source/mysql"

  db_name = "example_database"

  db_username = local.db_cred.username
  db_password = local.db_cred.password
}

data "aws_secretsmanager_secret_version" "creds" {
  secret_id = "db-creds"
}