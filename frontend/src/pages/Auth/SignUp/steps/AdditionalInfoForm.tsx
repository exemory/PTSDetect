import { Box, Button, Checkbox, FormControl, FormHelperText, FormLabel, Radio, RadioGroup, Sheet } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useStore } from '@/store/useStore';
import { REGISTER_USER } from '@/graphql/mutations';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes';
import { Sex } from '@/__generated__/graphql';
import { toast } from 'react-toastify';

const formSchema = yup
  .object({
    gender: yup.mixed<Sex>().oneOf(Object.values(Sex)).required('Gender is required'),
    isMarried: yup.boolean().required('Married is required'),
  })
  .required();

export const AdditionalInfoForm = () => {
  const { account, personalDetails, additionalInfo, setAdditionalInfo, reset } = useStore((state) => state.signUp);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: additionalInfo,
  });
  const [registerUser, { loading }] = useMutation(REGISTER_USER);

  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    setAdditionalInfo(data);

    const formData = {
      email: account.email,
      password: account.password,
      firstname: personalDetails.firstName,
      lastname: personalDetails.lastName,
      birthdate: personalDetails.birthdate,
      sex: data.gender,
      isMarried: data.isMarried,
    };

    try {
      const { data: registerData } = await registerUser({ variables: { input: formData } });

      if (registerData?.registerUser.errors && registerData.registerUser.errors.length > 0) {
        console.log(registerData?.registerUser.errors);
        return;
      }

      toast.success('Account successfully created, please login');
      navigate(routes.SIGN_IN);
      reset();
    } catch (error) {
      console.error('Sign up error:', error);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4">
        <FormControl error={!!errors.gender}>
          <FormLabel>Gender</FormLabel>
          <RadioGroup defaultValue="MALE" {...register('gender')}>
            <div className="flex flex-col  gap-6">
              <Radio value="MALE" label="Male" {...register('gender')} />
              <Radio value="FEMALE" label="Female" {...register('gender')} />
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
          <Button loading={loading} type="submit" fullWidth>
            Sign Up
          </Button>
        </div>
      </div>
    </form>
  );
};
