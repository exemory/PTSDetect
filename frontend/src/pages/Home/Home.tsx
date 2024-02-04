import { Button, Typography } from '@mui/joy';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/images/hero.jpg';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-8 mt-16 items-center">
      <div className="flex flex-col gap-8">
        <Typography fontSize={48} level="h1">
          Comprehensive Post-Traumatic Stress Disorder Evaluation
        </Typography>
        <Typography fontSize={21} level="body-lg">
          Welcome to your personal PTSD self-assessment tool. This test, designed by mental health professionals,
          provides a confidential space to help you understand potential PTSD symptoms. Remember, this isn&apos;t a
          substitute for professional advice. If you&apos;re struggling, seek immediate help from a healthcare provider.
        </Typography>

        <div className="mt-8">
          <Button size="lg" endDecorator={<ArrowRight />} variant="soft" onClick={() => navigate(routes.PTSD_TEST)}>
            Begin Your Assessment Now
          </Button>
        </div>
      </div>

      <div className="">
        <img className="rounded-lg " src={heroImage} alt="sad man" />
      </div>
    </div>
  );
};
