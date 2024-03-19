output "asg_name" {
  value       = aws_autoscaling_group.example.name
  description = "The name of Autoscaling group"
}

output "instance_security_group_id" {
  value       = aws_security_group.instance.id
  description = "The ID of the EC2 instance Security Group"
}