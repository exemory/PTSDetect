using Application.Features.GeneralTest;
using Error = Application.Primitives.Error;

namespace Application.Common.Errors;

public class TestResultNotFoundError(Guid resultId)
    : Error($"Test result with id {resultId} is not found"), IGeneralTestResultErrorUnion;