# Configure the Azure provider
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "default" {
  name     = var.resource_group_name
  location = var.resource_location
}

resource "azurerm_storage_account" "default" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.default.name
  location                 = azurerm_resource_group.default.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["PUT"]
      allowed_origins    = [var.ptsdetect_frontend_url]
      exposed_headers    = [""]
      max_age_in_seconds = 3600
    }
  }
}

resource "azurerm_storage_container" "user_avatars" {
  name                  = "user-avatars"
  storage_account_name  = azurerm_storage_account.default.name
  container_access_type = "private"
}

resource "azurerm_service_plan" "default" {
  name                = "ptsdetect-asp"
  location            = azurerm_resource_group.default.location
  resource_group_name = azurerm_resource_group.default.name
  os_type             = "Linux"
  sku_name            = "F1"
}

resource "azurerm_linux_web_app" "ptsdetect-api-web-app" {
  name                = "ptsdetect-api"
  location            = azurerm_service_plan.default.location
  resource_group_name = azurerm_resource_group.default.name
  service_plan_id     = azurerm_service_plan.default.id
  https_only          = true

  site_config {
    always_on = false

    application_stack {
      docker_image_name   = var.ptsdetect_api_image_name
      docker_registry_url = var.ptsdetect_api_image_registry_url
    }
  }

  app_settings = {
    ASPNETCORE_ENVIRONMENT                   = var.ptsdetect_api_env_ASPNETCORE_ENVIRONMENT
    ASPNETCORE_URLS                          = var.ptsdetect_api_env_ASPNETCORE_URLS
    EmailOptions__ServiceEmail               = var.ptsdetect_api_env_EmailOptions__ServiceEmail
    FrontendOptions__BaseUrl                 = var.ptsdetect_frontend_url
    JwtOptions__Issuer                       = var.ptsdetect_api_env_JwtOptions__Issuer
    JwtOptions__Audience                     = var.ptsdetect_api_env_JwtOptions__Audience
    JwtOptions__Auth__Secret                 = var.ptsdetect_api_env_JwtOptions__Auth__Secret
    JwtOptions__Refresh__Secret              = var.ptsdetect_api_env_JwtOptions__Refresh__Secret
    CorsOptions__AllowedOrigins__0           = var.ptsdetect_frontend_url
    MongoDbOptions__AppDatabaseName          = var.ptsdetect_api_env_MongoDbOptions__AppDatabaseName
    MongoDbOptions__ConnectionString         = var.ptsdetect_api_env_MongoDbOptions__ConnectionString
    AzureStorageOptions__ConnectionString    = azurerm_storage_account.default.primary_connection_string
    SendGridOptions__ApiKey                  = var.ptsdetect_api_env_SendGridOptions__ApiKey
    SendGridOptions__ResetPasswordTemplateId = var.ptsdetect_api_env_SendGridOptions__ResetPasswordTemplateId
    SendGridOptions__VerifyEmailTemplateId   = var.ptsdetect_api_env_SendGridOptions__VerifyEmailTemplateId
  }
}
