terraform {
  required_version = ">= 1.0.0, < 2.0.0"

  backend "s3" {
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

module "var" {
  source = "../../../global/variables"
}

module "mysql" {
  source = "../../../../modules/data-source/mysql"

  identifier_prefix = local.db_prefix
  db_name           = local.db_name
  db_username       = var.use_cred ? local.db_cred.username : var.db_username
  db_password       = var.use_cred ? local.db_cred.password : var.db_password
}

data "aws_secretsmanager_secret_version" "creds" {
  secret_id = "db-creds"
}

locals {
  db_prefix = var.integration_test ? "${module.var.app_name}-${module.var.generation}-${module.var.env.test}" : "${module.var.app_name}-${module.var.generation}-${module.var.env.stage}"
  db_name   = var.integration_test ? "${var.db_name}_${module.var.env.test}" : "${module.var.db_name}_${module.var.env.stage}"
  db_cred   = jsondecode(data.aws_secretsmanager_secret_version.creds.secret_string)
}

