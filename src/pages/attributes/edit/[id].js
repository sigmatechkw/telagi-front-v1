import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchAttributesDetails } from 'src/components/Attributes/Details/AttributesDetailsServices'
import AttributesForm from 'src/components/Attributes/AttributesForm'

const defaultValues = {
  name_en: "",
  name_ar: "",
  image: "",
  attribute_set_id: "",
  order : "",
  is_default: false,
  active: false,
}

const AttributesEdit = ({ type, id }) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [attributeSetImg, setAttributeSet] = useState('')

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const testBase64 = src => {
    if (!src || typeof src !== 'string') {
      return false;
    }

    const base64Regex = /^(data:image\/[a-zA-Z]*;base64,)?([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

    return base64Regex.test(src)
  }

  const onSubmit = data => {
    setLoading(true)

    data.attribute_set_id = data.attribute_set_id.id;

    if(testBase64(imgSrc)){ 
      data.image = imgSrc;
    }else{ 
      delete data.image;
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_KEY}attributes/${id}`, data, {
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
        toast.error(error.response.data.message)
      })
  }

  const fetchAttributesDetails = () => {
    setValue('name_en', type.name_en)
    setValue('name_ar', type.name_ar)
    setValue('image', type.image)
    setImgSrc(type.image)
    setValue('attribute_set_id', type.attribute_set)
    setValue('order', type.order)
    setValue('active', type.active)
    setValue('is_default', type.is_default)
  }

  useEffect(() => {
    if (id) {
      fetchAttributesDetails()
    }
  }, [id])

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
      />
    </Card>
  )
}

export const getServerSideProps = async context => {
  const type = await fetchAttributesDetails(context.params.id, context.req.cookies)

  return {
    props: { type, id: context.params.id }
  }
}

export default AttributesEdit
