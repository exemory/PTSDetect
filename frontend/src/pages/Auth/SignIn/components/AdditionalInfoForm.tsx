import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Sheet,
} from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const formSchema = yup
  .object({
    birthdate: yup.string().required('Birthdate is required'),
    gender: yup.string().required('Gender is required'),
    isMarried: yup.string().required('Married is required'),
  })
  .required();

export const AdditionalInfoForm = () => {
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
        <FormControl error={!!errors.birthdate}>
          <FormLabel>Birthdate</FormLabel>
          <Input type="date" {...register('birthdate')} />
          <FormHelperText>{errors.birthdate?.message}</FormHelperText>
        </FormControl>

        <FormControl error={!!errors.gender}>
          <FormLabel>Gender</FormLabel>
          <RadioGroup defaultValue="male" {...register('gender')}>
            <div className="flex items-center gap-6">
              <Radio value="male" label="Male" {...register('gender')} />
              <Radio value="female" label="Female" {...register('gender')} />
            </div>
          </RadioGroup>
          <FormHelperText>{errors.gender?.message}</FormHelperText>
        </FormControl>

        <FormControl error={!!errors.isMarried}>
          <FormLabel>Married</FormLabel>
          <Box
            sx={{
              '& > div': { p: 1.5, borderRadius: 'md', display: 'flex' },
            }}
          >
            <Sheet variant="outlined">
              <Checkbox label="I am married" overlay {...register('isMarried')} />
            </Sheet>
          </Box>
          <FormHelperText>{errors.isMarried?.message}</FormHelperText>
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
