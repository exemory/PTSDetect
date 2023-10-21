using AppAny.HotChocolate.FluentValidation;
using Application.Common.Exceptions;
using Application.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace Application.Features.Auth;

public record RegisterUserInput(
    string Username,
    string Email,
    string Password,
    string? Firstname,
    string? Lastname,
    DateOnly Birthdate,
    Sex Sex,
    bool IsMarried);

public class RegisterUserInputValidator : AbstractValidator<RegisterUserInput>
{
    public RegisterUserInputValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty()
            .MaximumLength(20);
        RuleFor(x => x.Email)
            .NotNull()
            .EmailAddress();
        RuleFor(x => x.Password)
            .NotEmpty();
        RuleFor(x => x.Firstname)
            .Length(1, 100);
        RuleFor(x => x.Lastname)
            .Length(1, 100);
        RuleFor(x => x.Birthdate)
            .NotEmpty()
            .InclusiveBetween(new DateOnly(1990, 1, 1), DateOnly.FromDateTime(DateTime.Today));
        RuleFor(x => x.Sex)
            .IsInEnum();
    }
}

public class RegisterUserMutation
{
    [Error(typeof(RegistrationFailedException))]
    public async Task<RegisteredUserInfo> RegisterUser(
        [Service] UserManager<ApplicationUser> userManager,
        [UseFluentValidation] RegisterUserInput input)
    {
        var user = new ApplicationUser(input.Username, input.Email)
        {
            UserInfo = new UserInfo
            {
                FirstName = input.Firstname,
                LastName = input.Lastname,
                Birthdate = input.Birthdate,
                Sex = input.Sex,
                IsMarried = input.IsMarried
            }
        };

        var result = await userManager.CreateAsync(user, input.Password);

        if (!result.Succeeded)
        {
            throw new RegistrationFailedException(result.Errors);
        }

        return new RegisteredUserInfo(user.UserName!, user.Email!);
    }
}

public record RegisteredUserInfo(string Username, string Email);