import Card from '@mui/material/Card'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import {useTranslation} from "react-i18next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {fetchPackagesDetails} from "../../../components/Packages/Details/packagesDetailsServices";
import PackagesForm from "../../../components/Packages/PackagesForm";
import {getCookie} from "cookies-next";

const defaultValues = {
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  price: '',
  home_period: '',
  expiration_period : '',
  featured_period : '',
  order: '',
  active: false,
  image : ''
}

const PackagesEdit = ({packageDetails, id}) => {
  const auth = useSelector(state => state.auth)
  const lang = useSelector(state => state.lang)
  const {t} = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [packageImg, setPackageImg] = useState('')

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const testBase64 = src => {
    if (!src || typeof src !== 'string') {
      return false;
    }

    const base64Regex = /^(data:image\/[a-zA-Z]*;base64,)?([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

    return base64Regex.test(src)
  }

  const onSubmit = (data) => {
    setLoading(true)

    data.name = {
      en: data.name_en,
      ar: data.name_ar
    }

    data.description = {
      en: data.description_en,
      ar: data.description_ar
    }

    if(testBase64(imgSrc)){
      data.image = imgSrc;
    }else{
      delete data.image;
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_KEY}packages/${id}`, data, {
        headers: {
          'Authorization': getCookie('token') ?? auth.token,
          'Accepted-Language': getCookie('lang') ?? lang ?? 'en'
        }
      })
      .then(res => {
        setLoading(false)
        toast.success(t('success'));
        router.push(`/packages/details/${id}`)
        reset();
      })
      .catch(error => {
        setLoading(false)
        toast.error(error.response.data.message);
      });

  };

  const fetchPackageDetails = () => {
    setValue('name_en', packageDetails.name_en)
    setValue('name_ar', packageDetails.name_ar)
    setValue('description_en', packageDetails.description_en)
    setValue('description_ar', packageDetails.description_ar)
    setValue('price', packageDetails.price)
    setValue('balance', packageDetails.balance)
    setValue('home_period', packageDetails.home_period)
    setValue('expiration_period', packageDetails.expiration_period)
    setValue('featured_period', packageDetails.featured_period)
    setValue('order', packageDetails.order)
    setValue('active', packageDetails.active)
    setValue('image', packageDetails.image)
    setImgSrc(packageDetails.image)
  }

  useEffect(() => {
    if(id) {
      fetchPackageDetails();
    }
  }, [id]);

  return (
    <Card>
      <PackagesForm type={'edit'} onSubmit={handleSubmit(onSubmit)} control={control} watch={watch} setValue={setValue} errors={errors} title={t('package_edit')} loading={loading} imgSrc={imgSrc} setImgSrc={setImgSrc} packageImg={packageImg} setPackageImg={setPackageImg} />
    </Card>
  );
};

export const getServerSideProps = async (context) => {
  const packageDetails = await fetchPackagesDetails(context.params.id, context.req.cookies)

  return {
    props: {packageDetails, id: context.params.id}
  }
}

export default PackagesEdit;
