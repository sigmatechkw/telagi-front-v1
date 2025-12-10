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
import { Box, styled } from '@mui/material'
import CommercialCategoriesSelectForm from '../CommercialCategories/CommercialCategoriesSelectForm'

const CommercialAdsForm = ({ type = 'create', errors, control, watch, setValue, onSubmit, title, loading, imagesSrc, setImagesSrc, adImages, setAdImages, commercial_category_id = '', setDeleteImages = '', onRemoveImage = null }) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
  const { t, i18n } = useTranslation()
  const [fileInputKey, setFileInputKey] = useState(0)

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 100,
    height: 100,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  }))

  const ImgFallback = styled(Box)(({ theme }) => ({
    width: 100,
    height: 100,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default
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

  const handleInputImagesChange = file => {
    try {
      const { files } = file.target
      if (files && files.length !== 0) {
        Array.from(files).forEach(file => {
          const reader = new FileReader()
          reader.onload = () => {
            setImagesSrc(prev => [...prev, reader.result]);
            setAdImages(prev => [...prev, reader.result])
          }
          reader.onerror = () => {
            console.error('Error reading file:', file.name)
          }
          reader.readAsDataURL(file)
        })
        // Clear the file input to prevent duplicate uploads
        file.target.value = ''
        // Reset the file input key to force a fresh input
        setFileInputKey(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error handling images upload:', error)
    }
  }

  const handleInputImagesReset = () => {
    setDeleteImages(true);
    setAdImages([])
    setImagesSrc([])
    setFileInputKey(prev => prev + 1)
  }

  const removeImage = (index) => {
    if (onRemoveImage) {
      onRemoveImage(index)
    } else {
      setImagesSrc(prev => prev.filter((_, i) => i !== index))
      setAdImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  return (
    <>
      <CardHeader title={title} />
      <CardContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'between', alignItems: 'end' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
                  {imagesSrc.map((img, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <ImgStyled
                        src={typeof img === 'string' ? img : img.url || img.image || img}
                        alt={t('commercial_ad')}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <ImgFallback sx={{ display: 'none' }}>
                        <Typography variant="caption" color="textSecondary">
                          {t('image_error')}
                        </Typography>
                      </ImgFallback>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          minWidth: 'auto',
                          width: 24,
                          height: 24,
                          borderRadius: '50%'
                        }}
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </Button>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-images'>
                    {t('upload_Photos')}
                    <input
                      key={`file-input-${fileInputKey}`}
                      hidden
                      type='file'
                      accept='image/*'
                      multiple
                      onChange={handleInputImagesChange}
                      id='account-settings-upload-images'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImagesReset}>
                    {t('Reset')}
                  </ResetButtonStyled>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='title_en'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('title_en')}
                    onChange={onChange}
                    required
                    error={Boolean(errors.title_en)}
                    aria-describedby='validation-basic-title_en'
                    {...(errors.title_en && { helperText: t('required') })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='title_ar'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('title_ar')}
                    onChange={onChange}
                    required
                    error={Boolean(errors.title_ar)}
                    aria-describedby='validation-basic-title_ar'
                    {...(errors.title_ar && { helperText: t('required') })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('phone')}
                    onChange={onChange}
                    required
                    error={Boolean(errors.phone)}
                    aria-describedby='validation-basic-phone'
                    {...(errors.phone && { helperText: t('required') })}
                  />
                )}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <Controller
                name='phone_secondary'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('phone_secondary')}
                    onChange={onChange}
                    error={Boolean(errors.phone_secondary)}
                    aria-describedby='validation-basic-phone_secondary'
                    {...(errors.phone_secondary && { helperText: t('required') })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='phone_third'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('phone_third')}
                    onChange={onChange}
                    error={Boolean(errors.phone_third)}
                    aria-describedby='validation-basic-phone_third'
                    {...(errors.phone_third && { helperText: t('required') })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='whatsapp'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('whatsapp')}
                    onChange={onChange}
                    required
                    error={Boolean(errors.whatsapp)}
                    aria-describedby='validation-basic-whatsapp'
                    {...(errors.whatsapp && { helperText: t('required') })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='whatsapp_secondary'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('whatsapp_secondary')}
                    onChange={onChange}
                    error={Boolean(errors.whatsapp_secondary)}
                    aria-describedby='validation-basic-whatsapp_secondary'
                    {...(errors.whatsapp_secondary && { helperText: t('required') })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='whatsapp_third'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label={t('whatsapp_third')}
                    onChange={onChange}
                    error={Boolean(errors.whatsapp_third)}
                    aria-describedby='validation-basic-whatsapp_third'
                    {...(errors.whatsapp_third && { helperText: t('required') })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='start_date'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='date'
                    value={value}
                    label={t('start_date')}
                    onChange={onChange}
                    required
                    error={Boolean(errors.start_date)}
                    aria-describedby='validation-basic-start_date'
                    {...(errors.start_date && { helperText: t('required') })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='end_date'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='date'
                    value={value}
                    label={t('end_date')}
                    onChange={onChange}
                    required
                    error={Boolean(errors.end_date)}
                    aria-describedby='validation-basic-end_date'
                    {...(errors.end_date && { helperText: t('required') })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CommercialCategoriesSelectForm commercial_category_id={commercial_category_id} setValue={setValue} control={control} />
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
        </form>
      </CardContent>
    </>
  );
};

export default CommercialAdsForm;
