import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CommercialAdsForm from 'src/components/CommercialAds/CommercialAdsForm'
import { fetchCommercialAdDetails } from 'src/components/CommercialAds/Details/CommercialAdsDetailsServices'
import CustomLoader from 'src/components/Shared/CustomLoader'

const defaultValues = {
  title_en: "",
  title_ar: "",
  phone: "",
  whatsapp: "",
  start_date: "",
  end_date: "",
  commercial_category_id: null,
  images: []
}

const CommercialAdEdit = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [imagesSrc, setImagesSrc] = useState([])
  const [adImages, setAdImages] = useState([])
  const [deleteImages, setDeleteImages] = useState(false)
  const [removedImageIds, setRemovedImageIds] = useState([])
  const [originalImages, setOriginalImages] = useState([])

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

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    try {
      const data = await fetchCommercialAdDetails(id)
      if (data) {
        setValue('title_en', data.title_en || '')
        setValue('title_ar', data.title_ar || '')
        setValue('phone', data.phone || '')
        setValue('whatsapp', data.whatsapp || '')
        setValue('start_date', data.start_date || '')
        setValue('end_date', data.end_date || '')

        if (data.category) {
          setValue('commercial_category_id', data.category)
        }

        if (data.images && data.images.length > 0) {
          // Extract URLs from image objects for display
          const imageUrls = data.images.map(img => typeof img === 'string' ? img : img.url || img.image || img)
          setImagesSrc(imageUrls)

          // For existing images, we need to convert them to base64
          const convertImageToBase64 = async (imageUrl) => {
            try {
              const response = await fetch(imageUrl)
              const blob = await response.blob()

              return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.readAsDataURL(blob)
              })
            } catch (error) {
              console.error('Error converting image to base64:', error)

              return imageUrl // fallback to original URL
            }
          }

          // Convert all images to base64
          const base64Images = await Promise.all(
            imageUrls.map(async (url, index) => {
              const base64 = await convertImageToBase64(url)

              return {
                ...data.images[index],
                base64: base64
              }
            })
          )

          setAdImages(base64Images)
          setOriginalImages(data.images)
        }
      }
      setDataLoading(false)
    } catch (error) {
      console.log(error)
      setDataLoading(false)
      toast.error(t('error'))
    }
  }

  const handleRemoveImage = (index) => {
    const removedImage = adImages[index]
    if (removedImage && removedImage.id) {
      setRemovedImageIds(prev => [...prev, removedImage.id])
    }

    setImagesSrc(prev => prev.filter((_, i) => i !== index))
    setAdImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = data => {
    setLoading(true)

    if (data.commercial_category_id) {
      data.commercial_category_id = data.commercial_category_id.id
    }

    // Separate existing images from new images
    const existingImages = adImages.filter(img => img.id)
    const newImages = adImages.filter(img => !img.id)
    const hasNewImages = newImages.length > 0
    const hasRemovedImages = removedImageIds.length > 0
    const hasModifiedImages = hasNewImages || hasRemovedImages

    if (hasModifiedImages) {
      // Only send images array if there are new images
      if (hasNewImages) {
        // Extract base64 strings from new images only
        const base64Images = newImages.map(img => {
          if (typeof img === 'string') {
            return img // Already base64
          } else {
            return img // Should be base64 string
          }
        })
        data.images = base64Images
      }

      // Always send deleted_images_ids if there are removed images
      if (removedImageIds.length > 0) {
        data.deleted_images_ids = removedImageIds
      }
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_KEY}commercial-ads/${id}`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        router.push('/commercial-ads')
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
        toast.error(error.response.data.message)
      })
  }

  if (dataLoading) {
    return <CustomLoader />
  }

  return (
    <Card>
      <CommercialAdsForm
        type={'edit'}
        imagesSrc={imagesSrc}
        setImagesSrc={setImagesSrc}
        adImages={adImages}
        setAdImages={setAdImages}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('commercial_ad_edit')}
        loading={loading}
        setDeleteImages={setDeleteImages}
        commercial_category_id={getValues('commercial_category_id')?.id}
        onRemoveImage={handleRemoveImage}
      />
    </Card>
  )
}

export default CommercialAdEdit
