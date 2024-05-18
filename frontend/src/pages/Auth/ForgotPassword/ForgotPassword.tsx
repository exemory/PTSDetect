import { routes } from '@/routes';
import { Button, FormControl, FormHelperText, FormLabel, Input, Link, Typography } from '@mui/joy';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { REQUEST_PASSWORD_RESET } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';

const formSchema = yup
  .object({
    email: yup.string().email(i18n.t('validations.valid-email')).required(i18n.t('validations.email-required')),
  })
  .required();

export const ForgotPassword = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const { data } = await requestPasswordReset({
        variables: {
          email: formData.email,
        },
      });

      if (data?.requestPasswordReset.errors && data.requestPasswordReset.errors.length > 0) {
        data.requestPasswordReset.errors.forEach((error) => {
          switch (error.__typename) {
            case 'UserNotFoundError':
              setError('email', { message: t('validations.user-with-email-not-found') });
              break;
            default:
              console.error(`Unhandled error type: ${error.__typename}`);
          }
        });

        return;
      }

      setIsEmailSent(true);
    } catch (error) {
      console.error('Request password reset error:', error);
    }
  });

  if (isEmailSent) {
    return (
      <div className="flex flex-col w-[400px] gap-6">
        <div className="flex flex-col gap-2 items-center">
          <Mail size={92} color="#185EA5" />
          <Typography level="h3" textAlign="center">
            {t('forgot-password.check-your-email')}
          </Typography>
          <Typography level="body-sm" textAlign="center">
            {t('forgot-password.we-sent-recovery-link')}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[400px] gap-6">
      <div className="flex flex-col gap-2">
        <Typography level="h3">{t('forgot-password.title')}</Typography>
        <Typography level="body-sm">{t('forgot-password.sub-title')}</Typography>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <FormControl required error={!!errors.email}>
            <FormLabel>{t('general.email')}</FormLabel>
            <Input type="email" {...register('email')} />
            <FormHelperText>{errors.email?.message}</FormHelperText>
          </FormControl>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-end">
              <NavLink to={routes.SIGN_IN}>
                <Link level="title-sm">{t('forgot-password.return-to-sign-in')}</Link>
              </NavLink>
            </div>
            <Button loading={loading} type="submit" fullWidth>
              {t('forgot-password.action')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
