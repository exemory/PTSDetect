﻿using Application.Common.Constants;
using Application.Common.Interfaces.Repositories;
using Application.Documents;
using Application.Infrastructure.Persistence.Interfaces;
using MongoDB.Driver;
using Answer = Application.Common.Models.Answer;
using Question = Application.Common.Models.Question;
using MongoDB.Driver.Linq;

namespace Application.Infrastructure.Persistence.Repositories;

public class TestRepository(IAppDbContext context) : ITestRepository
{
    public async Task<bool> CheckGeneralTestExistence(CancellationToken cancellationToken = default)
    {
        var filter = Builders<GeneralTest>.Filter
            .Eq(x => x.Id, GeneralTestIdentifiers.TestId);

        var count = await context
            .Tests<GeneralTest>()
            .CountDocumentsAsync(filter, new CountOptions { Limit = 1 },
                cancellationToken: cancellationToken);

        return count > 0;
    }

    public Task<GeneralTest> GetGeneralTest(CancellationToken cancellationToken = default)
    {
        var filterDefinition = Builders<GeneralTest>.Filter
            .Eq(x => x.Id, GeneralTestIdentifiers.TestId);

        return context
            .Tests<GeneralTest>()
            .Find(filterDefinition)
            .FirstAsync(cancellationToken: cancellationToken);
    }

    public async Task<IQueryable<Question>> GetGeneralTestQuestions(string languageCode,
        CancellationToken cancellationToken = default)
    {
        var test = await context
            .Tests<GeneralTest>()
            .AsQueryable()
            .FirstAsync(x => x.Id == GeneralTestIdentifiers.TestId, cancellationToken);

        return test.QuestionGroups
            .AsQueryable()
            .SelectMany(x =>
                x.Questions.Union(x.QuestionGroups.SelectMany(y => y.Questions)))
            .Select(x => new Question
            {
                Id = x.Id,
                Title = x.Translations[languageCode].Title,
                Answers = x.Answers
                    .Select(y => new Answer
                    {
                        Id = y.Id,
                        Title = y.Translations[languageCode].Title
                    })
                    .ToList()
            });
    }

    public Task SaveGeneralTest(GeneralTest test, CancellationToken cancellationToken = default)
    {
        var filterDefinition = Builders<GeneralTest>.Filter
            .Eq(x => x.Id, GeneralTestIdentifiers.TestId);

        return context
            .Tests<GeneralTest>()
            .ReplaceOneAsync(filterDefinition, test, cancellationToken: cancellationToken,
                options: new ReplaceOptions { IsUpsert = true });
    }
}