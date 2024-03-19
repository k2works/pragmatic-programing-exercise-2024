variable "server_text" {
  description = "The text the web server should return"
  default     = "Hello, World"
  type        = string
}

variable "mysql_config" {
  description = "The config for the MySQL DB"

  type = object({
    address = string
    port    = number
  })

  default = {
    address = "mock-mysql-address"
    port    = 12345
  }
}

variable "integration_test" {
  description = "Whether to run integration tests"
  type        = bool
  default     = false
}

variable "app_name" {
  description = "The name of the app"
  type        = string
  default     = "mock-app"
}

variable "db_remote_state_bucket" {
  description = "The name of the S3 bucket for the database's remote state"
  type        = string
  default     = null
}

variable "db_remote_state_key" {
  description = "The path for the database's remote state in S3"
  type        = string
  default     = null
}
