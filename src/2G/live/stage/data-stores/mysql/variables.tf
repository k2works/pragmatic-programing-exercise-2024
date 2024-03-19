variable "db_username" {
  description = "The password for the database"
  type        = string
  sensitive   = true
  default     = null
}

variable "db_password" {
  description = "The password for the database"
  type        = string
  sensitive   = true
  default     = null
}

variable "db_name" {
  description = "The name to use for the database"
  type        = string
  default     = "example_database_stage"
}

variable "use_cred" {
  description = "Use credentials"
  type        = bool
  default     = true
}

variable "integration_test" {
  description = "Whether to run integration tests"
  type        = bool
  default     = false
}
