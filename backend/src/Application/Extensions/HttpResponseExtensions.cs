using Application.Common.Constants;
using Application.Common.Models;
using Microsoft.AspNetCore.Http;

namespace Application.Extensions;

public static class HttpResponseExtensions
{
    public static void AddRefreshToken(this HttpResponse httpResponse, Token refreshToken)
    {
        httpResponse.Cookies
            .Append(
                Cookies.RefreshToken,
                refreshToken.Value,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = refreshToken.ExpirationTime
                }
            );
    }
}