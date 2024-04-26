/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Date` scalar represents an ISO-8601 compliant date type. */
  Date: { input: any; output: any; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
  /** The Void scalar represents a non-return type. */
  Void: { input: any; output: any; }
};

export type AdviceList = {
  __typename?: 'AdviceList';
  advices: Array<Scalars['String']['output']>;
  problem: Scalars['String']['output'];
};

export type AdviceListFilterInput = {
  advices?: InputMaybe<ListStringOperationFilterInput>;
  and?: InputMaybe<Array<AdviceListFilterInput>>;
  or?: InputMaybe<Array<AdviceListFilterInput>>;
  problem?: InputMaybe<StringOperationFilterInput>;
};

export type Answer = {
  __typename?: 'Answer';
  id: Scalars['UUID']['output'];
  title: Scalars['String']['output'];
};

export type AnswerMismatchError = Error & {
  __typename?: 'AnswerMismatchError';
  answerId: Scalars['UUID']['output'];
  message: Scalars['String']['output'];
  questionId: Scalars['UUID']['output'];
};

export type AnswerNotProvidedError = Error & {
  __typename?: 'AnswerNotProvidedError';
  message: Scalars['String']['output'];
  questionId: Scalars['UUID']['output'];
};

export type AnsweredQuestionInput = {
  answerId: Scalars['UUID']['input'];
  questionId: Scalars['UUID']['input'];
};

export type AnswersCountMismatchError = Error & {
  __typename?: 'AnswersCountMismatchError';
  message: Scalars['String']['output'];
  providedAnswersCount: Scalars['Int']['output'];
  testQuestionsCount: Scalars['Int']['output'];
};

export enum ApplyPolicy {
  AfterResolver = 'AFTER_RESOLVER',
  BeforeResolver = 'BEFORE_RESOLVER',
  Validation = 'VALIDATION'
}

export type AvatarNotFoundError = Error & {
  __typename?: 'AvatarNotFoundError';
  avatarId: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type EmailIsNotVerifiedError = Error & {
  __typename?: 'EmailIsNotVerifiedError';
  message: Scalars['String']['output'];
};

export type EmailVerificationFailedError = Error & {
  __typename?: 'EmailVerificationFailedError';
  errors: Array<KeyValuePairOfStringAndString>;
  errorsCount: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type Error = {
  message: Scalars['String']['output'];
};

export type GeneralTestQuestionsErrorUnion = ValidationError;

export type GeneralTestQuestionsInput = {
  languageCode: Scalars['String']['input'];
};

export type GeneralTestQuestionsPayload = {
  __typename?: 'GeneralTestQuestionsPayload';
  errors?: Maybe<Array<GeneralTestQuestionsErrorUnion>>;
  questions?: Maybe<QuestionsConnection>;
};


export type GeneralTestQuestionsPayloadQuestionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type GeneralTestResult = {
  __typename?: 'GeneralTestResult';
  adviceLists: Array<AdviceList>;
  completionDate: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  potentialProblems: Array<Scalars['String']['output']>;
};

export type GeneralTestResultError = TestResultNotFoundError | ValidationError;

export type GeneralTestResultFilterInput = {
  adviceLists?: InputMaybe<ListFilterInputTypeOfAdviceListFilterInput>;
  and?: InputMaybe<Array<GeneralTestResultFilterInput>>;
  completionDate?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<GeneralTestResultFilterInput>>;
  potentialProblems?: InputMaybe<ListStringOperationFilterInput>;
};

export type GeneralTestResultInput = {
  languageCode: Scalars['String']['input'];
  resultId: Scalars['UUID']['input'];
};

export type GeneralTestResultPayload = {
  __typename?: 'GeneralTestResultPayload';
  errors?: Maybe<Array<GeneralTestResultError>>;
  result?: Maybe<GeneralTestResult>;
};

export type GeneralTestResultSortInput = {
  completionDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
};

export type GeneralTestResultsError = ValidationError;

export type GeneralTestResultsPayload = {
  __typename?: 'GeneralTestResultsPayload';
  errors?: Maybe<Array<GeneralTestResultsError>>;
  results?: Maybe<ResultsConnection>;
};


export type GeneralTestResultsPayloadResultsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Array<GeneralTestResultSortInput>>;
  where?: InputMaybe<GeneralTestResultFilterInput>;
};

export type GetUploadAvatarUrlPayload = {
  __typename?: 'GetUploadAvatarUrlPayload';
  avatarId: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type GetUserAvatarUrlErrorUnion = AvatarNotFoundError | InternalServerError | UserDoesNotHaveAvatarError;

export type GetUserAvatarUrlPayload = {
  __typename?: 'GetUserAvatarUrlPayload';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<GetUserAvatarUrlErrorUnion>>;
};

export type InternalServerError = Error & {
  __typename?: 'InternalServerError';
  message: Scalars['String']['output'];
};

export type InvalidCredentialsError = Error & {
  __typename?: 'InvalidCredentialsError';
  message: Scalars['String']['output'];
};

export type InvalidRefreshTokenError = {
  __typename?: 'InvalidRefreshTokenError';
  message: Scalars['String']['output'];
};

export type IsEmailTakenErrorUnion = ValidationError;

export type IsEmailTakenInput = {
  email: Scalars['String']['input'];
};

export type IsEmailTakenPayload = {
  __typename?: 'IsEmailTakenPayload';
  errors?: Maybe<Array<IsEmailTakenErrorUnion>>;
  isEmailTaken?: Maybe<Scalars['Boolean']['output']>;
};

export type KeyValuePairOfStringAndString = {
  __typename?: 'KeyValuePairOfStringAndString';
  key: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ListFilterInputTypeOfAdviceListFilterInput = {
  all?: InputMaybe<AdviceListFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<AdviceListFilterInput>;
  some?: InputMaybe<AdviceListFilterInput>;
};

export type ListStringOperationFilterInput = {
  all?: InputMaybe<StringOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<StringOperationFilterInput>;
  some?: InputMaybe<StringOperationFilterInput>;
};

export type LoginError = EmailIsNotVerifiedError | InvalidCredentialsError | ValidationError;

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginPayload = {
  __typename?: 'LoginPayload';
  errors?: Maybe<Array<LoginError>>;
  token?: Maybe<Token>;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginPayload;
  refreshToken: RefreshTokenPayload;
  registerUser: RegisterUserPayload;
  requestPasswordReset: RequestPasswordResetPayload;
  resetPassword: ResetPasswordPayload;
  submitGeneralTestAnswers: SubmitGeneralTestAnswersPayload;
  updateUserAvatar: UpdateUserAvatarPayload;
  updateUserInfo: UpdateUserInfoPayload;
  verifyEmail: VerifyEmailPayload;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
};


export type MutationRequestPasswordResetArgs = {
  input: RequestPasswordResetInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSubmitGeneralTestAnswersArgs = {
  input: SubmitGeneralTestAnswersInput;
};


export type MutationUpdateUserAvatarArgs = {
  input: UpdateUserAvatarInput;
};


export type MutationUpdateUserInfoArgs = {
  input: UpdateUserInfoInput;
};


export type MutationVerifyEmailArgs = {
  input: VerifyEmailInput;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PersonalInfo = {
  __typename?: 'PersonalInfo';
  birthdate?: Maybe<Scalars['Date']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  isMarried?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  sex?: Maybe<Sex>;
};

export type PropertyValidationError = {
  __typename?: 'PropertyValidationError';
  errorCode: Scalars['String']['output'];
  errorMessage: Scalars['String']['output'];
  placeholders: Array<KeyValuePairOfStringAndString>;
  propertyName: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  generalTestQuestions: GeneralTestQuestionsPayload;
  generalTestResult: GeneralTestResultPayload;
  generalTestResults: GeneralTestResultsPayload;
  isEmailTaken: IsEmailTakenPayload;
  uploadAvatarUrl: GetUploadAvatarUrlPayload;
  userAvatar: GetUserAvatarUrlPayload;
  userInfo: UserInfo;
  verifyResetPasswordToken: ResetPasswordTokenVerificationPayload;
};


export type QueryGeneralTestQuestionsArgs = {
  input: GeneralTestQuestionsInput;
};


export type QueryGeneralTestResultArgs = {
  input: GeneralTestResultInput;
};


export type QueryGeneralTestResultsArgs = {
  input: GeneralTestQuestionsInput;
};


export type QueryIsEmailTakenArgs = {
  input: IsEmailTakenInput;
};


export type QueryVerifyResetPasswordTokenArgs = {
  input: VerifyResetPasswordTokenInput;
};

export type Question = {
  __typename?: 'Question';
  answers: Array<Answer>;
  id: Scalars['UUID']['output'];
  title: Scalars['String']['output'];
};

/** A connection to a list of items. */
export type QuestionsConnection = {
  __typename?: 'QuestionsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<QuestionsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Question>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type QuestionsEdge = {
  __typename?: 'QuestionsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Question;
};

export type RefreshTokenError = UserNotFoundError;

export type RefreshTokenPayload = {
  __typename?: 'RefreshTokenPayload';
  errors?: Maybe<Array<RefreshTokenError>>;
  token?: Maybe<Token>;
};

export type RegisterUserError = InternalServerError | RegistrationFailedError | ValidationError;

export type RegisterUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RegisterUserPayload = {
  __typename?: 'RegisterUserPayload';
  errors?: Maybe<Array<RegisterUserError>>;
  void?: Maybe<Scalars['Void']['output']>;
};

export type RegistrationFailedError = Error & {
  __typename?: 'RegistrationFailedError';
  errors: Array<KeyValuePairOfStringAndString>;
  errorsCount: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type RequestPasswordResetError = InternalServerError | UserNotFoundError | ValidationError;

export type RequestPasswordResetInput = {
  email: Scalars['String']['input'];
};

export type RequestPasswordResetPayload = {
  __typename?: 'RequestPasswordResetPayload';
  errors?: Maybe<Array<RequestPasswordResetError>>;
  void?: Maybe<Scalars['Void']['output']>;
};

export type ResetPasswordError = ResetPasswordFailedError | UserNotFoundError | ValidationError;

export type ResetPasswordFailedError = Error & {
  __typename?: 'ResetPasswordFailedError';
  errors: Array<KeyValuePairOfStringAndString>;
  errorsCount: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type ResetPasswordPayload = {
  __typename?: 'ResetPasswordPayload';
  errors?: Maybe<Array<ResetPasswordError>>;
  void?: Maybe<Scalars['Void']['output']>;
};

export type ResetPasswordTokenVerificationErrorUnion = ValidationError;

export type ResetPasswordTokenVerificationPayload = {
  __typename?: 'ResetPasswordTokenVerificationPayload';
  errors?: Maybe<Array<ResetPasswordTokenVerificationErrorUnion>>;
  isVerified?: Maybe<Scalars['Boolean']['output']>;
};

/** A connection to a list of items. */
export type ResultsConnection = {
  __typename?: 'ResultsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ResultsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<GeneralTestResult>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int']['output'];
};

/** An edge in a connection. */
export type ResultsEdge = {
  __typename?: 'ResultsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: GeneralTestResult;
};

export enum Sex {
  Female = 'FEMALE',
  Male = 'MALE'
}

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type SubmitGeneralTestAnswersError = AnswerMismatchError | AnswerNotProvidedError | AnswersCountMismatchError | ValidationError;

export type SubmitGeneralTestAnswersInput = {
  answers: Array<AnsweredQuestionInput>;
};

export type SubmitGeneralTestAnswersPayload = {
  __typename?: 'SubmitGeneralTestAnswersPayload';
  errors?: Maybe<Array<SubmitGeneralTestAnswersError>>;
  resultId?: Maybe<Scalars['UUID']['output']>;
};

export type TestResultNotFoundError = {
  __typename?: 'TestResultNotFoundError';
  message: Scalars['String']['output'];
};

export type Token = {
  __typename?: 'Token';
  expirationTime: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

export type UpdateUserAvatarError = AvatarNotFoundError | InternalServerError | ValidationError;

export type UpdateUserAvatarInput = {
  avatarId: Scalars['String']['input'];
};

export type UpdateUserAvatarPayload = {
  __typename?: 'UpdateUserAvatarPayload';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  errors?: Maybe<Array<UpdateUserAvatarError>>;
};

export type UpdateUserInfoError = InternalServerError | ValidationError;

export type UpdateUserInfoInput = {
  birthdate?: InputMaybe<Scalars['Date']['input']>;
  firstname?: InputMaybe<Scalars['String']['input']>;
  isMarried?: InputMaybe<Scalars['Boolean']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  sex?: InputMaybe<Sex>;
};

export type UpdateUserInfoPayload = {
  __typename?: 'UpdateUserInfoPayload';
  errors?: Maybe<Array<UpdateUserInfoError>>;
  personalInfo?: Maybe<PersonalInfo>;
};

export type UserDoesNotHaveAvatarError = {
  __typename?: 'UserDoesNotHaveAvatarError';
  message: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  personalInfo?: Maybe<PersonalInfo>;
};

export type UserNotFoundError = Error & {
  __typename?: 'UserNotFoundError';
  data: Array<KeyValuePairOfStringAndString>;
  message: Scalars['String']['output'];
};

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  gt?: InputMaybe<Scalars['UUID']['input']>;
  gte?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  lt?: InputMaybe<Scalars['UUID']['input']>;
  lte?: InputMaybe<Scalars['UUID']['input']>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
  ngt?: InputMaybe<Scalars['UUID']['input']>;
  ngte?: InputMaybe<Scalars['UUID']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  nlt?: InputMaybe<Scalars['UUID']['input']>;
  nlte?: InputMaybe<Scalars['UUID']['input']>;
};

export type ValidationError = Error & {
  __typename?: 'ValidationError';
  errors: Array<PropertyValidationError>;
  errorsCount: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type VerifyEmailError = EmailVerificationFailedError | UserNotFoundError | ValidationError;

export type VerifyEmailInput = {
  token: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type VerifyEmailPayload = {
  __typename?: 'VerifyEmailPayload';
  errors?: Maybe<Array<VerifyEmailError>>;
  void?: Maybe<Scalars['Void']['output']>;
};

export type VerifyResetPasswordTokenInput = {
  token: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginPayload', token?: { __typename?: 'Token', value: string, expirationTime: any } | null, errors?: Array<{ __typename: 'EmailIsNotVerifiedError' } | { __typename: 'InvalidCredentialsError', message: string } | { __typename: 'ValidationError', errorsCount: number, message: string, errors: Array<{ __typename?: 'PropertyValidationError', errorCode: string, errorMessage: string, propertyName: string, placeholders: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> }> }> | null } };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'RefreshTokenPayload', token?: { __typename?: 'Token', value: string, expirationTime: any } | null, errors?: Array<{ __typename: 'UserNotFoundError', message: string }> | null } };

export type RegisterUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'RegisterUserPayload', void?: any | null, errors?: Array<{ __typename?: 'InternalServerError', message: string } | { __typename?: 'RegistrationFailedError', message: string, errorsCount: number, errors: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> } | { __typename?: 'ValidationError', message: string, errorsCount: number, errors: Array<{ __typename?: 'PropertyValidationError', errorCode: string, errorMessage: string, propertyName: string, placeholders: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> }> }> | null } };

export type RequestPasswordResetMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestPasswordResetMutation = { __typename?: 'Mutation', requestPasswordReset: { __typename?: 'RequestPasswordResetPayload', void?: any | null, errors?: Array<{ __typename?: 'InternalServerError', message: string } | { __typename?: 'UserNotFoundError', message: string, data: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> } | { __typename?: 'ValidationError', message: string, errorsCount: number, errors: Array<{ __typename?: 'PropertyValidationError', errorCode: string, errorMessage: string, propertyName: string, placeholders: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> }> }> | null } };

export type ResetPasswordMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: { __typename?: 'ResetPasswordPayload', void?: any | null, errors?: Array<{ __typename?: 'ResetPasswordFailedError', message: string, errorsCount: number } | { __typename?: 'UserNotFoundError', message: string, data: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> } | { __typename?: 'ValidationError', message: string, errorsCount: number, errors: Array<{ __typename?: 'PropertyValidationError', errorCode: string, errorMessage: string, propertyName: string, placeholders: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> }> }> | null } };

export type VerifyEmailMutationVariables = Exact<{
  userId: Scalars['String']['input'];
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'VerifyEmailPayload', void?: any | null, errors?: Array<{ __typename: 'EmailVerificationFailedError', errorsCount: number, message: string, errors: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> } | { __typename: 'UserNotFoundError', message: string, data: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> } | { __typename: 'ValidationError', errorsCount: number, message: string, errors: Array<{ __typename?: 'PropertyValidationError', errorCode: string, errorMessage: string, propertyName: string, placeholders: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> }> }> | null } };

export type GeneralTestQuestionsQueryVariables = Exact<{
  input: GeneralTestQuestionsInput;
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GeneralTestQuestionsQuery = { __typename?: 'Query', generalTestQuestions: { __typename?: 'GeneralTestQuestionsPayload', questions?: { __typename?: 'QuestionsConnection', totalCount: number, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor?: string | null }, nodes?: Array<{ __typename?: 'Question', id: any, title: string, answers: Array<{ __typename?: 'Answer', id: any, title: string }> }> | null } | null, errors?: Array<{ __typename: 'ValidationError', message: string, errorsCount: number, errors: Array<{ __typename?: 'PropertyValidationError', errorCode: string, errorMessage: string, propertyName: string, placeholders: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> }> }> | null } };

export type VerifyResetPasswordTokenQueryVariables = Exact<{
  input: VerifyResetPasswordTokenInput;
}>;


export type VerifyResetPasswordTokenQuery = { __typename?: 'Query', verifyResetPasswordToken: { __typename?: 'ResetPasswordTokenVerificationPayload', isVerified?: boolean | null, errors?: Array<{ __typename?: 'ValidationError', errorsCount: number, message: string, errors: Array<{ __typename?: 'PropertyValidationError', errorCode: string, errorMessage: string, propertyName: string, placeholders: Array<{ __typename?: 'KeyValuePairOfStringAndString', key: string, value: string }> }> }> | null } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"expirationTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"propertyName"}},{"kind":"Field","name":{"kind":"Name","value":"placeholders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InvalidCredentialsError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"expirationTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserNotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"void"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"propertyName"}},{"kind":"Field","name":{"kind":"Name","value":"placeholders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RegistrationFailedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InternalServerError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const RequestPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestPasswordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"void"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"propertyName"}},{"kind":"Field","name":{"kind":"Name","value":"placeholders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserNotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InternalServerError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"void"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"propertyName"}},{"kind":"Field","name":{"kind":"Name","value":"placeholders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserNotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ResetPasswordFailedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"void"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"propertyName"}},{"kind":"Field","name":{"kind":"Name","value":"placeholders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserNotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmailVerificationFailedError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const GeneralTestQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GeneralTestQuestions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeneralTestQuestionsInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generalTestQuestions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"propertyName"}},{"kind":"Field","name":{"kind":"Name","value":"placeholders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GeneralTestQuestionsQuery, GeneralTestQuestionsQueryVariables>;
export const VerifyResetPasswordTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VerifyResetPasswordToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyResetPasswordTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyResetPasswordToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isVerified"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ValidationError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorsCount"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorCode"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"propertyName"}},{"kind":"Field","name":{"kind":"Name","value":"placeholders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VerifyResetPasswordTokenQuery, VerifyResetPasswordTokenQueryVariables>;