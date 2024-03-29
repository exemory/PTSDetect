﻿namespace Application.Primitives;

public interface IDocument<TKey> where TKey : IEquatable<TKey>
{
    TKey Id { get; set; }
    int Version { get; set; }
}