import { useState } from 'react';
import { Button, FormControl, FormHelperText, FormLabel, IconButton, Input } from '@mui/joy';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useStore } from '@/store/useStore';

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
      .matches(/[!@#$%^&*()-_=+[\]{};:'",.<>/?]/, 'Password must contain at least one non-alphanumeric character'),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Repeat password is required'),
  })
  .required();

export const AccountForm = () => {
  const { setActiveStep, account, setAccount } = useStore((state) => state.signUp);
  const [passwordInputType, setPasswordInputType] = useState('password');
  const [repeatPasswordInputType, setRepeatPasswordInputType] = useState('password');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: account,
  });

  const onSubmit = handleSubmit((data) => {
    setAccount(data);
    setActiveStep(1);
  });

  return (
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
          <Button type="submit" fullWidth>
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};
