import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import CustomTextField from 'src/@core/components/mui/text-field';
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTranslation } from "react-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box, Checkbox, FormControlLabel, styled } from '@mui/material'

const CommercialCategoriesForm = ({ type = 'create', errors, control, watch, setValue, onSubmit, title, loading, imgSrc, setImgSrc, categoryImg, setCategoryImg, setDeleteImage = '', setImageModified = null }) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
  const { t, i18n } = useTranslation()

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
    try {
      const reader = new FileReader()
      const { files } = file.target
      if (files && files.length !== 0) {
        reader.onload = () => {
          // For edit mode, clear the URL and use base64 for both display and submission
          setImgSrc(reader.result);
          setCategoryImg(reader.result)
          // Mark image as modified when user uploads new image
          if (setImageModified) {
            setImageModified(true)
          }
        }
        reader.onerror = () => {
          console.error('Error reading file')
        }
        reader.readAsDataURL(files[0])
        // Clear the file input to prevent duplicate uploads
        file.target.value = ''
      }
    } catch (error) {
      console.error('Error handling image upload:', error)
    }
  }

  const handleInputImageReset = () => {
    try {
      setDeleteImage(true);
      setCategoryImg('')
      setImgSrc('')
      // Mark image as modified when user resets image
      if (setImageModified) {
        setImageModified(true)
      }
    } catch (error) {
      console.error('Error resetting image:', error)
    }
  }

  return (
    <>
      <CardHeader title={title} />
      <CardContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid container spacing={4} item md={12}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'between', alignItems: 'end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {imgSrc ? (
                    <ImgStyled
                      src={imgSrc}
                      alt={t('commercial_category')}
                      onError={(e) => {
                        console.error('Image failed to load:', imgSrc)
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <Box sx={{
                      width: 100,
                      height: 100,
                      border: '2px dashed #ccc',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 2
                    }}>
                      <Typography variant="caption" color="textSecondary">
                        {t('no_image')}
                      </Typography>
                    </Box>
                  )}
                  <div>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      {t('upload_Photo')}
                      <input
                        hidden
                        type='file'
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
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label={t('name_en')}
                      onChange={onChange}
                      required
                      error={Boolean(errors.name_en)}
                      aria-describedby='validation-basic-name_en'
                      {...(errors.name_en && { helperText: t('required') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='name_ar'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label={t('name_ar')}
                      onChange={onChange}
                      required
                      error={Boolean(errors.name_ar)}
                      aria-describedby='validation-basic-name_ar'
                      {...(errors.name_ar && { helperText: t('required') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='description_en'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      rows={4}
                      multiline
                      fullWidth
                      value={value}
                      label={t('description_en')}
                      onChange={onChange}
                      required
                      error={Boolean(errors.description_en)}
                      aria-describedby='validation-basic-description_en'
                      {...(errors.description_en && { helperText: t('required') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='description_ar'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      rows={4}
                      multiline
                      fullWidth
                      value={value}
                      label={t('description_ar')}
                      onChange={onChange}
                      required
                      error={Boolean(errors.description_ar)}
                      aria-describedby='validation-basic-description_ar'
                      {...(errors.description_ar && { helperText: t('required') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='order'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label={t('order')}
                      onChange={onChange}
                      error={Boolean(errors.order)}
                      aria-describedby='validation-basic-order'
                      {...(errors.order && { helperText: t('required') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
                <FormControl>
                  <Controller
                    name='active'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label={t('active')}
                        sx={errors.active ? { color: 'error.main' } : null}
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            name='validation-basic-active'
                            sx={errors.active ? { color: 'error.main' } : null}
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
                <FormControl>
                  <Controller
                    name='featured'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label={t('featured')}
                        sx={errors.featured ? { color: 'error.main' } : null}
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            name='validation-basic-featured'
                            sx={errors.featured ? { color: 'error.main' } : null}
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
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
          </Grid>
        </form>
      </CardContent>
    </>
  );
};

export default CommercialCategoriesForm;
