import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import CustomLoader from "../../../components/Shared/CustomLoader";
import Grid from "@mui/material/Grid";
import { fetchCommercialCategoryDetails } from "src/components/CommercialCategories/Details/CommercialCategoriesDetailsServices";
import CommercialCategoriesDetails from "src/components/CommercialCategories/Details/CommercialCategoriesDetails";

const CommercialCategoryDetailsPage = ({ category: initialCategoryData, id }) => {
    const router = useRouter()

    const { isPending, data: category, error } = useQuery({
        queryKey: ['fetchCommercialCategoryDetails', id],
        queryFn: () => fetchCommercialCategoryDetails(id),
        enabled: !!id,
        initialData: initialCategoryData
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
                    category &&
                    <CommercialCategoriesDetails category={category} />
                }
            </Grid>
        </Grid>
    )
}

export const getServerSideProps = async (context) => {
    const category = await fetchCommercialCategoryDetails(context.params.id, context.req.cookies)

    return {
        props: { category, id: context.params.id }
    }
}

export default CommercialCategoryDetailsPage
