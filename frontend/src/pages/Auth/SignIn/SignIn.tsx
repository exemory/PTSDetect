import { AuthLayout } from '@/pages/Auth/components';
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

const formSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

export const SignIn = () => {
  const [passwordInputType, setPasswordInputType] = useState('password');
  const {
    register,
    handleSubmit,
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
        console.log(data?.login.errors);
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
          <Typography level="h3">Sign in</Typography>
          <Typography level="body-sm">
            Don&apos;t have an account?{' '}
            <NavLink to={routes.SIGN_UP}>
              <Link level="title-sm">Sign up!</Link>
            </NavLink>
          </Typography>
        </div>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <FormControl required error={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register('email')} />
              <FormHelperText>{errors.email?.message}</FormHelperText>
            </FormControl>

            <FormControl required error={!!errors.password}>
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

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <Checkbox size="sm" label="Remember me" name="persistent" />
                <NavLink to={routes.SIGN_UP}>
                  <Link level="title-sm">Forgot your password?</Link>
                </NavLink>
              </div>
              <Button loading={loading} type="submit" fullWidth>
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
