import React from 'react';
import {Controller} from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomTextField from 'src/@core/components/mui/text-field';
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import {useTranslation} from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import {useSelector} from "react-redux";
import { styled } from '@mui/material';
import { Box } from '@mui/system';

const PackagesForm = ({type = 'create', errors, control, watch, setValue, onSubmit, title, loading ,  imgSrc, setImgSrc, packageImg, setPackageImg}) => {
  const {t, i18n} = useTranslation();

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 100,
    height: 100,
    marginRight: theme.spacing(6),
    borderRadius: theme.shape.borderRadius
  }))

  const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const ResetButtonStyled = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: 0,
      textAlign: 'center',
      marginTop: theme.spacing(2)
    }
  }))

  const handleInputImageChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => {
        setImgSrc(reader.result)
      }
      reader.readAsDataURL(files[0])
      if (reader.result !== null) {
        setPackageImg(reader.result)
      }
    }
  }

  const handleInputImageReset = () => {
    setPackageImg('')
    setImgSrc('')
  }

  return (
    <>
      <CardHeader title={title} />
      <CardContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'between', alignItems: 'end' }}>
                <ImgStyled src={imgSrc} alt={t('package')} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    {t('upload_Photo')}
                    <input
                      hidden
                      type='file'
                      value={packageImg}
                      accept='image/*'
                      onChange={handleInputImageChange}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                    {t('Reset')}
                  </ResetButtonStyled>
                </div>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='name_en'
                control={control}
                render={({field: {value, onChange}}) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('name_en')}
                    onChange={onChange}
                    error={Boolean(errors.name_en)}
                    aria-describedby='validation-basic-name_en'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='name_ar'
                control={control}
                render={({field: {value, onChange}}) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('name_ar')}
                    onChange={onChange}
                    error={Boolean(errors.name_ar)}
                    aria-describedby='validation-basic-name_ar'
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name='description_en'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    rows={4}
                    fullWidth
                    multiline
                    {...field}
                    label={t('description_en')}
                    error={Boolean(errors.description_ar)}
                    aria-describedby='validation-basic-description_en'
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name='description_ar'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    rows={4}
                    fullWidth
                    multiline
                    {...field}
                    label={t('description_ar')}
                    error={Boolean(errors.description_ar)}
                    aria-describedby='validation-basic-description_ar'
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='price'
                control={control}
                rules={
                  {
                    required: true,
                    pattern: /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
                  }
                }
                render={({field: {value, onChange}}) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    steps={0.1}
                    value={value}
                    label={t('price')}
                    onChange={onChange}
                    required
                    error={Boolean(errors.price)}
                    aria-describedby='validation-basic-price'
                    {...(errors.price && {helperText: t('required')})}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='order'
                control={control}
                rules={
                  {
                    pattern: /^\d+$/
                  }
                }
                render={({field: {value, onChange}}) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    steps={1}
                    value={value}
                    label={t('order')}
                    onChange={onChange}
                    error={Boolean(errors.order)}
                    aria-describedby='validation-basic-order'
                    {...(errors.order && {helperText: t('number_validation')})}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='expiration_period'
                control={control}
                rules={
                  {
                    pattern: /^\d+$/
                  }
                }
                render={({field: {value, onChange}}) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    steps={1}
                    value={value}
                    label={t('expiration_period')}
                    onChange={onChange}
                    error={Boolean(errors.expiration_period)}
                    aria-describedby='validation-basic-expiration_period'
                    {...(errors.expiration_period && {helperText: t('number_validation')})}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='featured_period'
                control={control}
                rules={
                  {
                    pattern: /^\d+$/
                  }
                }
                render={({field: {value, onChange}}) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    steps={1}
                    value={value}
                    label={t('featured_period')}
                    onChange={onChange}
                    error={Boolean(errors.featured_period)}
                    aria-describedby='validation-basic-featured_period'
                    {...(errors.featured_period && {helperText: t('number_validation')})}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sx={{pt: theme => `${theme.spacing(2)} !important`}}>
              <FormControl>
                <Controller
                  name='active'
                  control={control}
                  render={({field}) => (
                    <FormControlLabel
                      label={t('active')}
                      sx={errors.active ? {color: 'error.main'} : null}
                      control={
                        <Checkbox
                          {...field}
                          checked={!!field.value}
                          name='validation-basic-active'
                          sx={errors.active ? {color: 'error.main'} : null}
                        />
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' disabled={loading}>
                {
                  loading ?
                    <CircularProgress size={'1.5rem'} />
                    :
                    t('save')
                }
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </>
  );
};

export default PackagesForm;
