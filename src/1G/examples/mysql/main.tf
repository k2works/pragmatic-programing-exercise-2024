provider "aws" {
  region = "ap-northeast-1"
}

module "mysql" {
  source = "../../modules/data-source/mysql"

  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password
}

