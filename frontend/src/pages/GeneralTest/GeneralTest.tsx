import { GET_GENERAL_TEST_QUESTIONS } from '@/graphql/queries/getGeneralTestQuestions';
import { useQuery } from '@apollo/client';
import { Typography } from '@mui/joy';
import { useEffect } from 'react';

export const GeneralTest = () => {
  const { loading, data } = useQuery(GET_GENERAL_TEST_QUESTIONS, {
    variables: {
      input: {
        languageCode: 'en',
      },
    },
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <div>{loading ? 'loading...' : <Typography>GeneralTest</Typography>}</div>;
};
