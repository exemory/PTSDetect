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

const formSchema = yup
  .object({
    email: yup.string().email('Must be a valid email address').required('Email is required'),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Must be 8 or more characters long')
      .matches(/[^\s]/, 'Password must contain at least one non-whitespace character')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one digit')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one non-alphanumeric character'),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Repeat password is required'),
  })
  .required();

export const SignUp = () => {
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
                    setError('email', { message: `A user with this email already exists` });
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
        <Typography level="h3">Sign up</Typography>
        <Typography level="body-sm">
          Already have an account?{' '}
          <NavLink to={routes.SIGN_IN}>
            <Link level="title-sm">Sign in!</Link>
          </NavLink>
        </Typography>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <FormControl error={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input type="email" {...register('email')} />
            <FormHelperText>{errors.email?.message}</FormHelperText>
          </FormControl>

          <FormControl error={!!errors.password}>
            <FormLabel>Password</FormLabel>
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
            <FormLabel>Repeat password</FormLabel>
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
              Next
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
