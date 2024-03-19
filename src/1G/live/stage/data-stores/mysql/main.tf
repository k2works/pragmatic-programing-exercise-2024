terraform {
  required_version = ">= 1.0.0, < 2.0.0"

  backend "s3" {
    # bucket         = "k2works-poc-202402-terraform-state"
    # key            = "stage/data-stores/mysql/terraform.tfstate"
    # region         = "ap-northeast-1"
    # dynamodb_table = "k2works-poc-202402-terraform-state-locks"
    # encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"
}

module "mysql" {
  source = "../../../../modules/data-source/mysql"

  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password
}

data "aws_secretsmanager_secret_version" "creds" {
  secret_id = "db-creds"
}

locals {
  db_cred = jsondecode(data.aws_secretsmanager_secret_version.creds.secret_string)
}

