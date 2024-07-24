import React from 'react';
import {useState , useEffect} from 'react';
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
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {Box} from "@mui/system";
import {nanoid} from "nanoid";
import { fetchAllCategories } from '../Categories/CategoriesServices';
import { fetchCountries } from '../Users/List/userListServices';
import { fetchUsersInfinityQuery } from '../Users/List/userListServices';

const AdsForm = ({type = 'create', errors, control, watch, setValue, onSubmit, title, loading}) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
  const {t, i18n} = useTranslation()
  const [categories , setCategories] = useState([]);
  const [countries , setCountries] = useState([]);
  const [searchUsersTerm, setSearchUsersTerm] = useState('');


  useEffect(() => { 
    getCountries();
    getCategories();
  } , [])

  const getCategories = async() => {
    const data = await fetchAllCategories()
    setCategories(data);
  }
  const getCountries = async() => {
    const data = await fetchCountries()
    setCountries(data)
  }

  const {
    data : users,
    fetchNextPage : fetchUsersNextPage,
    hasNextPage : usersHasNextPage,
    isFetching : usersIsFetching,
    isFetchingNextPage : usersIsFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['fetchUsersInfinityQuery', searchUsersTerm],
    queryFn: fetchUsersInfinityQuery,
    getNextPageParam: (lastPage) => lastPage?.current_page + 1,
     getNextPageParam: (lastPage, allPages) => {
      return lastPage.current_page < lastPage.last_page ? lastPage?.current_page + 1 : undefined;
    },
  });

  
  const loadMoreUsers = () => {
    if (usersHasNextPage) {
      fetchUsersNextPage();
    }
  };

  const usersOptions = users?.pages.flatMap((page) => page.items) || [];  

  return (
    <>
      <CardHeader title={title} />
      <CardContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>

            <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'between', alignItems: 'end' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={imgSrc} alt={t('category')} />
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
                    <ImgStyled src={imgSrc} alt={t('category')} />
                    <div>
                      <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                        {t('upload_Photos')}
                        <input
                          hidden
                          type='file'
                          value={adsImgs}
                          accept='image/*'
                          onChange={handleInputImageChange}
                          multiple
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
                    <ImgStyled src={imgSrc} alt={t('category')} />
                    <div>
                      <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                        {t('upload_Photos')}
                        <input
                          hidden
                          type='file'
                          value={adsImgs}
                          accept='video/*'
                          onChange={handleInputImageChange}
                          id='account-settings-upload-video'
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
                  name='title'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label={t('title')}
                      onChange={onChange}
                      required
                      error={Boolean(errors.title)}
                      aria-describedby='validation-basic-title'
                      {...(errors.title && {helperText: t('required')})}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='description'
                  control={control}
                  rules={{required: true}}
                  render={({field: {value, onChange}}) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      label={t('description')}
                      onChange={onChange}
                      required
                      error={Boolean(errors.name_ar)}
                      aria-describedby='validation-basic-description'
                      {...(errors.description && {helperText: t('required')})}
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
                      required: false,
                      pattern: /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
                    }
                  }
                  render={({field: {value, onChange}}) => (
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
                      {...(errors.expiration_period && {helperText: t('required')})}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='start_date'
                  control={control}
                  render={({ field: { value } }) => (
                    <DatePicker
                      showTimeSelect
                      selected={value ? value : new Date()}
                      id='locale-time'
                      dateFormat='MM/dd/yyyy h:mm aa'
                      popperPlacement={popperPlacement} // Set the popperPlacement if needed
                      onChange={newValue => setValue('start_date', newValue)}
                      customInput={<PickersComponent label={'start date'} />}
                    />
                  )}
                /></Grid>

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
                  name='phone'
                  control={control}
                  rules={
                    {
                      required: false,
                      pattern: /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
                    }
                  }
                  render={({field: {value, onChange}}) => (
                    <CustomTextField
                      fullWidth
                      type='number'
                      steps={1}
                      value={value}
                      label={t('phone')}
                      onChange={onChange}
                      error={Boolean(errors.phone)}
                      aria-describedby='validation-basic-phone'
                      {...(errors.phone && {helperText: t('phone')})}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='views'
                  control={control}
                  rules={
                    {
                      required: false,
                      pattern: /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
                    }
                  }
                  render={({field: {value, onChange}}) => (
                    <CustomTextField
                      fullWidth
                      type='number'
                      steps={1}
                      value={value}
                      label={t('views')}
                      onChange={onChange}
                      error={Boolean(errors.views)}
                      aria-describedby='validation-basic-views'
                      {...(errors.views && {helperText: t('views')})}
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
                            checked={field.value}
                            name='validation-basic-active'
                            sx={errors.active ? {color: 'error.main'} : null}
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{pt: theme => `${theme.spacing(2)} !important`}}>
                <FormControl>
                  <Controller
                    name='sold'
                    control={control}
                    render={({field}) => (
                      <FormControlLabel
                        label={t('sold')}
                        sx={errors.sold ? {color: 'error.main'} : null}
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            name='validation-basic-sold'
                            sx={errors.sold ? {color: 'error.main'} : null}
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{pt: theme => `${theme.spacing(2)} !important`}}>
                <FormControl>
                  <Controller
                    name='featured'
                    control={control}
                    render={({field}) => (
                      <FormControlLabel
                        label={t('featured')}
                        sx={errors.featured ? {color: 'error.main'} : null}
                        control={
                          <Checkbox
                            {...field}
                            checked={field.value}
                            name='validation-basic-featured'
                            sx={errors.featured ? {color: 'error.main'} : null}
                          />
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name='featured_start_date'
                  control={control}
                  render={({ field: { value } }) => (
                    <DatePicker
                      showTimeSelect
                      selected={value ? value : new Date()}
                      id='locale-time'
                      dateFormat='MM/dd/yyyy h:mm aa'
                      popperPlacement={popperPlacement} 
                      onChange={newValue => setValue('featured_start_date', newValue)}
                      customInput={<PickersComponent label={t('featured_start_date')} />}
                    />
                  )}
                /></Grid>


              <Grid item xs={12} sm={6}>
                <Controller
                  name='featured_end_date'
                  control={control}
                  render={({ field: { value } }) => (
                    <DatePicker
                      showTimeSelect
                      selected={value ? value : new Date()}
                      id='locale-time'
                      dateFormat='MM/dd/yyyy h:mm aa'
                      popperPlacement={popperPlacement} // Set the popperPlacement if needed
                      onChange={newValue => setValue('featured_end_date', newValue)}
                      customInput={<PickersComponent label={t('featured_end_date')} />}
                    />
                  )}
                /></Grid>

                <Grid item xs={12} sm={6}>
                <Controller
                  name='status'
                  control={control}
                  rules={
                    {
                      required: false,
                      pattern: /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/
                    }
                  }
                  render={({field: {value, onChange}}) => (
                    <CustomTextField
                      fullWidth
                      type='number'
                      steps={1}
                      value={value}
                      label={t('status')}
                      onChange={onChange}
                      error={Boolean(errors.status)}
                      aria-describedby='validation-basic-status'
                      {...(errors.status && {helperText: t('status')})}
                    />
                  )}
                />
              </Grid>

                <Grid item xs={12} sm={6}>
                <Controller
                  name='country_id'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomAutocomplete
                      value={value}
                      onChange={(e, newValue) => {
                        if (newValue) {
                          setValue('country_id', newValue)
                          onChange(newValue)
                        } else {
                          setValue('country_id', null)
                        }
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      options={countries}
                      getOptionLabel={option => option.name || ''}
                      renderInput={params => <CustomTextField {...params}
                      label={t('country')} />}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
              <Controller
                name='category_id'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    value={value}
                    onChange={(e, newValue) => {
                      if (newValue) {
                        setValue('category_id', newValue)
                        onChange(newValue)
                      } else {
                        setValue('category_id', null)
                      }
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    options={categories}
                    getOptionLabel={option => option.name || ''}
                    required
                    renderInput={params => <CustomTextField {...params}
                    label={t('category')} />}
                  />
                )}
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
                      onScroll: (event) => {
                        const listboxNode = event.currentTarget;
                        if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight) {
                          loadMoreUsers();
                        }
                      },
                    }}
                    onInputChange={(e , val) => setSearchUsersTerm(val)}
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
                    renderInput={params => <CustomTextField {...params}
                     label={t('user')} />}
                  />
                )}
              />
            </Grid>

              {/* need to add 
                  image   string  optional  
                  video   string  optional  
                  images   string[]  optional  
               */}

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

export default AdsForm;
