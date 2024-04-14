output "azurerm_storage_account_connection_string" {
  value     = azurerm_storage_account.default.primary_connection_string
  sensitive = true
}
