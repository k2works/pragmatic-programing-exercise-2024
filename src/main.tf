provider "aws" {
  region  = "ap-northeast-1"
  profile = "k2works-poc-202402"
}

resource "aws_instance" "example" {
  ami           = "ami-039e8f15ccb15368a"
  instance_type = "t2.micro"

  user_data = <<-EOF
                #!/bin/bash
                echo "Hello, World" > index.html
                nohup python3 -m http.server 8080 &
                EOF

  user_data_replace_on_change = true

  tags = {
    Name = "terraform-example"
  }
}

resource "aws_security_group" "instance" {
  name_prefix = "terraform-example-instance"
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}