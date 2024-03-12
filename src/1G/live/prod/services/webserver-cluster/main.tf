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
  source                 = "github.com/k2works/pragmatic-programing-exercise-2024//src/1G/modules/services/webserver-cluster?ref=v0.0.1"
  cluster_name           = "webservers-prod"
  db_remote_state_bucket = "k2works-poc-202402-terraform-state"
  db_remote_state_key    = "stage/data-stores/mysql/terraform.tfstate"
  instance_type          = "t2.micro"
  max_size               = 2
  min_size               = 2
}

resource "aws_autoscaling_schedule" "scale_out_during_business_hours" {
  scheduled_action_name = "scale-out-during-business-hours"
  min_size              = 2
  max_size              = 10
  desired_capacity      = 10
  recurrence            = "0 9 * * *"

  autoscaling_group_name = module.webserver-cluster.asg_name
}

resource "aws_autoscaling_schedule" "scale_in_at_night" {
  scheduled_action_name = "scale-in-at-night"
  min_size              = 2
  max_size              = 10
  desired_capacity      = 2
  recurrence            = "0 17 * * *"

  autoscaling_group_name = module.webserver-cluster.asg_name
}