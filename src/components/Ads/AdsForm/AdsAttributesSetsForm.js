import React, {useEffect, useState} from 'react';
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
import Card from "@mui/material/Card";
import CustomAutocomplete from 'src/@core/components/mui/autocomplete';
import { fetchAttributesSetsInfinityQuery } from 'src/components/AttributesSets/AttributesSetsServices';
import { useInfiniteQuery } from '@tanstack/react-query';


const AdsAttributesSetsForm = ({attr, errors, attributes, setValue, control, handleRemoveAttributes}) => {
  const {t, i18n} = useTranslation()
  const [currentAttibuteSet, setCurrentAttibuteSet] = useState(attr)
  const [currentAttibutes, setCurrentAttibute] = useState([])
  const [searchAttributesSetsTerm, setSearchAttributesSetsTerm] = useState('');
  
  const {
    data : attributesSets,
    fetchNextPage : fetchAttributesSetsNextPage,
    hasNextPage : attributesSetsHasNextPage,
    isFetching : attributesSetsIsFetching,
    isFetchingNextPage : attributesSetsIsFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['fetchAttributesSetsInfinityQuery', searchAttributesSetsTerm],
    queryFn: fetchAttributesSetsInfinityQuery,
    getNextPageParam: (lastPage) => lastPage?.current_page + 1,
     getNextPageParam: (lastPage, allPages) => {
      return lastPage.current_page < lastPage.last_page ? lastPage?.current_page + 1 : undefined;
    },
  });

  
  const loadMoreAttributesSets = () => {
    if (attributesSetsHasNextPage) {
      fetchAttributesSetsNextPage();
    }
  };

  const AttributesSetsOptions = attributesSets?.pages.flatMap((page) => page.items) || [];  

  const handleChangeAttributeSet = (e) => {
    setCurrentAttibuteSet(prev => {
      return {
        ...prev,
        attribute_set_id : e?.id || '',
        value: ''
      }
    })
    setCurrentAttibute(e?.attributes || []);
  }

  const handleChangeAttribute = (e) => {
    setCurrentAttibuteSet(prev => {
      return {
        ...prev,
        value : e?.id || '',
      }
    })
  }

  useEffect(() => {
    const updatedAttribute = attributes.map(item => 
      item.id === attr.id ? { ...item, attribute_set_id: currentAttibuteSet?.attribute_set_id , value: currentAttibuteSet?.value } : item
    );
    setValue('attributes', updatedAttribute)
  }, [currentAttibuteSet])

  return (
    <>
      <Card sx={{mb: 3}}>
        <CardContent>
          <Grid container spacing={4} sx={{display: 'flex', alignItems: 'end'}}>

          <Grid item xs={12} sm={6}>
                  <CustomAutocomplete
                    loading={attributesSetsIsFetching || attributesSetsIsFetchingNextPage}
                    ListboxProps={{
                      onScroll: (event) => {
                        const listboxNode = event.currentTarget;
                        if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight) {
                          loadMoreAttributesSets();
                        }
                      },
                    }}
                    onInputChange={(e , val) => setSearchAttributesSetsTerm(val)}
                    onChange={(e, newValue) => {
                      if (newValue) {
                        handleChangeAttributeSet(newValue)
                      } else {
                        handleChangeAttributeSet('')
                      }
                    }}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    options={AttributesSetsOptions}
                    getOptionLabel={option => option.name || ''}
                    required
                    renderInput={params => <CustomTextField {...params}
                     label={t('attributes_sets')} />}
                  />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomAutocomplete
                onChange={(e, newValue) => {
                  if (newValue) {
                    handleChangeAttribute(newValue)
                  } else {
                    handleChangeAttribute('')
                  }
                }}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                options={currentAttibutes}
                getOptionLabel={option => option.name || ''}
                renderInput={params => <CustomTextField {...params}
                label={t('attributes')} />}
              />
              </Grid>

            <Grid item xs={12} sm={2}>
              <Button role='button' variant='contained' color='error' onClick={handleRemoveAttributes}>
                {t('remove')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default AdsAttributesSetsForm;
