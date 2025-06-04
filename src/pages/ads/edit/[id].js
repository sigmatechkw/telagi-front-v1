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
    approved: false,
    featured: false,
    featured_start_date: false,
    featured_end_date: false,
    status: false,
    country_id: false,
    category_id: false,
    user_id: false,
    image : "",
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
    getValues,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

    const testBase64 = src => {
    const base64Regex = /^(data:image\/[a-zA-Z]*;base64,)?([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

    return base64Regex.test(src)
  }
  
  const onSubmit = data => {
    setLoading(true)

    data.country_id = data.country_id?.id;
    data.category_id = data.category_id;
    data.user_id = data.user_id?.id;

    data.active = data.active ? 1 : 0;
    data.sold = data.sold ? 1 : 0;
    data.approved = data.approved ? 1 : 0;
    data.featured = data.featured ? 1 : 0;
    
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
      delete data.video;
      if(getValues('video')?.url == videoSrc){
      }else{ 
        data.video = videoSrc;
        data.deleted_videos_ids = [getValues('video')?.id];
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

    console.log(data);
    
    axios
      .post(`${process.env.NEXT_PUBLIC_API_KEY}update-ads/${id}`, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
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
    setValue('active', type.active == 1? true: false )
    setValue('sold', type.sold == 1? true: false)
    setValue('approved', type.approved == 1? true: false)
    setValue('featured', type.featured == 1? true: false)
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
    setValue('video', type.video[0])
    setAdVideo(type.video[0]?.url)

    let attributes = [];
    if(type.ad_attributes.length > 0) { 
      await type.ad_attributes.forEach((e) => { 
            e.attributes.forEach((attrItem) => { 
              const attr = {id: nanoid(), attribute_set_id : e.attribute_set?.id , value : attrItem?.id};
              attributes.push(attr);
            })
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
