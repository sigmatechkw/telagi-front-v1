import { useEffect , useState} from "react";
import Grid from "@mui/material/Grid";
import CustomPieChartCard from "../Shared/CustomPieChartCard";
import CustomLoader from "../Shared/CustomLoader";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {fetchDateRanges,fetchUsersRoles, fetchUsersStatistics} from "../Users/List/userListServices";
import {getCookie} from "cookies-next";


const HomeStatistics = ({data = {}}) => {
  const {t} = useTranslation();
  const theme = useTheme()
  const [statistics, setStatistics] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsersStatistics('all').then(res => {
      setStatistics(res)
      fetchUsersRoles().then(result => {
        setRoles(result)
        setLoading(false)
      })
    })
  }, []);

  return (
    loading ?
    <CustomLoader/>
    :
    <Grid sx={{mb: 3}} container spacing={6}>
          <Grid item xs={12} md={4} lg={4}>
            <CustomPieChartCard
              title={t('role')}
              color={theme.palette.success.main}
              labels={roles?.filter(role => role.id !== 1).map(role => t(role.name))}
              values={[statistics.users]}
              total={statistics.all_items}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <CustomPieChartCard
              title={t('active')}
              color={theme.palette.success.main}
              labels={[t('active'), t('inactive')]}
              values={[statistics.active, statistics.in_active]}
              total={statistics.all_items}
            />
          </Grid> 
    </Grid>
  )
}


     



export default HomeStatistics
