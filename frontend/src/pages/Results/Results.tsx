import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import heroImage from '@/assets/images/hero.jpg';
import { GET_GENERAL_TEST_RESULTS } from '@/graphql/queries';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes';
import { CircularProgress } from '@mui/joy';

interface IResults {
  __typename?: 'GeneralTestResult' | undefined;
  id: any;
  completionDate: any;
}

export const Results = () => {
  const [results, setResults] = useState<null | undefined | IResults[]>();

  const navigate = useNavigate();

  const { loading, data } = useQuery(GET_GENERAL_TEST_RESULTS, {
    variables: { input: { languageCode: 'en' } },
  });

  useEffect(() => {
    if (data?.generalTestResults?.results?.nodes) {
      setResults(data.generalTestResults.results.nodes);
    }
  }, [data]);

  const getFormatedDate = (originalDateString: string) => {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center mx-auto gap-2">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Typography level="h2" component="h1" mb={2}>
        Completed evaluations
      </Typography>
      <Divider />
      {results && (
        <div className="flex gap-4 flex-wrap mt-4 justify-center lg:justify-start">
          {results.map((result) => (
            <Card
              variant="outlined"
              sx={{ width: 320, cursor: 'pointer' }}
              key={result.id}
              onClick={() => navigate(`${routes.PTSD_TEST_RESULT.replace(':id', result.id)}`)}
            >
              <CardOverflow>
                <AspectRatio ratio="2">
                  <img src={heroImage} srcSet={heroImage} loading="lazy" alt="" />
                </AspectRatio>
              </CardOverflow>
              <CardContent>
                <Typography level="title-md">Comprehensive Post-Traumatic Stress Disorder Evaluation</Typography>
              </CardContent>
              <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                <Divider inset="context" />
                <CardContent orientation="horizontal">
                  <Typography level="body-xs" fontWeight="md" textColor="text.secondary">
                    {getFormatedDate(result.completionDate)}
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
