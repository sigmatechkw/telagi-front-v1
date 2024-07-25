// import Card from '@mui/material/Card'
// import toast from 'react-hot-toast'
// import { useForm } from 'react-hook-form'
// import axios from 'axios'
// import { useTranslation } from 'react-i18next'
// import { useRouter } from 'next/router'
// import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { fetchAdsDetails } from 'src/components/Ads/Details/adsDetailsServices'
// import AdsForm from 'src/components/Ads/AdsForm'

// const defaultValues = {
//     title: "",
//     description: "",
//     expiration_period: "",
//     expiration_date: "",
//     price : "",
//     phone: "",
//     views: "",
//     active: false,
//     sold: false,
//     featured: false,
//     featured_start_date: false,
//     featured_end_date: false,
//     status: false,
//     country_id: false,
//     category_id: false,
//     user_id: false,
//     image : "",
//     images: [],
//     video : "",
//     attributes : []
// }

// const AdsEdit = ({ type, id }) => {
//   const auth = useSelector(state => state.auth)
//   const lang = useSelector(state => state.lang)
//   const { t } = useTranslation()
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [imgSrc, setImgSrc] = useState('')
//   const [attributeSetImg, setAttributeSet] = useState('')

//   const {
//     control,
//     watch,
//     handleSubmit,
//     setValue,
//     reset,
//     formState: { errors }
//   } = useForm({ defaultValues })

//   const onSubmit = data => {
//     setLoading(true)

//     data.attribute_set_id = data.attribute_set_id.id;

//     if(!imgSrc){ 
//         delete data.image;
//     }else{ 
//         data.image = imgSrc;
//     }

//     axios
//       .put(`${process.env.NEXT_PUBLIC_API_KEY}attributes/${id}`, data, {
//         headers: {
//           Authorization: auth.token
//         }
//       })
//       .then(res => {
//         setLoading(false)
//         toast.success(t('success'))
//         router.push(`/attributes/details/${id}`)
//         reset()
//       })
//       .catch(error => {
//         setLoading(false)
//         toast.error(error.response.data.message)
//       })
//   }

//   const fetchAdsDetails = () => {
//     setValue('name_en', type.name_en)
//     setValue('name_ar', type.name_ar)
//     setValue('image', type.image)
//     setImgSrc(type.image);
//     setValue('attribute_set_id', type.attribute_set)
//     setValue('order', type.order)
//     setValue('active', type.active)
//     setValue('is_default', type.is_default)
//   }

//   useEffect(() => {
//     if (id) {
//         fetchAdsDetails()
//     }
//   }, [id])

//   return (
//     <Card>
//       <AdsForm
//         type={'edit'}
//         imgSrc={imgSrc}
//         setImgSrc={setImgSrc}
//         attributeSetImg={attributeSetImg}
//         setAttributeSet={setAttributeSet}
//         onSubmit={handleSubmit(onSubmit)}
//         control={control}
//         watch={watch}
//         setValue={setValue}
//         errors={errors}
//         title={t('attributes_edit')}
//         loading={loading}
//       />
//     </Card>
//   )
// }

// export const getServerSideProps = async context => {
//   const type = await fetchAdsDetails(context.params.id, context.req.cookies)

//   return {
//     props: { type, id: context.params.id }
//   }
// }

// export default AdsEdit
