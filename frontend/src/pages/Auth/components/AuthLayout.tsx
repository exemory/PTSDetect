import { Typography } from '@mui/joy';
import { Fingerprint } from 'lucide-react';

export const AuthLayout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 gradient text-white p-8">
        <div className="flex items-center gap-2">
          <Fingerprint />
          <Typography level="h4" textColor="common.white">
            PTSDetect
          </Typography>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center">{children}</div>
    </div>
  );
};
