import { AuthLayout } from '@/pages/Auth/components';
import { routes } from '@/routes';
import { Link, Step, StepButton, StepIndicator, Stepper, Typography, stepClasses } from '@mui/joy';
import { NavLink } from 'react-router-dom';
import { Check } from 'lucide-react';
import { AdditionalInfoForm, AccountForm, PersonalDetailsForm } from '@/pages/Auth/SignUp/steps';
import { useStore } from '@/store/useStore';

export const SignUp = () => {
  const { steps, activeStep, setActiveStep } = useStore((state) => state.signUp);

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

        <Stepper
          sx={{
            [`& .${stepClasses.disabled} *`]: {
              color: 'neutral.plainDisabledColor',
              cursor: 'default',
            },
          }}
        >
          {steps.map((step, index) => (
            <Step
              key={step}
              indicator={
                <StepIndicator
                  variant={activeStep <= index ? 'soft' : 'solid'}
                  color={activeStep < index ? 'neutral' : 'primary'}
                >
                  {activeStep <= index ? index + 1 : <Check size={16} />}
                </StepIndicator>
              }
              disabled={activeStep < index}
            >
              <StepButton onClick={() => activeStep >= index && setActiveStep(index)}>{step}</StepButton>
            </Step>
          ))}
        </Stepper>

        {getActiveForm()}
      </div>
    </AuthLayout>
  );
};
