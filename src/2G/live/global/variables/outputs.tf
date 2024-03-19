output "project" {
  value = var.project
}

output "generation" {
  value = var.generation
}

output "region" {
  value = var.region
}

output "project_name" {
  value       = "${var.project}-${var.generation}"
  description = "The name of the project"
}

output "app_name" {
  value       = var.app
  description = "The name of the app"
}

output "db_prefix" {
  value       = var.db
  description = "The prefix of the database"
}

output "db_name" {
  value       = var.db
  description = "The name of the database"
}

output "env" {
  value       = var.environments
  description = "The environments"
}

output "remote_state_bucket" {
  value       = "${var.project}-${var.generation}-terraform-state"
  description = "The name of the bucket for the remote state"
}

output "db_remote_state_key" {
  value       = "data-stores/mysql/terraform.tfstate"
  description = "The name of the key for the remote state"
}