import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {fetchAttributesSetsDetails} from 'src/components/AttributesSets/Details/AttributesSetsDetailsServices'
import AttributesSetsForm from 'src/components/AttributesSets/AttributesSetsForm'

const defaultValues = {
  name_en: "",
  name_ar: "",
  image: "",
  category_id: "",
  order : "",
  type: "",
  active: false,
}

const AttributesSetsEdit = ({ type, id }) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [attributeSetImg, setAttributeSet] = useState('')
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

    data.category_id = data.category_id;
    data.type = data.type?.id;

    if(!attributeSetImg){ 
        delete data.image;
    }else{ 
        data.image = attributeSetImg;
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_KEY}attribute-sets/${id}`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        router.push(`/attributes-sets/details/${id}`)
        reset()
      })
      .catch(error => {
        setLoading(false)
        toast.error(error.response.data.message)
      })
  }

  const fetchAttributesSetsDetails = () => {
    setValue('name_en', type.name_en)
    setValue('name_ar', type.name_ar)
    setValue('image', type.image)
    setImgSrc(type.image);
    setValue('category_id', type.category?.id)
    setCategoryId(type.category?.id)
    setValue('order', type.order)
    setValue('active', type.active)
    setValue('type', type.type_data)
  }

  useEffect(() => {
    if (id) {
      fetchAttributesSetsDetails()
    }
  }, [id])

  return (
    <Card>
      <AttributesSetsForm
        type={'edit'}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        category_id={category_id}
        attributeSetImg={attributeSetImg}
        setAttributeSet={setAttributeSet}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('attributes_sets_edit')}
        loading={loading}
      />
    </Card>
  )
}

export const getServerSideProps = async context => {
  const type = await fetchAttributesSetsDetails(context.params.id, context.req.cookies)

  return {
    props: { type, id: context.params.id }
  }
}

export default AttributesSetsEdit
