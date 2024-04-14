variable "resource_location" {
  description = "The Azure region where resources will be deployed."
}

variable "resource_group_name" {
  description = "The name of the Azure resource group."
  default     = "ptsdetect"
}

variable "storage_account_name" {
  description = "The name of the Azure storage account."
}
