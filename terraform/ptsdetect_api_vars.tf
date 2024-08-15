variable "ptsdetect_api_image_name" {
}

variable "ptsdetect_api_image_registry_url" {
  default = "https://index.docker.io"
}



variable "ptsdetect_api_env_ASPNETCORE_ENVIRONMENT" {
}

variable "ptsdetect_api_env_ASPNETCORE_URLS" {
}

variable "ptsdetect_api_env_EmailOptions__ServiceEmail" {
}

variable "ptsdetect_api_env_JwtOptions__Audience" {
}

variable "ptsdetect_api_env_JwtOptions__Auth__Secret" {
  sensitive = true
}

variable "ptsdetect_api_env_JwtOptions__Issuer" {
}

variable "ptsdetect_api_env_JwtOptions__Refresh__Secret" {
  sensitive = true
}

variable "ptsdetect_api_env_MongoDbOptions__AppDatabaseName" {
}

variable "ptsdetect_api_env_MongoDbOptions__ConnectionString" {
  sensitive = true
}

variable "ptsdetect_api_env_SendGridOptions__ApiKey" {
  sensitive = true
}

variable "ptsdetect_api_env_SendGridOptions__ResetPasswordTemplateId" {
}

variable "ptsdetect_api_env_SendGridOptions__VerifyEmailTemplateId" {
}
