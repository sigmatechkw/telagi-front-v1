import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTranslation } from 'react-i18next'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { nanoid } from 'nanoid'
import { Box, Checkbox, FormControlLabel, styled } from '@mui/material'
import { fetchAllCategories } from 'src/components/Categories/CategoriesServices'
import { fetchAttributesSetsTypes } from './AttributesSetsServices'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import AttributesSetsSelectCategories from './AttributesSetsForm/AttributesSetsSelectCategories'

const AttributesSetsForm = ({
  type = 'create',
  errors,
  control,
  watch,
  setValue,
  onSubmit,
  title,
  loading,
  imgSrc,
  setImgSrc,
  attributeSetImg,
  setAttributeSet,
  category_ids = [],
  setDeleteImage = ''
}) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
  const [categories, setCategories] = useState([])
  const [attributeTypes, setAttributeTypes] = useState([])
  const { t, i18n } = useTranslation()

  useEffect(() => {
    getCategories()
    getAttributesTypes()
  }, [])

  const getCategories = async () => {
    const data = await fetchAllCategories()
    setCategories(data)
  }

  const getAttributesTypes = async () => {
    const data = await fetchAttributesSetsTypes()
    setAttributeTypes(data)
  }

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
        setAttributeSet(reader.result)
      }
    }
  }

  const handleInputImageReset = () => {
    setDeleteImage(true)
    setAttributeSet('')
    setImgSrc('')
  }

  return (
    <>
      <CardHeader title={title} />
      <CardContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid container spacing={4} item md={9}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'between', alignItems: 'end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={imgSrc} alt={t('attributes_sets')} />
                  <div>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      {t('upload_Photo')}
                      <input
                        hidden
                        type='file'
                        value={attributeSetImg}
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
                      error={Boolean(errors.title)}
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
                      error={Boolean(errors.title)}
                      aria-describedby='validation-basic-name_ar'
                      {...(errors.name_en && { helperText: t('required') })}
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

              <Grid item xs={12} sm={6}>
                <Controller
                  name='type'
                  control={control}
                  rules={{ required: true }}

                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      value={value}
                      onChange={(e, newValue) => {
                        if (newValue) {
                          setValue('type', newValue)
                          onChange(newValue)
                        } else {
                          setValue('type', null)
                        }
                      }}
                      
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      options={attributeTypes}
                      getOptionLabel={option => option.name || ''}
                      renderInput={params => <CustomTextField required  {...params} label={t('type')} />}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
                <FormControl>
                  <Controller
                    name='required'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label={t('required')}
                        sx={errors.required ? { color: 'error.main' } : null}
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            name='validation-basic-required'
                            sx={errors.required ? { color: 'error.main' } : null}
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

              <Grid item xs={12}>
                <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
              </Grid>

              <Grid item xs={12}>
                <Button type='submit' variant='contained' disabled={loading}>
                  {loading ? <CircularProgress size={'1.5rem'} /> : t('save')}
                </Button>
              </Grid>

            </Grid>

            <Grid item md={3}>
              <AttributesSetsSelectCategories setValue={setValue} category_ids={category_ids}/>
            </Grid>

          </Grid>
        </form>
      </CardContent>
    </>
  )
}

export default AttributesSetsForm
