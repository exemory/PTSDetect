/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET_GENERAL_TEST_RESULT } from '@/graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { Box, CircularProgress, List, ListItem, Tab, TabList, TabPanel, Tabs, Typography } from '@mui/joy';
import { tabClasses } from '@mui/joy/Tab';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Result {
  __typename?: 'GeneralTestResult' | undefined;
  id: string;
  completionDate: string;
  potentialProblems: string[];
  adviceLists: { __typename?: 'AdviceList' | undefined; problem: string; advices: string[] }[];
}

const GeneralTestResult = () => {
  const [result, setResult] = useState<null | undefined | Result>(null);
  const [index, setIndex] = useState(0);

  const { id } = useParams();
  const [getResult, { loading: isResultLoading }] = useLazyQuery(GET_GENERAL_TEST_RESULT);

  useEffect(() => {
    getResult({
      variables: {
        input: {
          languageCode: 'en',
          resultId: id,
        },
      },
    }).then((result) => {
      setResult(result.data?.generalTestResult?.result);
    });
  }, [id]);

  if (isResultLoading) {
    return (
      <div className="flex flex-col items-center mx-auto gap-2">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      {result && (
        <div className="flex flex-col mx-auto gap-4 max-w-[960px]">
          <Typography level="h2">Result of the Comprehensive PTSD evaluation</Typography>

          <Typography level="h4">
            Potential problems: <span className="inline-flex gap-1">{result.potentialProblems.join(', ')}</span>
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              overflowX: 'hidden',
              marginTop: 1,
            }}
          >
            <Tabs value={index} onChange={(_: any, value) => setIndex(value as number)} sx={{ borderRadius: 'xl' }}>
              <TabList
                sx={{
                  pt: 1,
                  [`&& .${tabClasses.root}`]: {
                    flex: 'initial',
                    bgcolor: 'transparent',
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                    [`&.${tabClasses.selected}`]: {
                      color: 'primary.plainColor',
                      '&::after': {
                        height: 2,
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                        bgcolor: 'primary.500',
                      },
                    },
                  },
                }}
              >
                {result.adviceLists.map((adviceList, idx) => (
                  <Tab key={idx} indicatorInset color={index === idx ? 'primary' : 'neutral'}>
                    {adviceList.problem}
                  </Tab>
                ))}
              </TabList>
              <Box>
                {result.adviceLists.map((adviceList, idx) => (
                  <TabPanel value={idx} key={idx}>
                    <List
                      marker="disc"
                      sx={{
                        maxHeight: 900,
                        overflowY: 'auto',
                        borderRadius: 'xl',
                      }}
                    >
                      {adviceList.advices.map((advice) => (
                        <ListItem key={advice}>{advice}</ListItem>
                      ))}
                    </List>
                  </TabPanel>
                ))}
              </Box>
            </Tabs>
          </Box>
        </div>
      )}
    </>
  );
};

export default GeneralTestResult;
