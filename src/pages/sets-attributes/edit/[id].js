import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchAttributesSetsDetails as fetchAttributeSetDetailsById } from 'src/components/AttributesSets/Details/AttributesSetsDetailsServices'
import AttributesSetsForm from 'src/components/AttributesSets/AttributesSetsForm'
import CustomLoader from 'src/components/Shared/CustomLoader'
import { getApiBaseUrl } from 'src/configs/api'

const defaultValues = {
  name_en: "",
  name_ar: "",
  image: "",
  image_id : "",
  category_id: "",
  order : "",
  type: "",
  only_numbers: false,
  active: true,
  required: true,
}

const AttributesSetsEdit = ({ type: initialAttributeSetData, id }) => {
  const auth = useSelector(state => state.auth)
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [attributeSetImg, setAttributeSet] = useState('')
  const [category_ids , setCategoriesIds] = useState([])
  const [deleteImage , setDeleteImage] = useState(false);

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const { isPending, isFetched, data: attributeSet } = useQuery({
    queryKey: ['fetchAttributesSetsDetails', id],
    queryFn: () => fetchAttributeSetDetailsById(id),
    enabled: !!id,
    initialData: initialAttributeSetData ?? undefined
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

    if (!attributeSet) {
      toast.error(t('something_went_wrong'))

      return
    }

    setLoading(true)

    data.category_id = data.category_id;
    data.type = data.type?.id;

    if(!testBase64(imgSrc)){
        delete data.image;
    }else{
        data.image = imgSrc;
    }

    if(deleteImage) {
      data.deleted_images_ids = [data.image_id];
    }

    axios
      .put(`${apiBaseUrl}attribute-sets/${id}`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        router.push(`/sets-attributes/details/${id}`)
        reset()
      })
      .catch(error => {
        setLoading(false)
        toast.error(error.response?.data?.message ?? t('something_went_wrong'))
      })
  }

  const populateAttributeSetForm = () => {
    if (!attributeSet) {
      return
    }

    setValue('name_en', attributeSet.name_en)
    setValue('name_ar', attributeSet.name_ar)
    setValue('image', attributeSet.image)
    setImgSrc(attributeSet.image ?? '')
    setCategoriesIds(attributeSet.categories ?? [])
    setValue('order', attributeSet.order)
    setValue('only_numbers', Boolean(attributeSet.only_numbers))
    setValue('active', Boolean(attributeSet.active))
    setValue('required', Boolean(attributeSet.required))
    setValue('type', attributeSet.type_data ?? null)
    setValue('image_id', attributeSet.image_id)
  }

  useEffect(() => {
    if (isFetched && !attributeSet) {
      router.replace('/404')

      return
    }

    if (id && attributeSet) {
      populateAttributeSetForm()
    }
  }, [attributeSet, id, isFetched, router, setValue])

  if (isPending && !attributeSet) {
    return <CustomLoader />
  }

  if (isFetched && !attributeSet) {
    return null
  }

  return (
    <Card>
      <AttributesSetsForm
        type={'edit'}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        category_ids={category_ids}
        attributeSetImg={attributeSetImg}
        setAttributeSet={setAttributeSet}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('attributes_sets_edit')}
        loading={loading}
        setDeleteImage={setDeleteImage}
      />
    </Card>
  )
}

export const getServerSideProps = async context => {
  const type = await fetchAttributeSetDetailsById(context.params.id, context.req.cookies)

  return {
    props: { type, id: context.params.id }
  }
}

export default AttributesSetsEdit
