terraform {
  backend "s3" {
    key     = "global/iam/terraform.tfstate"
    profile = "k2works-poc-202402"
  }
}

provider "aws" {
  region  = "ap-northeast-1"
  profile = "k2works-poc-202402"
}

resource "aws_iam_user" "example" {
  for_each = toset(var.user_names)
  name     = each.value
}