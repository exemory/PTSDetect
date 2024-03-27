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

const formSchema = yup
  .object({
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

export const ResetPassword = () => {
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
            Error
          </Typography>
          <Typography level="body-sm">An error occurred while trying to reset the password</Typography>
        </div>

        <Button onClick={() => navigate(routes.SIGN_UP)} loading={loading} fullWidth>
          Sign up
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
            Success
          </Typography>
          <Typography level="body-sm">Password has been reset successfully</Typography>
        </div>

        <Button onClick={() => navigate(routes.SIGN_IN)} loading={loading} fullWidth>
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[400px] gap-6">
      <div className="flex flex-col gap-2">
        <Typography level="h3">Reset password</Typography>
        <Typography level="body-sm">Enter a new password below to change your password</Typography>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <FormControl error={!!errors.password}>
            <FormLabel>New password</FormLabel>
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
            <FormLabel>Repeat new password</FormLabel>
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
                <Link level="title-sm">Return to sign in</Link>
              </NavLink>
            </div>
            <Button loading={loading} type="submit" fullWidth>
              Reset
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
