import { Button, FormControl, FormHelperText, FormLabel, Input } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const formSchema = yup
  .object({
    username: yup.string().required('Username is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
  })
  .required();

export const PersonalDetailsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        <FormControl error={!!errors.username}>
          <FormLabel>Username</FormLabel>
          <Input type="text" {...register('username')} />
          <FormHelperText>{errors.username?.message}</FormHelperText>
        </FormControl>

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

        <div className="flex flex-col mt-6">
          <Button type="submit" fullWidth>
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};
