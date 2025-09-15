using System.Reflection;

namespace WebAPI.Options
{
  public class ProductInfo
  {
    public const string SectionName = "ProductInfo";

    public string Name { get; set; } = Assembly.GetExecutingAssembly().GetName().Name!;
    public string Version { get; set; } = Assembly.GetExecutingAssembly().GetName().Version?.ToString()!;
  }
}