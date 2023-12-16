import { AuthLayout } from '@/pages/Auth/components';
import { routes } from '@/routes';
import { Button, Checkbox, FormControl, FormLabel, IconButton, Input, Link, Typography } from '@mui/joy';
import { NavLink } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const formSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

const SignIn = () => {
  const [passwordInputType, setPasswordInputType] = useState('password');
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = handleSubmit((data) => console.log(data));

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
            <FormControl required>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register('email')} />
            </FormControl>

            <FormControl required>
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
            </FormControl>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <Checkbox size="sm" label="Remember me" name="persistent" />
                <NavLink to={routes.SIGN_UP}>
                  <Link level="title-sm">Forgot your password?</Link>
                </NavLink>
              </div>
              <Button type="submit" fullWidth>
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
