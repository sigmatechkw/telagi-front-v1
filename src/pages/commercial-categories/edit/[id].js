import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CommercialCategoriesForm from 'src/components/CommercialCategories/CommercialCategoriesForm'
import { fetchCommercialCategoryDetails } from 'src/components/CommercialCategories/Details/CommercialCategoriesDetailsServices'
import CustomLoader from 'src/components/Shared/CustomLoader'

const defaultValues = {
  name_en: "",
  name_ar: "",
  description_en: "",
  description_ar: "",
  image: "",
  order: "",
  active: false,
  featured: false
}

const CommercialCategoryEdit = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [imgSrc, setImgSrc] = useState('')
  const [categoryImg, setCategoryImg] = useState('')
  const [deleteImage, setDeleteImage] = useState(false)
  const [originalImages, setOriginalImages] = useState([])
  const [imageModified, setImageModified] = useState(false)

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
      const data = await fetchCommercialCategoryDetails(id)
      if (data) {
        setValue('name_en', data.name_en || '')
        setValue('name_ar', data.name_ar || '')
        setValue('description_en', data.description_en || '')
        setValue('description_ar', data.description_ar || '')
        setValue('order', data.order || '')
        setValue('active', data.active == 1)
        setValue('featured', data.featured == 1)

        if (data.image) {
          setImgSrc(data.image)
          setOriginalImages([data.image])
          // For edit mode, we'll convert to base64 only when user modifies the image
          setCategoryImg('')
        }
      }
      setDataLoading(false)
    } catch (error) {
      console.log(error)
      setDataLoading(false)
      toast.error(t('error'))
    }
  }

  const onSubmit = data => {
    setLoading(true)

    // Only send image if it has been modified by the user
    if (!categoryImg && !imgSrc) {
      // No image at all
      delete data.image;
    } else if (imageModified && categoryImg) {
      // User uploaded new image (base64)
      data.image = categoryImg;
    } else if (imgSrc && !imageModified) {
      // User hasn't modified the existing image, don't send it
      delete data.image;
    } else {
      // Default case: don't send image
      delete data.image;
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_KEY}commercial-categories/${id}`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        router.push('/commercial-categories')
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
      <CommercialCategoriesForm
        type={'edit'}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        categoryImg={categoryImg}
        setCategoryImg={setCategoryImg}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('commercial_category_edit')}
        loading={loading}
        setDeleteImage={setDeleteImage}
        setImageModified={setImageModified}
      />
    </Card>
  )
}

export default CommercialCategoryEdit
