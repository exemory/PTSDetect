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
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/i18n';

const formSchema = yup
  .object({
    firstName: yup.string().required(i18n.t('validations.first-name-required')),
    lastName: yup.string().required(i18n.t('validations.last-name-required')),
    birthdate: yup.string().required(i18n.t('validations.birthdate-required')),
    sex: yup.mixed<Sex>().oneOf(Object.values(Sex)).required(i18n.t('validations.gender-required')),
    isMarried: yup.boolean().required(i18n.t('validations.married-required')),
  })
  .required();

export const Profile = () => {
  const { t } = useTranslation();
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
            {t('profile.my-profile')}
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
            <Typography level="title-md">{t('profile.title')}</Typography>
            <Typography level="body-sm">{t('profile.sub-title')}</Typography>
          </Box>

          <Divider />

          <form onSubmit={onSubmit}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ my: 1 }}>
              <Stack direction="column" spacing={1}>
                <AspectRatio ratio="1" maxHeight={200} sx={{ flex: 1, width: 120, borderRadius: '100%' }}>
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
                  <FormLabel>{t('profile.first-name')}</FormLabel>
                  <Input type="text" {...register('firstName')} />
                  <FormHelperText>{errors.firstName?.message}</FormHelperText>
                </FormControl>

                <FormControl error={!!errors.lastName}>
                  <FormLabel>{t('profile.last-name')}</FormLabel>
                  <Input type="text" {...register('lastName')} />
                  <FormHelperText>{errors.lastName?.message}</FormHelperText>
                </FormControl>

                <FormControl error={!!errors.birthdate}>
                  <FormLabel>{t('profile.birthdate')}</FormLabel>
                  <Input type="date" {...register('birthdate')} />
                  <FormHelperText>{errors.birthdate?.message}</FormHelperText>
                </FormControl>

                <FormControl error={!!errors.sex}>
                  <FormLabel>{t('profile.gender')}</FormLabel>
                  <RadioGroup>
                    <div className="flex gap-6">
                      <Radio
                        value={Sex.Male}
                        label={t('profile.male')}
                        checked={watch('sex') === Sex.Male}
                        onChange={() => setValue('sex', Sex.Male)}
                      />
                      <Radio
                        value={Sex.Female}
                        label={t('profile.female')}
                        checked={watch('sex') === Sex.Female}
                        onChange={() => setValue('sex', Sex.Female)}
                      />
                    </div>
                  </RadioGroup>

                  <FormHelperText>{errors.sex?.message}</FormHelperText>
                </FormControl>

                <FormControl error={!!errors.isMarried}>
                  <FormLabel>{t('profile.married')}</FormLabel>
                  <Box
                    sx={{
                      '& > div': { p: 1.5, borderRadius: 'md', display: 'flex' },
                    }}
                  >
                    <Sheet variant="outlined">
                      <Checkbox
                        label={t('profile.i-am-married')}
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
                  {t('profile.reset')}
                </Button>
                <Button loading={loading} size="sm" variant="solid" type="submit">
                  {t('profile.save')}
                </Button>
              </CardActions>
            </CardOverflow>
          </form>
        </Card>
      </Stack>
    </Box>
  );
};
