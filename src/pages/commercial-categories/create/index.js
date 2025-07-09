import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import CommercialCategoriesForm from 'src/components/CommercialCategories/CommercialCategoriesForm'

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

const CommercialCategoryCreate = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [imgSrc, setImgSrc] = useState('')
    const [categoryImg, setCategoryImg] = useState('')
    const [deleteImage, setDeleteImage] = useState(false)

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

        if (!categoryImg) {
            delete data.image;
        } else {
            data.image = categoryImg;
        }

        axios
            .post(`${process.env.NEXT_PUBLIC_API_KEY}commercial-categories`, data, {
                headers: {
                    Authorization: auth.token
                }
            })
            .then(res => {
                setLoading(false)
                toast.success(t('success'))
                router.push('/commercial-categories')
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
            <CommercialCategoriesForm
                type={'create'}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                categoryImg={categoryImg}
                setCategoryImg={setCategoryImg}
                onSubmit={handleSubmit(onSubmit)}
                control={control}
                watch={watch}
                setValue={setValue}
                errors={errors}
                title={t('commercial_category_create')}
                loading={loading}
                setDeleteImage={setDeleteImage}
                setImageModified={() => { }} // Dummy function for create mode
            />
        </Card>
    )
}

export default CommercialCategoryCreate
