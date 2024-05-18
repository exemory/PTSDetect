import { routes } from '@/routes';
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  Typography,
} from '@mui/joy';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LOGIN } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/i18n';

const formSchema = yup
  .object({
    email: yup.string().email(i18n.t('validations.valid-email')).required(i18n.t('validations.email-required')),
    password: yup.string().required(i18n.t('validations.password-required')),
  })
  .required();

export const SignIn = () => {
  const { t } = useTranslation();

  const [passwordInputType, setPasswordInputType] = useState('password');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
  });
  const [login, { loading }] = useMutation(LOGIN);

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const { data } = await login({
        variables: {
          input: {
            email: formData.email,
            password: formData.password,
          },
        },
      });

      if (data?.login.token?.value) {
        localStorage.setItem('token', data.login.token.value);
      }

      if (data?.login.errors && data.login.errors.length > 0) {
        data.login.errors.forEach((error) => {
          switch (error.__typename) {
            case 'EmailIsNotVerifiedError':
              setError('email', { message: t('validations.email-not-verified') });
              break;
            case 'InvalidCredentialsError':
              setError('password', { message: t('validations.wrong-password') });
              break;
            default:
              console.error(`Unhandled error type: ${error.__typename}`);
          }
        });

        return;
      }

      navigate(routes.HOME);
    } catch (error) {
      console.error('Login error:', error);
    }
  });

  return (
    <div className="flex flex-col w-[400px] gap-6">
      <div className="flex flex-col gap-2">
        <Typography level="h3">{t('sign-in.title')}</Typography>
        <Typography level="body-sm">
          {t('sign-in.sub-title-part-1')}{' '}
          <NavLink to={routes.SIGN_UP}>
            <Link level="title-sm">{t('sign-in.sub-title-part-2')}</Link>
          </NavLink>
        </Typography>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <FormControl required error={!!errors.email}>
            <FormLabel>{t('general.email')}</FormLabel>
            <Input type="email" {...register('email')} />
            <FormHelperText>{errors.email?.message}</FormHelperText>
          </FormControl>

          <FormControl required error={!!errors.password}>
            <FormLabel>{t('general.password')}</FormLabel>
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

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Checkbox size="sm" label={t('sign-in.remember-me')} name="persistent" />
              <NavLink to={routes.FORGOT_PASSWORD}>
                <Link level="title-sm">{t('sign-in.forgot-password')}</Link>
              </NavLink>
            </div>
            <Button loading={loading} type="submit" fullWidth>
              {t('sign-in.action')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
