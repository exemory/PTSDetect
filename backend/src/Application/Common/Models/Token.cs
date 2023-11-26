namespace Application.Common.Models;

public record Token(string Value, DateTimeOffset ExpirationTime);

public record TokenPair(Token AccessToken, Token RefreshToken);