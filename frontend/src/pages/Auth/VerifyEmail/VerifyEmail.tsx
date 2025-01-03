import { routes } from '@/routes';
import { Button, CircularProgress, Typography } from '@mui/joy';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VERIFY_EMAIL } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const VerifyEmail = () => {
  const { t } = useTranslation();

  const [verifyEmail, { loading }] = useMutation(VERIFY_EMAIL);
  const [isVerified, setIsVerified] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const verify = async () => {
      try {
        if (userId && token) {
          const { data } = await verifyEmail({
            variables: {
              userId,
              token,
            },
          });

          setIsVerified(!data?.verifyEmail.errors);
        }
      } catch (error) {
        console.error('Verify error:', error);
      }
    };

    verify();
  }, [searchParams]);

  if (loading) {
    return <CircularProgress size="lg" />;
  }

  if (!isVerified) {
    <div className="flex flex-col w-[400px] gap-6">
      <div className="flex flex-col gap-2 items-center">
        <XCircle size={92} color="red" />
        <Typography level="h3" alignContent="center">
          {t('general.error')}
        </Typography>
        <Typography level="body-sm">{t('verify-email.email-could-not-be-verified')}</Typography>
      </div>

      <Button onClick={() => navigate(routes.SIGN_UP)} loading={loading} fullWidth>
        {t('general.sign-up')}
      </Button>
    </div>;
  }

  return (
    <div className="flex flex-col w-[400px] gap-6">
      <div className="flex flex-col gap-2 items-center">
        <CheckCircle size={92} color="green" />

        <Typography level="h3" alignContent="center">
          {t('verify-email.title')}
        </Typography>
        <Typography level="body-sm"> {t('verify-email.sub-title')}</Typography>
      </div>

      <Button onClick={() => navigate(routes.SIGN_IN)} loading={loading} fullWidth>
        {t('general.sign-in')}
      </Button>
    </div>
  );
};
