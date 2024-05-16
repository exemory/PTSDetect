import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import { Pencil } from 'lucide-react';
import { Checkbox, FormHelperText, Radio, RadioGroup, Sheet } from '@mui/joy';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Sex } from '@/__generated__/graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import { UPDATE_USER_AVATAR, UPDATE_USER_INFO } from '@/graphql/mutations';
import { useStore } from '@/store/useStore';
import { useEffect, useRef, useState } from 'react';
import avatarImage from '@/assets/images/avatar.jpg';
import { GET_UPLOAD_AVATAR_URL } from '@/graphql/queries';

const formSchema = yup
  .object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    birthdate: yup.string().required('Birthdate is required'),
    sex: yup.mixed<Sex>().oneOf(Object.values(Sex)).required('Gender is required'),
    isMarried: yup.boolean().required('Married is required'),
  })
  .required();

export const Profile = () => {
  const { user, setUserInfo, setAvatarUrl, avatarUrl } = useStore((state) => state);

  const [avatarPreview, setAvatarPreview] = useState<any>(null);
  const [avatarFile, setAvatarFile] = useState<any>(null);
  const inputFile = useRef<HTMLInputElement>(null);

  const [updateUserInfo, { loading }] = useMutation(UPDATE_USER_INFO);
  const [updateUserAvatar] = useMutation(UPDATE_USER_AVATAR);
  const [getUploadAvatarUrl] = useLazyQuery(GET_UPLOAD_AVATAR_URL);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const setDefaultValues = () => {
    if (user) {
      setValue('firstName', user.personalInfo?.firstName || '');
      setValue('lastName', user.personalInfo?.lastName || '');
      setValue('birthdate', user.personalInfo?.birthdate || '');
      setValue('sex', user.personalInfo?.sex || Sex.Male);
      setValue('isMarried', user.personalInfo?.isMarried || false);
    }
  };

  useEffect(() => {
    setDefaultValues();
  }, [user, setValue]);

  const handleAvatarChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatarFile(file);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (avatarFile) {
      const { data } = await getUploadAvatarUrl();

      if (data) {
        const { uploadUrl, avatarId } = data.uploadAvatarUrl;

        await fetch(uploadUrl, {
          method: 'PUT',
          body: avatarFile,
          headers: {
            'x-ms-blob-type': 'BlockBlob',
          },
        });

        await updateUserAvatar({
          variables: {
            input: {
              avatarId,
            },
          },
        }).then((res) => {
          if (res.data?.updateUserAvatar.avatarUrl) {
            setAvatarUrl(res.data.updateUserAvatar.avatarUrl);
          }
        });
      }
    }
  };

  const onAvatarEditClick = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    updateUserInfo({
      variables: {
        input: {
          firstname: data.firstName,
          lastname: data.lastName,
          birthdate: data.birthdate,
          sex: data.sex,
          isMarried: data.isMarried,
        },
      },
    });

    await handleAvatarUpload();

    setUserInfo({
      ...user,
      personalInfo: {
        ...data,
      },
    });
  });

  const onCansel = () => {
    setDefaultValues();
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Box
        sx={{
          bgcolor: 'background.body',
        }}
      >
        <Box mb={2}>
          <Typography level="h2" component="h1">
            My profile
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '960px',
          mx: 'auto',
        }}
        mt={2}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Personal info</Typography>
            <Typography level="body-sm">Customize how your profile information will apper to the networks.</Typography>
          </Box>

          <Divider />

          <form onSubmit={onSubmit}>
            <Stack direction="row" spacing={3} sx={{ display: { sm: 'flex-column', md: 'flex-row' }, my: 1 }}>
              <Stack direction="column" spacing={1}>
                <AspectRatio ratio="1" maxHeight={200} sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}>
                  <img src={avatarPreview || avatarUrl || avatarImage} alt="avatar" />
                </AspectRatio>

                <input type="file" id="avatar" hidden onChange={handleAvatarChange} ref={inputFile} />

                <IconButton
                  onClick={onAvatarEditClick}
                  aria-label="upload new picture"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: 'background.body',
                    position: 'absolute',
                    zIndex: 2,
                    borderRadius: '50%',
                    left: 100,
                    top: 170,
                    boxShadow: 'sm',
                  }}
                >
                  <Pencil size={16} />
                </IconButton>
              </Stack>

              <Stack direction="column" spacing={1} width="100%">
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

                <FormControl error={!!errors.sex}>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup>
                    <div className="flex gap-6">
                      <Radio
                        value={Sex.Male}
                        label="Male"
                        checked={watch('sex') === Sex.Male}
                        onChange={() => setValue('sex', Sex.Male)}
                      />
                      <Radio
                        value={Sex.Female}
                        label="Female"
                        checked={watch('sex') === Sex.Female}
                        onChange={() => setValue('sex', Sex.Female)}
                      />
                    </div>
                  </RadioGroup>

                  <FormHelperText>{errors.sex?.message}</FormHelperText>
                </FormControl>

                <FormControl error={!!errors.isMarried}>
                  <FormLabel>Married</FormLabel>
                  <Box
                    sx={{
                      '& > div': { p: 1.5, borderRadius: 'md', display: 'flex' },
                    }}
                  >
                    <Sheet variant="outlined">
                      <Checkbox
                        label="I am married"
                        overlay
                        {...register('isMarried')}
                        checked={watch('isMarried') === true}
                        onChange={(e) => setValue('isMarried', e.target.checked)}
                      />
                    </Sheet>
                  </Box>
                  <FormHelperText>{errors.isMarried?.message}</FormHelperText>
                </FormControl>
              </Stack>
            </Stack>

            <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral" onClick={onCansel}>
                  Reset
                </Button>
                <Button loading={loading} size="sm" variant="solid" type="submit">
                  Save
                </Button>
              </CardActions>
            </CardOverflow>
          </form>
        </Card>
      </Stack>
    </Box>
  );
};
