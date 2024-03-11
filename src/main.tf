provider "aws" {
  region  = "ap-northeast-1"
  profile = "k2works-poc-202402"
}

resource "aws_instance" "example" {
  ami           = "ami-039e8f15ccb15368a"
  instance_type = "t2.micro"

  tags = {
    Name = "terraform-example"
  }
}
