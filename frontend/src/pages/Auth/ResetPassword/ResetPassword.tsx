import { AuthLayout } from '@/pages/Auth/components';
import { routes } from '@/routes';
import { Button, FormControl, FormHelperText, FormLabel, Input, Link, Typography } from '@mui/joy';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LOGIN } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';

const formSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
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
              setError('email', { message: 'Email is not verified' });
              break;
            case 'InvalidCredentialsError':
              setError('password', { message: 'Invalid password' });
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
    <AuthLayout>
      <div className="flex flex-col w-[400px] gap-6">
        <div className="flex flex-col gap-2">
          <Typography level="h3">Reset password</Typography>
          <Typography level="body-sm">Enter your email address and we will send you the recovery link</Typography>
        </div>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <FormControl required error={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register('email')} />
              <FormHelperText>{errors.email?.message}</FormHelperText>
            </FormControl>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-end">
                <NavLink to={routes.SIGN_IN}>
                  <Link level="title-sm">Return to sign in</Link>
                </NavLink>
              </div>
              <Button loading={loading} type="submit" fullWidth>
                Send
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
