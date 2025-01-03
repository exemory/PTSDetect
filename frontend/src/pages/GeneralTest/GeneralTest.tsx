import { Question } from '@/__generated__/graphql';
import { SUBMIT_GENERAL_TEST_ANSWERS } from '@/graphql/mutations';
import { GET_GENERAL_TEST_QUESTIONS } from '@/graphql/queries';
import { routes } from '@/routes';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, CircularProgress, FormControl, List, ListItem, Radio, RadioGroup, Typography } from '@mui/joy';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const GeneralTest = () => {
  const { t, i18n } = useTranslation();

  const [questions, setQuestions] = useState<Question[] | undefined>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(undefined);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm({});
  const watchedValues = watch();

  const navigate = useNavigate();

  const [getQuestions, { loading: isQuestionsLoading, data: questionsData }] = useLazyQuery(
    GET_GENERAL_TEST_QUESTIONS,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const [submitAnswers, { loading: isSubmitLoading }] = useMutation(SUBMIT_GENERAL_TEST_ANSWERS);

  useEffect(() => {
    setCurrentQuestion(0);
    setQuestions([]);
    setEndCursor(undefined);
    setHasNextPage(undefined);
    reset();

    getQuestions({
      variables: {
        input: {
          languageCode: i18n.language,
        },
        first: 1,
      },
    });
  }, [i18n.language]);

  useEffect(() => {
    if (questionsData) {
      const newQuestions = questionsData.generalTestQuestions.questions?.nodes || [];
      const currentQuestions = questions || [];

      setQuestions([...currentQuestions, ...newQuestions]);
      setEndCursor(questionsData.generalTestQuestions.questions?.pageInfo.endCursor ?? '');
      setHasNextPage(questionsData.generalTestQuestions.questions?.pageInfo.hasNextPage ?? false);
      setTotalQuestions(questionsData.generalTestQuestions.questions?.totalCount || 0);

      if (questions && questions?.length >= 1) {
        setCurrentQuestion((currState) => currState + 1);
      }
    }
  }, [questionsData]);

  const loadNextQuestion = () => {
    getQuestions({
      variables: {
        input: {
          languageCode: i18n.language,
        },
        after: endCursor,
        first: 1,
      },
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    const answers = Object.entries(data).map(([questionId, answerId]) => ({
      questionId,
      answerId,
    }));

    submitAnswers({
      variables: {
        input: {
          answers,
        },
      },
    }).then((res) => {
      const resultId = res.data?.submitGeneralTestAnswers.resultId;
      navigate(`${routes.PTSD_TEST_RESULT.replace(':id', resultId)}`);
    });
  });

  if (isQuestionsLoading && !questions?.length) {
    return (
      <div className="flex flex-col items-center mx-auto gap-2 max-w-[660px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto gap-2 max-w-[660px]">
      <form onSubmit={onSubmit}>
        <div className="flex items-center justify-between mb-2">
          <Typography level="title-md" color="primary">
            {t('general-test.question')} {currentQuestion + 1} {t('general-test.of')} {totalQuestions}
          </Typography>
          <div className="flex flex-col items-end">
            {hasNextPage ? (
              <Button
                loading={isQuestionsLoading}
                onClick={loadNextQuestion}
                size="lg"
                endDecorator={<ArrowRight />}
                disabled={!watchedValues[questions?.[currentQuestion]?.id ?? '']}
              >
                {t('general-test.next')}
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                loading={isSubmitLoading}
                disabled={!watchedValues[questions?.[currentQuestion]?.id ?? '']}
              >
                {t('general-test.finish')}
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {questions?.length && (
            <FormControl key={questions[currentQuestion].id}>
              <Typography level="h3" marginBottom={2}>
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
        </div>
      </form>
    </div>
  );
};
