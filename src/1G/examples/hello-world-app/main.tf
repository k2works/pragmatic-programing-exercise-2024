provider "aws" {
  region = "ap-northeast-1"
}

module "hello_world_app" {
  source = "../../modules/services/hello-world-app"

  server_text = var.server_text

  environment = var.environment

  mysql_config = var.mysql_config

  instance_type      = "t2.micro"
  min_size           = 2
  max_size           = 2
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
