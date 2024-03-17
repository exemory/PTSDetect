output "azurerm_storage_account_connection_string" {
  value     = azurerm_storage_account.default.primary_connection_string
  sensitive = true
}

data "kubernetes_service" "default" {
  metadata {
    name = azurerm_kubernetes_cluster.default.name
  }
}

output "load_balancer_ip" {
  description = "The IP address of the Load Balancer"
  value       = data.kubernetes_service.default.spec[0]["load_balancer_ip"]
}
