import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchCategoryDetails } from "src/components/Categories/Details/CategoriesDetailsServices";
import CategoriesForm from 'src/components/Categories/CategoriesForm'

const defaultValues = {
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    long_description_en: "",
    long_description_ar: "",
    image: "",
    category_id: "",
    order : "",
    active: false,
    featured: false
}

const CategoriesEdit = ({ type, id }) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [categoryImg, setCategoryImg] = useState('')
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

    data.parent_id = data.category_id;
    if(!categoryImg){ 
        delete data.image;
    }else{ 
        data.image = categoryImg;
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_KEY}categories/${id}`, data, {
        headers: {
          Authorization: auth.token
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'))
        router.push(`/categories/details/${id}`)
        reset()
      })
      .catch(error => {
        setLoading(false)
        toast.error(error.response.data.message)
      })
  }

  const fetchCategoryDetails = () => {
    setValue('name_en', type.name_en)
    setValue('name_ar', type.name_ar)
    setValue('description_en', type.description_en)
    setValue('description_ar', type.description_ar)
    setValue('long_description_en', type.long_description_en)
    setValue('long_description_ar', type.long_description_ar)
    setValue('image', type.image)
    setImgSrc(type.image);
    setValue('category_id', type.parent?.id)
    setCategoryId(type.parent?.id)
    setValue('order', type.order)
    setValue('active', type.active)
    setValue('featured', type.featured)
  }

  useEffect(() => {
    if (id) {
        fetchCategoryDetails()
    }
  }, [id])

  return (
    <Card>
      <CategoriesForm
        type={'edit'}
        imgSrc={imgSrc}
        setImgSrc={setImgSrc}
        categoryImg={categoryImg}
        setCategoryImg={setCategoryImg}
        category_id={category_id}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
        title={t('category_edit')}
        loading={loading}
      />
    </Card>
  )
}

export const getServerSideProps = async context => {
  const type = await fetchCategoryDetails(context.params.id, context.req.cookies)

  return {
    props: { type, id: context.params.id }
  }
}

export default CategoriesEdit
