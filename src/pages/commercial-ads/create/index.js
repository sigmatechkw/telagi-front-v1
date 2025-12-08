import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import CommercialAdsForm from 'src/components/CommercialAds/CommercialAdsForm'

const defaultValues = {
  title_en: "",
  title_ar: "",
  phone: "",
  whatsapp: "",
  phone_secondary: "",
  whatsapp_secondary: "",
  start_date: "",
  end_date: "",
  commercial_category_id: null,
  images: []
}

const CommercialAdCreate = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagesSrc, setImagesSrc] = useState([])
  const [adImages, setAdImages] = useState([])
  const [deleteImages, setDeleteImages] = useState(false)

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

    if (data.commercial_category_id) {
      data.commercial_category_id = data.commercial_category_id.id
    }

    if (adImages.length > 0) {
      data.images = adImages;
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_KEY}commercial-ads`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        router.push('/commercial-ads')
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
      <CommercialAdsForm
        type={'create'}
        imagesSrc={imagesSrc}
        setImagesSrc={setImagesSrc}
        adImages={adImages}
        setAdImages={setAdImages}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('commercial_ad_create')}
        loading={loading}
        setDeleteImages={setDeleteImages}
      />
    </Card>
  )
}

export default CommercialAdCreate
