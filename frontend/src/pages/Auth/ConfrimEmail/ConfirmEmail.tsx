import { AuthLayout } from '@/pages/Auth/components';
import { Typography } from '@mui/joy';
import { Mail } from 'lucide-react';

export const ConfirmEmail = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col w-[400px] gap-6">
        <div className="flex flex-col gap-2 items-center">
          <Mail size={92} color="#185EA5" />
          <Typography level="h3" textAlign="center">
            Confrim your email address
          </Typography>
          <Typography level="body-sm" textAlign="center">
            We have sent you an email to make sure your email address is valid. Once you receive the email, please click
            on the provided link to complete your registration.
          </Typography>
        </div>
      </div>
    </AuthLayout>
  );
};
