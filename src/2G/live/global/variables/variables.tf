variable "project" {
  description = "The name of the project"
  type        = string
  default     = "k2works-poc-202402"
}

variable "generation" {
  description = "The generation of the resources"
  type        = string
  default     = "2g"
}

variable "region" {
  description = "The region in which the resources will be deployed"
  type        = string
  default     = "us-central1"
}

variable "app" {
  description = "The name of the application"
  type        = string
  default     = "k2works-poc"
}

variable "db" {
  description = "The name of the database"
  type        = string
  default     = "k2works_poc"
}

variable "environments" {
  description = "The environments to deploy"
  type = object({
    test  = string
    dev   = string
    stage = string
    prod  = string
  })
  default = {
    test  = "test"
    dev   = "development"
    stage = "staging"
    prod  = "production"
  }
}