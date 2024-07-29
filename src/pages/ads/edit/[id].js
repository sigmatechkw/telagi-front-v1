import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchAdsDetails } from 'src/components/Ads/Details/adsDetailsServices'
import AdsForm from 'src/components/Ads/AdsForm'
import { nanoid } from 'nanoid'

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
    featured: false,
    featured_start_date: false,
    featured_end_date: false,
    status: false,
    country_id: false,
    category_id: false,
    user_id: false,
    image : "",
    images: [],
    video : "",
    attributes : []
}

const AdsEdit = ({ type, id }) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
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

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })
  

  const onSubmit = data => {
    setLoading(true)

    data.country_id = data.country_id?.id;
    data.category_id = data.category_id;
    data.user_id = data.user_id?.id;

    if(!imgSrc){ 
      delete data.image;
    }else{ 
      if(type.image == imgSrc){
        delete data.image;
      }else{ 
        data.image = imgSrc;
      }
    }

    if(!videoSrc){ 
      delete data.video;
    }else{ 
      if(type.video == videoSrc){
        delete data.video;
      }else{ 
        data.video = videoSrc;
        data.deleted_videos_ids = type.video?.id;
      }
    }

    if(!imgsArr){ 
      delete data.imgsArr;
    }else{ 
      if(type.images == imgsArr){
        delete data.images;
      }else{ 
        data.images = imgsArr;
        data.deleted_images_ids = type.images.map(image => image?.id);
      }
    }

    if(!type.expiration_date){ 
      delete data.expiration_date
    }

    if(!type.featured_start_date){ 
      delete data.featured_start_date
    }

    if(!type.featured_end_date){
      delete data.featured_end_date
    }

    const attributes = [];
    //check for the new or updated attributes
    data.attributes.forEach((dataAttribute) => { 
        const oldAttribute = type.ad_attributes.find((e) => e.attribute_set?.id == dataAttribute.attribute_set_id) || {};

        if(dataAttribute.attribute_set_id != oldAttribute.attribute_set?.id){ 
          attributes.push(dataAttribute);

          return
        }

        if(dataAttribute.value != oldAttribute.attributes[0]?.id){ 
          attributes.push(dataAttribute);
          
          return
        }
    });

    data.attributes = attributes;

    axios
      .put(`${process.env.NEXT_PUBLIC_API_KEY}ads/${id}`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        router.push(`/ads/details/${id}`)
        reset()
      })
      .catch(error => {
        setLoading(false)
        toast.error(error.response.data.message)
      })
  }

  const fetchAdsDetails = async () => {
    setValue('title', type.title)
    setValue('description', type.description)
    setValue('expiration_period', type.expiration_period)
    setValue('expiration_date', type.expiration_date)
    setValue('price', type.price)
    setValue('phone', type.phone)
    setValue('views', type.views)
    setValue('active', type.active)
    setValue('sold', type.sold)
    setValue('featured', type.featured)
    setValue('featured_start_date', type.featured_start_date)
    setValue('featured_end_date', type.featured_end_date)
    setValue('status', type.status)
    setValue('country_id', type.country)
    setValue('category_id', type.category?.id)
    setCategoryId(type.category?.id)
    setValue('user_id', type.user)
    setValue('image', type.image)
    setImgSrc(type.image);
    setValue('images', type.images)
    setImgsArr(type.images)
    setValue('video', type.video)
    setVideoSrc(type.video)

    let attributes = [];
    if(type.ad_attributes.length > 0) { 
      await type.ad_attributes.forEach((e) => { 
        const attr = {id: nanoid(), attribute_set_id : e.attribute_set?.id , value : e.attributes[0]?.id};
        attributes.push(attr);
      });
    }
    setValue('attributes', attributes)
  }

  useEffect(() => {
    if (id) {
        fetchAdsDetails()
    }
  }, [id])

  return (
    <Card>
      <AdsForm
        type={'edit'}
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
        category_id={category_id}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('ads_edit')}
        loading={loading}
      />
    </Card>
  )
}

export const getServerSideProps = async context => {
  const type = await fetchAdsDetails(context.params.id, context.req.cookies)

  return {
    props: { type, id: context.params.id }
  }
}

export default AdsEdit
