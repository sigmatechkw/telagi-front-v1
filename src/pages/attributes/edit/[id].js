import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchAttributesDetails as fetchAttributeDetailsById } from 'src/components/Attributes/Details/AttributesDetailsServices'
import AttributesForm from 'src/components/Attributes/AttributesForm'
import CustomLoader from 'src/components/Shared/CustomLoader'
import { getApiBaseUrl } from 'src/configs/api'

const defaultValues = {
  name_en: "",
  name_ar: "",
  image: "",
  image_id : "",
  attribute_set_id: "",
  parent_attribute_id : "",
  order : "",
  active: true,
}

const AttributesEdit = ({ type: initialAttributeData, id }) => {
  const auth = useSelector(state => state.auth)
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [attributeSetImg, setAttributeSet] = useState('')
  const [deleteImage , setDeleteImage] = useState(false);


  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const { isPending, isFetched, data: attribute } = useQuery({
    queryKey: ['fetchAttributesDetails', id],
    queryFn: () => fetchAttributeDetailsById(id),
    enabled: !!id,
    initialData: initialAttributeData ?? undefined
  })

  const testBase64 = src => {
    if (!src || typeof src !== 'string') {
      return false;
    }

    const base64Regex = /^(data:image\/[a-zA-Z]*;base64,)?([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

    return base64Regex.test(src)
  }

  const onSubmit = data => {
    const apiBaseUrl = getApiBaseUrl()

    if (!attribute) {
      toast.error(t('something_went_wrong'))

      return
    }

    setLoading(true)

    data.attribute_set_id = data?.attribute_set_id?.id;
    // data.parent_attribute_id = data?.parent_attribute_id?.id;

    if(testBase64(imgSrc)){ 
      data.image = imgSrc;
    }else{ 
      delete data.image;
    }

    if(deleteImage) { 
      data.deleted_images_ids = [data.image_id];
    }

    axios
      .put(`${apiBaseUrl}attributes/${id}`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        router.push(`/attributes/details/${id}`)
        reset()
      })
      .catch(error => {
        setLoading(false)
        toast.error(error.response?.data?.message ?? t('something_went_wrong'))
      })
  }

  const populateAttributeForm = () => {
    if (!attribute) {
      return
    }

    setValue('name_en', attribute.name_en)
    setValue('name_ar', attribute.name_ar)
    setValue('image', attribute.image)
    setImgSrc(attribute.image ?? '')
    setValue('attribute_set_id', attribute.attribute_set ?? null)
    setValue('parent_attribute_id', attribute.parent_attribute ?? null)
    setValue('order', attribute.order)
    setValue('active', Boolean(attribute.active))
    setValue('is_default', attribute.is_default)
    setValue('image_id', attribute.image_id)
  }

  useEffect(() => {
    if (isFetched && !attribute) {
      router.replace('/404')

      return
    }

    if (id && attribute) {
      populateAttributeForm()
    }
  }, [attribute, id, isFetched, router, setValue])

  if (isPending && !attribute) {
    return <CustomLoader />
  }

  if (isFetched && !attribute) {
    return null
  }

  return (
    <Card>
      <AttributesForm
        type={'edit'}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        attributeSetImg={attributeSetImg}
        setAttributeSet={setAttributeSet}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('attributes_edit')}
        loading={loading}
        setDeleteImage={setDeleteImage}
      />
    </Card>
  )
}

export const getServerSideProps = async context => {
  const type = await fetchAttributeDetailsById(context.params.id, context.req.cookies)

  return {
    props: { type, id: context.params.id }
  }
}

export default AttributesEdit
