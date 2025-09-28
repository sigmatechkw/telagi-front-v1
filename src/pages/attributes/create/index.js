import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import AttributesForm from 'src/components/Attributes/AttributesForm'

const defaultValues = {
    name_en: "",
    name_ar: "",
    image: "",
    attribute_set_id: "",
    parent_attribute_id : "",
    order : "",
    active: true,
}

const AttributesCreate = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [attributeImg, setAttributeImg] = useState('')
  const [content, setContent] = useState('')
  const [deleteImage , setDeleteImage] = useState(false);

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

  const testBase64 = src => {
    const base64Regex = /^(data:image\/[a-zA-Z]*;base64,)?([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

    return base64Regex.test(src)
  }

  const onSubmit = (data, type = 'save') => {
    setLoading(true)

    data.attribute_set_id = data.attribute_set_id.id;
    data.parent_attribute_id = data.parent_attribute_id.id;

    if(!imgSrc){ 
        delete data.image;
    }else{ 
        data.image = imgSrc;
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_KEY}attributes`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        if(type !== 'add_another'){
            router.push('/attributes')
            reset()
        }
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
        toast.error(error.response.data.message)
      })
  }

  return (
    <Card>
      <AttributesForm
        getValues={getValues}
        type={'create'}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        attributeImg={attributeImg}
        setAttributeImg={setAttributeImg}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('attributes_create')}
        loading={loading}
        content={content}
        setContent={setContent}
        setDeleteImage={setDeleteImage}
      />
    </Card>
  )
}

export default AttributesCreate
