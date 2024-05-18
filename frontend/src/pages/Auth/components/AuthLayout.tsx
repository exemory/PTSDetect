import { LanguageSelect } from '@/components/LanguageSelect';
import { Typography } from '@mui/joy';
import { Fingerprint } from 'lucide-react';

export const AuthLayout = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div className="w-screen h-screen flex">
      <div className="hidden md:block md:w-1/3 lg:w-1/2 gradient text-white p-8">
        <div className="flex items-center gap-2">
          <Fingerprint />
          <Typography level="h4" textColor="common.white">
            PTSDetect
          </Typography>
        </div>
      </div>
      <div className="w-full px-4 md:px-0 md:w-2/3 lg:w-1/2 flex flex-col">
        <div className="flex justify-end w-full p-8">
          <LanguageSelect />
        </div>
        <div className="flex items-center justify-center h-3/4">{children}</div>
      </div>
    </div>
  );
};
