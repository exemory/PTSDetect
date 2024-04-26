import { Question } from '@/__generated__/graphql';
import { GET_GENERAL_TEST_QUESTIONS } from '@/graphql/queries/getGeneralTestQuestions';
import { useLazyQuery } from '@apollo/client';
import { Button, CircularProgress, FormControl, List, ListItem, Radio, RadioGroup, Typography } from '@mui/joy';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export const GeneralTest = () => {
  const [questions, setQuestions] = useState<Question[] | undefined>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(undefined);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const { register, handleSubmit } = useForm({});

  const [getQuestions, { loading, data }] = useLazyQuery(GET_GENERAL_TEST_QUESTIONS);

  useEffect(() => {
    getQuestions({
      variables: {
        input: {
          languageCode: 'en',
        },
        first: 1,
      },
    });
  }, []);

  useEffect(() => {
    if (data) {
      const newQuestions = data.generalTestQuestions.questions?.nodes || [];
      const currentQuestions = questions || [];

      setQuestions([...currentQuestions, ...newQuestions]);
      setEndCursor(data.generalTestQuestions.questions?.pageInfo.endCursor ?? '');
      setHasNextPage(data.generalTestQuestions.questions?.pageInfo.hasNextPage ?? false);
      setTotalQuestions(data.generalTestQuestions.questions?.totalCount || 0);

      if (questions && questions?.length >= 1) {
        setCurrentQuestion((currState) => currState + 1);
      }
    }
  }, [data]);

  const loadNextQuestion = () => {
    getQuestions({
      variables: {
        input: {
          languageCode: 'en',
        },
        after: endCursor,
        first: 1,
      },
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  if (loading && !questions?.length) {
    return (
      <div className="flex flex-col items-center mx-auto gap-2 max-w-[660px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto gap-2 max-w-[660px]">
      <Typography level="title-md" color="primary">
        Question {currentQuestion + 1} of {totalQuestions}
      </Typography>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          {questions?.length && (
            <FormControl key={questions[currentQuestion].id}>
              <Typography level="h2" marginBottom={2}>
                {questions[currentQuestion].title}
              </Typography>

              <RadioGroup
                {...register(questions[currentQuestion].id)}
                size="lg"
                sx={{
                  gap: 2,
                  width: '100%',
                }}
              >
                <List
                  sx={{
                    '--List-gap': '0.5rem',
                    '--ListItem-paddingY': '1rem',
                    '--ListItem-radius': '8px',
                    '--ListItemDecorator-size': '32px',
                  }}
                >
                  {questions[currentQuestion].answers?.map((answer) => (
                    <ListItem variant="outlined" key={answer.id} sx={{ boxShadow: 'sm' }}>
                      <Radio
                        {...register(questions[currentQuestion].id)}
                        key={answer.id}
                        value={answer.id}
                        label={answer.title}
                        overlay
                        sx={{ flexGrow: 1, flexDirection: 'row-reverse' }}
                        slotProps={{
                          action: ({ checked }) => ({
                            sx: (theme) => ({
                              ...(checked && {
                                inset: -1,
                                border: '2px solid',
                                borderColor: theme.vars.palette.primary[500],
                              }),
                            }),
                          }),
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </RadioGroup>
            </FormControl>
          )}

          <div className="flex flex-col items-end">
            {hasNextPage ? (
              <Button loading={loading} onClick={loadNextQuestion} size="lg" fullWidth endDecorator={<ArrowRight />}>
                Next
              </Button>
            ) : (
              <Button type="submit">Finish</Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
