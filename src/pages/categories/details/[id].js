import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import {useEffect} from "react";
import CustomLoader from "../../../components/Shared/CustomLoader";
import Grid from "@mui/material/Grid";
import { fetchCategoryDetails } from "src/components/Categories/Details/CategoriesDetailsServices";
import CategoryDetails from "src/components/Categories/Details/CategoriesDetails";

const CategoryDetailsPage = ({type: initialTypeData, id}) => {
  const router = useRouter()

  const {isPending, isFetched, data: type, error} = useQuery({
    queryKey: ['fetchCategoryDetails', id],
    queryFn: () => fetchCategoryDetails(id),
    enabled: !!id,
    initialData: initialTypeData ?? undefined
  })

  useEffect(() => {
    if (isFetched && (!type || error)) {
      router.replace('/404')
    }
  }, [error, isFetched, router, type])

  if (isPending) {
    return <CustomLoader />
  }

  if (!type || error) {
    return null
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12} lg={12} sx={{m: 'auto'}}>
        {
          type &&
            <CategoryDetails type={type} />
        }
      </Grid>
    </Grid>
  )
}

export const getServerSideProps = async (context) => {
  const id = context.params?.id
  const type = id ? await fetchCategoryDetails(id, context.req.cookies) : null

  return {
    props: {type, id}
  }
}

export default CategoryDetailsPage
