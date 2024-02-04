import { Question } from '@/__generated__/graphql';
import { GET_GENERAL_TEST_QUESTIONS } from '@/graphql/queries/getGeneralTestQuestions';
import { useLazyQuery } from '@apollo/client';
import { Button, CircularProgress, FormControl, FormLabel, Radio, RadioGroup, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const GeneralTest = () => {
  const [questions, setQuestions] = useState<Question[] | undefined>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);

  const { register, handleSubmit } = useForm({});

  const [getQuestions, { loading, data }] = useLazyQuery(GET_GENERAL_TEST_QUESTIONS);

  useEffect(() => {
    getQuestions({
      variables: {
        input: {
          languageCode: 'en',
        },
        first: 5,
      },
    });
  }, []);

  useEffect(() => {
    if (data) {
      const newQuestions = data.generalTestQuestions.questions?.nodes || [];
      const currentQuestions = questions || [];
      setQuestions([...currentQuestions, ...newQuestions]);
      setEndCursor(data.generalTestQuestions.questions?.pageInfo.endCursor ?? '');
    }
  }, [data]);

  const loadMore = () => {
    getQuestions({
      variables: {
        input: {
          languageCode: 'en',
        },
        after: endCursor,
        first: 5,
      },
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  if (loading && !questions?.length) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto gap-8 max-w-[960px]">
      <div className="flex items-center justify-between">
        <Typography level="h2">Comprehensive Post-Traumatic Stress Disorder Evaluation</Typography>
        <Typography level="h2">3/10</Typography>
      </div>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          {questions &&
            questions.map((question) => (
              <FormControl key={question.id}>
                <div className="flex flex-col gap-2 border border-1 p-6 rounded-lg">
                  <FormLabel>
                    <Typography fontSize={21} level="title-lg">
                      {question.title}
                    </Typography>
                  </FormLabel>
                  <RadioGroup {...register(question.id)}>
                    <div className="flex flex-col gap-4">
                      {question.answers?.map((answer) => (
                        <Radio key={answer.id} value={answer.id} label={answer.title} {...register(question.id)} />
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </FormControl>
            ))}

          <div className="flex flex-col mt-6">
            <Button loading={loading} onClick={loadMore} fullWidth>
              Load More Questions
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
