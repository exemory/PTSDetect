import { Button, FormControl, FormHelperText, FormLabel, Input } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useStore } from '@/store/useStore';

const formSchema = yup
  .object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    birthdate: yup.string().required('Birthdate is required'),
  })
  .required();

export const PersonalDetailsForm = () => {
  const { setActiveStep, personalDetails, setPersonalDetails } = useStore((state) => state.signUp);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: personalDetails,
  });

  const onSubmit = handleSubmit((data) => {
    setPersonalDetails(data);
    setActiveStep(2);
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        <FormControl error={!!errors.firstName}>
          <FormLabel>First name</FormLabel>
          <Input type="text" {...register('firstName')} />
          <FormHelperText>{errors.firstName?.message}</FormHelperText>
        </FormControl>

        <FormControl error={!!errors.lastName}>
          <FormLabel>Last name</FormLabel>
          <Input type="text" {...register('lastName')} />
          <FormHelperText>{errors.lastName?.message}</FormHelperText>
        </FormControl>

        <FormControl error={!!errors.birthdate}>
          <FormLabel>Birthdate</FormLabel>
          <Input type="date" {...register('birthdate')} />
          <FormHelperText>{errors.birthdate?.message}</FormHelperText>
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
