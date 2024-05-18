import { Typography } from '@mui/joy';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ConfirmEmail = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-[400px] gap-6">
      <div className="flex flex-col gap-2 items-center">
        <Mail size={92} color="#185EA5" />
        <Typography level="h3" textAlign="center">
          {t('confirm-email.title')}
        </Typography>
        <Typography level="body-sm" textAlign="center">
          {t('confirm-email.sub-title')}
        </Typography>
      </div>
    </div>
  );
};
