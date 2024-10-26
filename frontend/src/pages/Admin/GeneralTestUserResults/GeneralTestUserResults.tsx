import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import { GET_GENERAL_TEST_USERS_RESULTS, GET_USERS } from '@/graphql/queries'; // Assuming we have a query to get users
import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes';
import { CircularProgress, Autocomplete } from '@mui/joy';
import { useTranslation } from 'react-i18next';
import heroImage from '@/assets/images/hero.jpg';

interface IUser {
  id: string;
  email: string;
}

interface IResults {
  __typename?: 'GeneralTestResult' | undefined;
  id: any;
  completionDate: any;
}

export const GeneralTestUserResults = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [results, setResults] = useState<null | undefined | IResults[]>([]);
  const {
    loading: usersLoading,
    data: usersData,
    fetchMore,
  } = useQuery(GET_USERS, {
    variables: { first: 50 },
  });

  useEffect(() => {
    const loadAllUsers = async () => {
      let allUsers = usersData?.users?.nodes || [];
      let pageInfo = usersData?.users?.pageInfo;

      while (pageInfo?.hasNextPage) {
        const { data } = await fetchMore({
          variables: { after: pageInfo.endCursor },
        });

        allUsers = [...allUsers, ...(data.users?.nodes ?? [])];
        pageInfo = data.users?.pageInfo;
      }

      setUsers(allUsers);
    };

    if (usersData?.users?.nodes) {
      loadAllUsers();
    }
  }, [usersData, fetchMore]);

  const [fetchUserResults, { loading: resultsLoading, data: resultsData }] = useLazyQuery(
    GET_GENERAL_TEST_USERS_RESULTS,
    {
      variables: {
        input: { userIds: selectedUserId ? [selectedUserId] : [], languageCode: i18n.language },
      },
    }
  );

  useEffect(() => {
    if (usersData?.users?.nodes) {
      setUsers(usersData.users.nodes);
    }
  }, [usersData]);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserResults();
    }
  }, [selectedUserId, fetchUserResults]);

  useEffect(() => {
    if (resultsData?.generalTestUsersResults?.usersResults?.nodes?.[0]?.generalTestResults) {
      setResults(resultsData.generalTestUsersResults.usersResults.nodes[0].generalTestResults);
    }
  }, [resultsData]);

  const getFormattedDate = (originalDateString: string) => {
    const originalDate = new Date(originalDateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    };
    return originalDate.toLocaleString('en-US', options as any);
  };

  if (usersLoading) {
    return (
      <div className="flex flex-col items-center mx-auto gap-2">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Typography level="h2" component="h1" mb={2}>
        {t('admin.title')}
      </Typography>

      <Divider />

      <div className="mt-2 md:max-w-xs">
        <Autocomplete
          options={users}
          getOptionLabel={(user) => user.email}
          value={users.find((user) => user.id === selectedUserId) || null}
          onChange={(_, newValue) => setSelectedUserId(newValue ? newValue.id : null)}
          placeholder={t('admin.label')}
        />
      </div>

      {selectedUserId && results && results.length === 0 && !resultsLoading && (
        <Typography mt={3}>{t('admin.no-results')}</Typography>
      )}

      {resultsLoading && (
        <div className="flex flex-col items-center mx-auto gap-2 mt-4">
          <CircularProgress />
        </div>
      )}

      {results && results.length > 0 && (
        <div className="flex gap-4 flex-wrap mt-8 justify-center lg:justify-start">
          {results.map((result) => (
            <Card
              variant="outlined"
              sx={{ width: 320, cursor: 'pointer' }}
              key={result.id}
              onClick={() => navigate(`${routes.PTSD_TEST_RESULT.replace(':id', result.id)}`)}
            >
              <CardOverflow>
                <AspectRatio ratio="2">
                  <img src={heroImage} loading="lazy" alt="Test Result" />
                </AspectRatio>
              </CardOverflow>
              <CardContent>
                <Typography level="title-md">{t('results.card-title')}</Typography>
              </CardContent>
              <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                <Divider inset="context" />
                <CardContent orientation="horizontal">
                  <Typography level="body-xs" fontWeight="md" textColor="text.secondary">
                    {getFormattedDate(result.completionDate)}
                  </Typography>
                </CardContent>
              </CardOverflow>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
