terraform {
  backend "s3" {
    key     = "prod/services/webserver-cluster/terraform.tfstate"
    profile = "k2works-poc-202402"
  }
}

provider "aws" {
  region  = "ap-northeast-1"
  profile = "k2works-poc-202402"
}

module "webserver-cluster" {
  source = "../../../modules/services/webserver-cluster"
}