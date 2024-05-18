import { Button, Typography } from '@mui/joy';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/images/hero.jpg';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes';
import { useTranslation } from 'react-i18next';

export const Home = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 items-center">
      <div className="flex flex-col gap-8">
        <Typography fontSize={{ xs: 32, md: 48 }} level="h1">
          {t('home.title')}
        </Typography>
        <Typography fontSize={{ xs: 18, md: 21 }} level="body-lg">
          {t('home.sub-title')}
        </Typography>

        <div className="mt-8">
          <Button size="lg" endDecorator={<ArrowRight />} variant="soft" onClick={() => navigate(routes.PTSD_TEST)}>
            {t('home.action')}
          </Button>
        </div>
      </div>

      <div className="hidden md:block">
        <img className="rounded-lg " src={heroImage} alt="sad man" />
      </div>
    </div>
  );
};
