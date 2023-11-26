using HotChocolate.Language;

namespace Application.ScalarTypes;

public class Void : ScalarType
{
    public Void() : base("Void")
    {
        Description = "The Void scalar represents a non-return type.";
    }

    public override bool IsInstanceOfType(IValueNode valueSyntax)
        => valueSyntax is NullValueNode;

    public override object? ParseLiteral(IValueNode valueSyntax)
        => null;

    public override IValueNode ParseValue(object? runtimeValue)
        => new NullValueNode(null);

    public override IValueNode ParseResult(object? resultValue) =>
        new NullValueNode(null);

    public override bool TrySerialize(object? runtimeValue, out object? resultValue)
    {
        resultValue = null;
        return true;
    }

    public override bool TryDeserialize(object? resultValue, out object? runtimeValue)
    {
        runtimeValue = null;
        return true;
    }

    public override Type RuntimeType => typeof(void);
}