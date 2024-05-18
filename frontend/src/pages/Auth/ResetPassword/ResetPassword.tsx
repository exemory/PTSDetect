import { routes } from '@/routes';
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  Typography,
} from '@mui/joy';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RESET_PASSWORD } from '@/graphql/mutations';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { VERIFY_RESET_PASSWORD_TOKEN } from '@/graphql/queries';
import { Eye, EyeOff, XCircle, CheckCircle } from 'lucide-react';
import i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';

const formSchema = yup
  .object({
    password: yup
      .string()
      .required(i18n.t('validations.password-required'))
      .min(8, i18n.t('validations.must-be-char-long'))
      .matches(/[^\s]/, i18n.t('validations.must-contain-non-whitespace-char'))
      .matches(/[a-z]/, i18n.t('validations.must-contain-one-lowercase-letter'))
      .matches(/[A-Z]/, i18n.t('validations.must-contain-one-uppercase-letter'))
      .matches(/[0-9]/, i18n.t('validations.must-contain-one-digit'))
      .matches(/[!@#$%^&*(),.?":{}|<>]/, i18n.t('validations.must-contain-one-non-alphanumeric')),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref('password')], i18n.t('validations.passwords-must-match'))
      .required(i18n.t('validations.repeat-password-required')),
  })
  .required();

export const ResetPassword = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
  });

  const [isVerified, setIsVerified] = useState(false);
  const [isReseted, setIsReseted] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState('password');
  const [repeatPasswordInputType, setRepeatPasswordInputType] = useState('password');

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const [verifyResetPasswordToken, { loading: isVerifyLoading }] = useLazyQuery(VERIFY_RESET_PASSWORD_TOKEN);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const verify = async () => {
      try {
        if (userId && token) {
          const { data } = await verifyResetPasswordToken({
            variables: {
              input: {
                userId,
                token,
              },
            },
          });

          setIsVerified(!!data?.verifyResetPasswordToken.isVerified);
        }
      } catch (error) {
        console.error('Verify error:', error);
      }
    };

    verify();
  }, [searchParams]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const { data } = await resetPassword({
        variables: {
          userId: searchParams.get('userId') ?? '',
          token: searchParams.get('token') ?? '',
          newPassword: formData.password,
        },
      });

      if (data?.resetPassword.errors && data.resetPassword.errors.length > 0) {
        data.resetPassword.errors.forEach((error) => {
          switch (error.__typename) {
            case 'UserNotFoundError':
              console.log('User not found');
              break;
            default:
              console.error(`Unhandled error type: ${error.__typename}`);
          }
        });

        return;
      }

      setIsReseted(true);
    } catch (error) {
      console.error('Reset password error:', error);
    }
  });

  if (isVerifyLoading) {
    return <CircularProgress size="lg" />;
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col w-[400px] gap-6">
        <div className="flex flex-col gap-2 items-center">
          <XCircle size={92} color="red" />
          <Typography level="h3" alignContent="center">
            {t('general.error')}
          </Typography>
          <Typography level="body-sm">{t('reset-password.password-reset-error')}</Typography>
        </div>

        <Button onClick={() => navigate(routes.SIGN_UP)} loading={loading} fullWidth>
          {t('general.sign-up')}
        </Button>
      </div>
    );
  }

  if (isReseted) {
    return (
      <div className="flex flex-col w-[400px] gap-6">
        <div className="flex flex-col gap-2 items-center">
          <CheckCircle size={92} color="green" />
          <Typography level="h3" alignContent="center">
            {t('general.success')}
          </Typography>
          <Typography level="body-sm">{t('reset-password.password-reset-successfully')}</Typography>
        </div>

        <Button onClick={() => navigate(routes.SIGN_IN)} loading={loading} fullWidth>
          {t('general.sign-in')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[400px] gap-6">
      <div className="flex flex-col gap-2">
        <Typography level="h3">{t('reset-password.title')}</Typography>
        <Typography level="body-sm">{t('reset-password.sub-title')}</Typography>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <FormControl error={!!errors.password}>
            <FormLabel>{t('reset-password.new-password')}</FormLabel>
            <Input
              type={passwordInputType}
              endDecorator={
                <IconButton
                  onClick={() =>
                    setPasswordInputType((currentState) => (currentState === 'password' ? 'text' : 'password'))
                  }
                >
                  {passwordInputType === 'password' ? <Eye color="gray" /> : <EyeOff color="gray" />}
                </IconButton>
              }
              {...register('password')}
            />
            <FormHelperText>{errors.password?.message}</FormHelperText>
          </FormControl>

          <FormControl error={!!errors.repeatPassword}>
            <FormLabel>{t('reset-password.repeat-new-password')}</FormLabel>
            <Input
              type={repeatPasswordInputType}
              endDecorator={
                <IconButton
                  onClick={() =>
                    setRepeatPasswordInputType((currentState) => (currentState === 'password' ? 'text' : 'password'))
                  }
                >
                  {repeatPasswordInputType === 'password' ? <Eye color="gray" /> : <EyeOff color="gray" />}
                </IconButton>
              }
              {...register('repeatPassword')}
            />
            <FormHelperText>{errors.repeatPassword?.message}</FormHelperText>
          </FormControl>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-end">
              <NavLink to={routes.SIGN_IN}>
                <Link level="title-sm">{t('reset-password.return-to-sign-in')}</Link>
              </NavLink>
            </div>
            <Button loading={loading} type="submit" fullWidth>
              {t('reset-password.action')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
