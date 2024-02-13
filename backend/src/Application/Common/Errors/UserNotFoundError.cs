using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class UserNotFoundError : Error
{
    public static UserNotFoundError ByEmail(string email)
    {
        var data = new Dictionary<string, string>
        {
            ["email"] = email
        };
        
        return new UserNotFoundError($"User with email {email} is not found", data);
    }

    public static UserNotFoundError ById(string id)
    {
        var data = new Dictionary<string, string>
        {
            ["id"] = id
        };
        
        return new UserNotFoundError($"User with id {id} is not found", data);
    }

    public UserNotFoundError(string message) 
        : this(message, Enumerable.Empty<KeyValuePair<string, string>>())
    {
    }
    
    public UserNotFoundError(string message, IEnumerable<KeyValuePair<string, string>> data)
        : base(message)
    {
        Data = new Dictionary<string, string>(data).AsReadOnly();
    }

    public IReadOnlyDictionary<string, string> Data { get; }
}