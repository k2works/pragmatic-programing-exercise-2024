output "all_ars" {
  value = values(aws_iam_user.example)[*].arn
}

output "upper_names" {
  value = [for name in var.user_names : upper(name)]
}

output "bios" {
  value = [for name, role in var.hero_thousand_faces : "${name} is the ${role}"]
}

output "for_directive_index" {
  value = "%{for i, name in var.names}(${i}) ${name} %{endfor}"
}