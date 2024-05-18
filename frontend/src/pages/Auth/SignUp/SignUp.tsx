import { REGISTER_USER } from '@/graphql';
import { routes } from '@/routes';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, FormHelperText, FormLabel, IconButton, Input, Link, Typography } from '@mui/joy';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import i18n from '@/i18n/i18n';
import { useTranslation } from 'react-i18next';

const formSchema = yup
  .object({
    email: yup.string().email(i18n.t('validations.valid-email')).required(i18n.t('validations.email-required')),
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

export const SignUp = () => {
  const { t } = useTranslation();

  const [passwordInputType, setPasswordInputType] = useState('password');
  const [repeatPasswordInputType, setRepeatPasswordInputType] = useState('password');

  const [registerUser, { loading }] = useMutation(REGISTER_USER);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const formData = {
      email: data.email,
      password: data.password,
    };

    try {
      const { data: registerData } = await registerUser({ variables: formData });

      if (registerData?.registerUser.errors && registerData.registerUser.errors.length > 0) {
        registerData.registerUser.errors.forEach((error) => {
          switch (error.__typename) {
            case 'RegistrationFailedError':
              error.errors.forEach((error) => {
                switch (error.key) {
                  case 'DuplicateEmail':
                    setError('email', { message: t('validations.user-with-email-exists') });
                    break;
                }
              });
              break;
            default:
              console.error(`Unhandled error type: ${error.__typename}`);
          }
        });

        return;
      }

      navigate(routes.CONFIRM_EMAIL);
    } catch (error) {
      console.error('Sign up error:', error);
    }
  });

  return (
    <div className="flex flex-col w-[400px] gap-6">
      <div className="flex flex-col gap-2">
        <Typography level="h3">{t('sign-up.title')}</Typography>
        <Typography level="body-sm">
          {t('sign-up.sub-title-part-1')}{' '}
          <NavLink to={routes.SIGN_IN}>
            <Link level="title-sm">{t('sign-up.sub-title-part-2')}</Link>
          </NavLink>
        </Typography>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <FormControl error={!!errors.email}>
            <FormLabel>{t('general.email')}</FormLabel>
            <Input type="email" {...register('email')} />
            <FormHelperText>{errors.email?.message}</FormHelperText>
          </FormControl>

          <FormControl error={!!errors.password}>
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

          <FormControl error={!!errors.repeatPassword}>
            <FormLabel>{t('sign-up.repeat-password')}</FormLabel>
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

          <div className="flex flex-col mt-6">
            <Button type="submit" fullWidth loading={loading}>
              {t('sign-up.action')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
