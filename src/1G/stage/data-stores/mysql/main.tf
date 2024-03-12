terraform {
  backend "s3" {
    bucket = "k2works-poc-202402-terraform-state"
    key    = "stage/data-stores/mysql/terraform.tfstate"
    region  = "ap-northeast-1"
    dynamodb_table = "k2works-poc-202402-terraform-state-locks"
    encrypt = true
    profile = "k2works-poc-202402"
  }
}

provider "aws" {
  region  = "ap-northeast-1"
  profile = "k2works-poc-202402"
}

resource "aws_db_instance" "example" {
  identifier_prefix = "terraform-up-and-running"
  engine = "mysql"
  allocated_storage = 10
  instance_class = "db.t2.micro"
  skip_final_snapshot = true
  db_name = "example_database"

  username = var.db_username
  password = var.db_password
}
