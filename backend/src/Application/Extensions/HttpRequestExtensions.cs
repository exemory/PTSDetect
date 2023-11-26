using Application.Common.Constants;
using Microsoft.AspNetCore.Http;

namespace Application.Extensions;

public static class HttpRequestExtensions
{
    public static string? GetRefreshToken(this HttpRequest request)
        => request.Cookies[Cookies.RefreshToken];
}