import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import CustomLoader from "../../../components/Shared/CustomLoader";
import Grid from "@mui/material/Grid";
import { fetchCommercialAdDetails } from "src/components/CommercialAds/Details/CommercialAdsDetailsServices";
import CommercialAdsDetails from "src/components/CommercialAds/Details/CommercialAdsDetails";

const CommercialAdDetailsPage = ({ ad: initialAdData, id }) => {
  const router = useRouter()

  const { isPending, data: ad, error } = useQuery({
    queryKey: ['fetchCommercialAdDetails', id],
    queryFn: () => fetchCommercialAdDetails(id),
    enabled: !!id,
    initialData: initialAdData
  })

  if (isPending) {
    return <CustomLoader />
  }

  if (error) {
    router.push('/404')

    return
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12} lg={12} sx={{ m: 'auto' }}>
        {
          ad &&
          <CommercialAdsDetails ad={ad} />
        }
      </Grid>
    </Grid>
  )
}

export const getServerSideProps = async (context) => {
  const ad = await fetchCommercialAdDetails(context.params.id, context.req.cookies)

  return {
    props: { ad, id: context.params.id }
  }
}

export default CommercialAdDetailsPage
