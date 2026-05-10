import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchCategoryDetails as fetchCategoryDetailsById } from "src/components/Categories/Details/CategoriesDetailsServices";
import CategoriesForm from 'src/components/Categories/CategoriesForm'
import CustomLoader from 'src/components/Shared/CustomLoader'

const defaultValues = {
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    long_description_en: "",
    long_description_ar: "",
    image: "",
    image_id: "",
    category_id: "",
    order : "",
    active: false,
    featured: false
}

const CategoriesEdit = ({ type, id }) => {
  const auth = useSelector(state => state.auth)
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [categoryImg, setCategoryImg] = useState('')
  const [category_id , setCategoryId] = useState('')
  const [deleteImage , setDeleteImage] = useState(false);

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const { isPending, isFetched, data: category } = useQuery({
    queryKey: ['fetchCategoryDetails', id],
    queryFn: () => fetchCategoryDetailsById(id),
    enabled: !!id,
    initialData: type ?? undefined
  })

  const testBase64 = src => {
    const base64Regex = /^(data:image\/[a-zA-Z]*;base64,)?([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

    return base64Regex.test(src)
  }

  const populateCategoryForm = () => {
    if (!category) {
      return
    }

    setValue('name_en', category.name_en)
    setValue('name_ar', category.name_ar)
    setValue('description_en', category.description_en)
    setValue('description_ar', category.description_ar)
    setValue('long_description_en', category.long_description_en)
    setValue('long_description_ar', category.long_description_ar)
    setValue('image', category.image)
    setImgSrc(category.image);
    setValue('category_id', category.parent?.id)
    setCategoryId(category.parent?.id)
    setValue('order', category.order)
    setValue('active', category.active == 1? true : false)
    setValue('featured', category.featured  == 1? true : false)
    setValue('image_id' , category.image_id)
  }

  useEffect(() => {
    if (isFetched && !category) {
      router.replace('/404')

      return
    }

    if (category) {
      populateCategoryForm()
    }
  }, [category, isFetched, router, setValue])

  const onSubmit = data => {
    if (!id) {
      toast.error(t('something_went_wrong'))

      return
    }

    setLoading(true)

    data.parent_id = data.category_id;

    if(!testBase64(imgSrc)){
        delete data.image;
    }else{
        data.image = imgSrc;
    }

    if(deleteImage) {
      data.deleted_images_ids = [data.image_id];
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
        toast.error(error.response?.data?.message ?? t('something_went_wrong'))
      })
  }

  if (isPending && !category) {
    return <CustomLoader />
  }

  if (isFetched && !category) {
    return null
  }

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
        setDeleteImage={setDeleteImage}
      />
    </Card>
  )
}

export const getServerSideProps = async context => {
  const id = context.params?.id
  const type = id ? await fetchCategoryDetailsById(id, context.req.cookies) : null

  return {
    props: { type, id }
  }
}

export default CategoriesEdit
