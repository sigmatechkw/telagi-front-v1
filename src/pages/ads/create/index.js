import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import AdsForm from 'src/components/Ads/AdsForm'
import FormValidationSchema from 'src/views/forms/form-validation/FormValidationSchema'

const defaultValues = {
    title: "",
    description: "",
    expiration_period: "",
    expiration_date: "",
    price : "",
    phone: "",
    views: "",
    active: false,
    sold: false,
    approved: false,
    featured: false,
    featured_start_date: new Date(),
    featured_end_date: new Date(),
    home_end_date: new Date(),
    inside_end_date: new Date(),
    top_categories_end_date : new Date(),
    status: "",
    country_id: false,
    category_id: false,
    user_id: false,
    image : "",
    video : "",
    attributes : []
 }

const AdsCreate = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [adImg, setAdImg] = useState('')
  const [imgsArr, setImgsArr] = useState([])
  const [adsImgsArr, setAdsImgsArr] = useState([])
  const [videoSrc, setVideoSrc] = useState('')
  const [adVideo, setAdVideo] = useState('')
  const [content, setContent] = useState('')
  const [category_id , setCategoryId] = useState('')

  const auth = useSelector(state => state.auth)

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    setLoading(true)

    data.country_id = data.country_id?.id;
    data.category_id = data.category_id;
    data.user_id = data.user_id?.id;
    data.status = data.status?.id;

    data.image = imgSrc;    

    if(!imgSrc){ 
      delete data.image;
    }else{ 
      data.image = imgSrc;
    }

    if(!videoSrc){ 
      delete data.video;
    }else{ 
      data.video = videoSrc;
    }

    if(!imgsArr){ 
      delete data.imgsArr;
    }else{ 
      data.images = imgsArr;
    }

    //check for the new or updated attributes
    const attributes = [];
    data.attributes.forEach((dataAttribute) => { 
        const oldAttributeSet = attributes.find((e) => e.attribute_set_id == dataAttribute.attribute_set_id);
        if(oldAttributeSet) { 
          oldAttributeSet.value.push(dataAttribute.value);
        }else{ 
        }
        attributes.push({attribute_set_id : dataAttribute.attribute_set_id , value : [dataAttribute.value]});
    });
  
    data.attributes = attributes;

    axios
      .post(`${process.env.NEXT_PUBLIC_API_KEY}ads`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        router.push('/ads')
        reset()
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
        toast.error(error.response.data.message)
      })
  }

  return (
    <Card>
      <AdsForm
        getValues={getValues}
        type={'create'}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        adImg={adImg}
        setAdImg={setAdImg}
        imgsArr={imgsArr}
        setImgsArr={setImgsArr}
        adsImgsArr={adsImgsArr}
        setAdsImgsArr={setAdsImgsArr}
        videoSrc={videoSrc}
        setVideoSrc={setVideoSrc}
        adVideo={adVideo}
        setAdVideo={setAdVideo}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('ads_create')}
        loading={loading}
        content={content}
        setContent={setContent}
        category_id={category_id}
      />
    </Card>
  )
}

export default AdsCreate
