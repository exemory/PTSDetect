import { AuthLayout } from '@/pages/Auth/components';
import { routes } from '@/routes';
import { Link, Step, StepButton, StepIndicator, Stepper, Typography } from '@mui/joy';
import { NavLink } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { AdditionalInfoForm, AccountForm, PersonalDetailsForm } from '@/pages/Auth/SignIn/components';

const SignUp = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Account', 'Personal Details', 'Additional'];

  const getActiveForm = () => {
    switch (activeStep) {
      case 0:
        return <AccountForm />;
      case 1:
        return <PersonalDetailsForm />;
      case 2:
        return <AdditionalInfoForm />;
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col w-[400px] gap-6">
        <div className="flex flex-col gap-2">
          <Typography level="h3">Sign up</Typography>
          <Typography level="body-sm">
            Already have an account?{' '}
            <NavLink to={routes.SIGN_IN}>
              <Link level="title-sm">Sign in!</Link>
            </NavLink>
          </Typography>
        </div>

        <Stepper>
          {steps.map((step, index) => (
            <Step
              key={step}
              indicator={
                <StepIndicator
                  onClick={() => setActiveStep(index)}
                  variant={activeStep <= index ? 'soft' : 'solid'}
                  color={activeStep < index ? 'neutral' : 'primary'}
                >
                  {activeStep <= index ? index + 1 : <Check size={16} />}
                </StepIndicator>
              }
              sx={{
                '&::after': {
                  ...(activeStep > index && index !== 2 && { bgcolor: 'primary.solidBg' }),
                },
              }}
            >
              <StepButton onClick={() => setActiveStep(index)}>{step}</StepButton>
            </Step>
          ))}
        </Stepper>

        {getActiveForm()}
      </div>
    </AuthLayout>
  );
};

export default SignUp;
