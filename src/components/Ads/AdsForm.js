import React from 'react'
import { useState, useEffect } from 'react'
import { Controller } from 'react-hook-form'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import { useTranslation } from 'react-i18next'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import { nanoid } from 'nanoid'
import { fetchAllCategories } from '../Categories/CategoriesServices'
import { fetchCountries } from '../Users/List/userListServices'
import { fetchUsersInfinityQuery } from '../Users/List/userListServices'
import { useInfiniteQuery } from '@tanstack/react-query'
import { styled } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { useTheme } from '@mui/material/styles'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import AdsSelectCategories from './AdsForm/AdsSelectCategories'
import AdsAttributesSetsForm from './AdsForm/AdsAttributesSetsForm'

const AdsForm = ({
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
  adImg,
  setAdImg,
  imgsArr,
  setImgsArr,
  adsImgsArr,
  setAdsImgsArr,
  videoSrc,
  setVideoSrc,
  adVideo,
  setAdVideo,
  category_id
}) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState([])
  const [countries, setCountries] = useState([])
  const [searchUsersTerm, setSearchUsersTerm] = useState('')

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  useEffect(() => {
    getCountries()
    getCategories()
  }, [])

  const getCategories = async () => {
    const data = await fetchAllCategories()
    setCategories(data)
  }

  const getCountries = async () => {
    const data = await fetchCountries()
    setCountries(data)
  }

  const {
    data: users,
    fetchNextPage: fetchUsersNextPage,
    hasNextPage: usersHasNextPage,
    isFetching: usersIsFetching,
    isFetchingNextPage: usersIsFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['fetchUsersInfinityQuery', searchUsersTerm],
    queryFn: fetchUsersInfinityQuery,
    getNextPageParam: lastPage => lastPage?.current_page + 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.current_page < lastPage.last_page ? lastPage?.current_page + 1 : undefined
    }
  })

  const loadMoreUsers = () => {
    if (usersHasNextPage) {
      fetchUsersNextPage()
    }
  }

  const usersOptions = users?.pages.flatMap(page => page.items) || []

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 100,
    height: 100,
    marginRight: theme.spacing(6),
    borderRadius: theme.shape.borderRadius
  }))

  const VideoStyled = styled('video')(({ theme }) => ({
    width: 100,
    height: 100,
    marginRight: theme.spacing(6),
    borderRadius: theme.shape.borderRadius,
    objectFit: 'cover'
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
        setAdImg(reader.result)
      }
    }
  }

  const handleInputVideoChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => {
        const fileDataUrl = reader.result;
        setVideoSrc(files[0]);     
        setAdVideo(fileDataUrl);
      };
      reader.readAsDataURL(files[0]);
    }
  }

  const handleInputImagesChange = event => {
    const { files } = event.target
    if (files && files.length > 0) {
      const promises = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()

        const promise = new Promise(resolve => {
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.readAsDataURL(file)
        })

        promises.push(promise)
      }

      Promise.all(promises).then(images => {
        setImgsArr(images)
        setAdsImgsArr(images)
      })
    }
  }

  const handleInputImageReset = () => {
    setAdImg('')
    setImgSrc('')
  }

  const handleInputImagesReset = () => {
    setImgsArr([])
    setAdsImgsArr([])
  }

  const handleInputVideoReset = () => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc)
    }
    setAdVideo(null)
    setVideoSrc(null)
  }

  const handleAddAttr = attributes => {
    if (attributes) {
      setValue('attributes', [...attributes, { id: nanoid(), attribute_set_id: '', value: '' }])
    } else {
      setValue('attributes', [{ id: nanoid(), attribute_set_id: '', value: '' }])
    }
  }

  const handleRemoveAttributes = (attributes, id) => {
    setValue(
      'attributes',
      attributes.filter(attr => attr.id !== id)
    )
  }

  return (
    <>
      <CardHeader title={title} />
      <CardContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid container spacing={4} item xs={6} md={9}>
              <Grid item md={6} sx={{ display: 'flex', justifyContent: 'between', alignItems: 'end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={imgSrc} alt={t('upload_Photo')} />
                  <div>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                      {t('upload_Photo')}
                      <input
                        hidden
                        type='file'
                        value={adImg}
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

              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'between', alignItems: 'end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {adVideo && (
                    <VideoStyled controls>
                      <source src={adVideo} type='video/mp4' />
                      Your browser does not support the video tag.
                    </VideoStyled>
                  )}
                  <div>
                    <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-video'>
                      {t('upload_video')}
                      <input
                        hidden
                        type='file'
                        accept='video/*'
                        onChange={handleInputVideoChange}
                        id='account-settings-upload-video'
                      />
                    </ButtonStyled>
                    <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputVideoReset}>
                      {t('Reset')}
                    </ResetButtonStyled>
                  </div>
                </Box>
              </Grid>

              <Grid item md={12} sx={{ display: 'flex', justifyContent: 'between', alignItems: 'end' }}>
                <Box sx={{ border: `1px solid ${theme.palette.secondary.another}`, p: 3, borderRadius: '5px' }}>
                  {imgsArr.map((img, index) => {
                    if (typeof img === 'object' && img !== null) {
                      return <ImgStyled key={index} src={img.url} alt={t('upload_Photo')} />
                    } else {
                      return <ImgStyled key={index} src={img} alt={t('upload_Photo')} />
                    }
                  })}
                  <ButtonStyled component='label' variant='contained' htmlFor='site-images'>
                    {t('upload_images')}
                    <input
                      hidden
                      multiple
                      type='file'
                      accept='image/png, image/jpeg'
                      onChange={handleInputImagesChange}
                      id='site-images'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='tonal' onClick={() => handleInputImagesReset(false)}>
                    {t('Reset')}
                  </ResetButtonStyled>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='title'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label={t('title')}
                      onChange={onChange}
                      required
                      error={Boolean(errors.title)}
                      aria-describedby='validation-basic-title'
                      {...(errors.title && { helperText: t('required') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='description'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label={t('description')}
                      onChange={onChange}
                      required
                      error={Boolean(errors.name_ar)}
                      aria-describedby='validation-basic-description'
                      {...(errors.description && { helperText: t('required') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='expiration_period'
                  control={control}
                  rules={{
                    required: false,
                    pattern: /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
                  }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='number'
                      steps={0.1}
                      value={value}
                      label={t('expiration_period')}
                      onChange={onChange}
                      required
                      error={Boolean(errors.expiration_period)}
                      aria-describedby='validation-basic-expiration_period'
                      {...(errors.expiration_period && { helperText: t('required') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='expiration_date'
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const dateValue = value ? new Date(value) : new Date() // Ensure value is a Date object

                    return (
                      <DatePicker
                        showTimeSelect
                        selected={dateValue}
                        id='locale-time'
                        dateFormat='MM/dd/yyyy h:mm aa'
                        onChange={newValue => onChange(newValue)}
                        customInput={<PickersComponent label={t('expiration_date')} />}
                      />
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name='price'
                  control={control}
                  rules={{
                    required: true,
                    pattern: /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
                  }}
                  render={({ field: { value, onChange } }) => (
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
                      {...(errors.price && { helperText: t('required') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='views'
                  control={control}
                  rules={{
                    required: false,
                    pattern: /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
                  }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='number'
                      steps={1}
                      value={value}
                      label={t('views')}
                      onChange={onChange}
                      error={Boolean(errors.views)}
                      aria-describedby='validation-basic-views'
                      {...(errors.views && { helperText: t('views') })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='featured_start_date'
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const dateValue = value ? new Date(value) : new Date() // Ensure value is a Date object

                    return (
                      <DatePicker
                        showTimeSelect
                        selected={dateValue}
                        id='locale-time'
                        dateFormat='MM/dd/yyyy h:mm aa'
                        onChange={newValue => onChange(newValue)}
                        customInput={<PickersComponent label={t('featured_start_date')} />}
                      />
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='featured_end_date'
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const dateValue = value ? new Date(value) : new Date() // Ensure value is a Date object

                    return (
                      <DatePicker
                        showTimeSelect
                        selected={dateValue}
                        id='locale-time'
                        dateFormat='MM/dd/yyyy h:mm aa'
                        onChange={newValue => onChange(newValue)}
                        customInput={<PickersComponent label={t('featured_end_date')} />}
                      />
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='user_id'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      value={value}
                      loading={usersIsFetching || usersIsFetchingNextPage}
                      ListboxProps={{
                        onScroll: event => {
                          const listboxNode = event.currentTarget
                          if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight) {
                            loadMoreUsers()
                          }
                        }
                      }}
                      onInputChange={(e, val) => setSearchUsersTerm(val)}
                      onChange={(e, newValue) => {
                        if (newValue) {
                          setValue('user_id', newValue)
                          onChange(newValue)
                        } else {
                          setValue('user_id', null)
                        }
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      options={usersOptions}
                      getOptionLabel={option => option.first_name || ''}
                      required
                      renderInput={params => <CustomTextField {...params} label={t('user')} />}
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
                    name='approved'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label={t('approved')}
                        sx={errors.approved ? { color: 'error.main' } : null}
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            name='validation-basic-approved'
                            sx={errors.approved ? { color: 'error.main' } : null}
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
                    name='sold'
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label={t('sold')}
                        sx={errors.sold ? { color: 'error.main' } : null}
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            name='validation-basic-sold'
                            sx={errors.sold ? { color: 'error.main' } : null}
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

              <Grid item xs={12} p={3}>
                <Controller
                  name='attributes'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant={'h4'}>{t('attributes')}</Typography>
                        <Button role='button' variant='contained' color='success' onClick={() => handleAddAttr(value)}>
                          {t('add')}
                        </Button>
                      </Box>
                      {value &&
                        value.length > 0 &&
                        value.map(attr => (
                          <AdsAttributesSetsForm
                            key={attr.id}
                            attr={attr}
                            errors={errors}
                            attributes={value}
                            setValue={setValue}
                            control={control}
                            handleRemoveAttributes={() => handleRemoveAttributes(value, attr.id)}
                          />
                        ))}
                    </Box>
                  )}
                />
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
              <AdsSelectCategories setValue={setValue} category_id={category_id} />
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </>
  )
}

export default AdsForm
