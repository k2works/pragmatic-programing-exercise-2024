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

module "hello_world_app" {
  source = "../../../../modules/services/hello-world-app"

  app_name               = local.app_name
  server_text            = var.server_text
  environment            = local.environment
  db_remote_state_bucket = local.db_remote_state_bucket
  db_remote_state_key    = local.db_remote_state_key
  //先にRDSを削除した場合はこちらを有効にしてdestroyする
  //mysql_config = var.mysql_config

  instance_type      = "t2.micro"
  max_size           = 2
  min_size           = 2
  enable_autoscaling = false
  ami                = data.aws_ami.amazonlinux.id
}

data "aws_ami" "amazonlinux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*"]
  }
}

locals {
  project_name           = module.var.project_name
  app_name               = module.var.app_name
  environment            = module.var.env.stage
  db_remote_state_bucket = module.var.remote_state_bucket
  db_remote_state_key    = "stage/${module.var.db_remote_state_key}"
}