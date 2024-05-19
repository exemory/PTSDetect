/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET_GENERAL_TEST_RESULT } from '@/graphql/queries';
import { useLazyQuery } from '@apollo/client';
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from '@mui/joy';
import { tabClasses } from '@mui/joy/Tab';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Result {
  __typename?: 'GeneralTestResult' | undefined;
  id: string;
  completionDate: string;
  potentialProblems: string[];
  adviceLists: { __typename?: 'AdviceList' | undefined; problem: string; advices: string[] }[];
}

export const GeneralTestResult = () => {
  const { t, i18n } = useTranslation();

  const [result, setResult] = useState<null | undefined | Result>(null);
  const [index, setIndex] = useState(0);

  const { id } = useParams();
  const [getResult, { loading: isResultLoading }] = useLazyQuery(GET_GENERAL_TEST_RESULT, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    getResult({
      variables: {
        input: {
          languageCode: i18n.language,
          resultId: id,
        },
      },
    }).then((result) => {
      setResult(result.data?.generalTestResult?.result);
    });
  }, [id, i18n.language]);

  if (isResultLoading) {
    return (
      <div className="flex flex-col items-center mx-auto gap-2">
        <CircularProgress />
      </div>
    );
  }

  if (result?.potentialProblems.length === 0) {
    return (
      <div className="flex flex-col mx-auto gap-4">
        <Typography level="h2">{t('general-test-result.title')}</Typography>

        <Divider />

        <Typography level="title-lg">{t('general-test-result.no-problems-found')}</Typography>
      </div>
    );
  }

  return (
    <>
      {result && (
        <div className="flex flex-col mx-auto gap-4">
          <Typography level="h2">{t('general-test-result.title')}</Typography>

          <Divider />

          <Typography level="title-lg">
            {t('general-test-result.sub-title')}
            <div className="flex flex-wrap gap-1 mt-2">
              {result.potentialProblems.map((problem: any) => (
                <Chip key={problem} variant="soft" color="primary">
                  {t(`problems.${problem}`)} ({problem})
                </Chip>
              ))}
            </div>
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
