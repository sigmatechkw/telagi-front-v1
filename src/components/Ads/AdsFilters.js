import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {useTranslation} from "react-i18next";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import CustomTextField from "../../@core/components/mui/text-field";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import {Icon} from "@iconify/react";

const AdsFilters = ({ isActive, setIsActive, isExpired, setIsExpired, isSold , setIsSold , isFeatured , setIsFeatured }) => {
  const {t} = useTranslation()

  const handleIsActiveChange = (e) => {
    setIsActive(e.target.value)
  }

  const handleIsExpiredChange = (e) => {
    setIsExpired(e.target.value)
  }

  const handleIsSoldChange = (e) => {
    setIsSold(e.target.value)
  }

  const handleIsFeaturedChange = (e) => {
    setIsFeatured(e.target.value)
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title={t('filters')} />
      <CardContent>
        <Grid container spacing={6}>

          <Grid item xs={12} md={3} lg={3}>
            <CustomTextField
              select
              fullWidth
              defaultValue={t('is_active')}
              SelectProps={{
                value: isActive,
                displayEmpty: true,
                onChange: handleIsActiveChange,
                endAdornment: (
                  <IconButton sx={{ mx: 2 }} onClick={() => setIsActive('')}>
                    <Icon icon={'tabler:circle-x'} />
                  </IconButton>
                )
              }}
            >
              <MenuItem value={''}>{t('is_active')}</MenuItem>
              <MenuItem value={1}>{t('yes')}</MenuItem>
              <MenuItem value={0}>{t('no')}</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <CustomTextField
              select
              fullWidth
              defaultValue={t('is_expired')}
              SelectProps={{
                value: isExpired,
                displayEmpty: true,
                onChange: handleIsExpiredChange,
                endAdornment: (
                  <IconButton sx={{ mx: 2 }} onClick={() => setIsExpired('')}>
                    <Icon icon={'tabler:circle-x'} />
                  </IconButton>
                )
              }}
            >
              <MenuItem value={''}>{t('is_expired')}</MenuItem>
              <MenuItem value={1}>{t('yes')}</MenuItem>
              <MenuItem value={0}>{t('no')}</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <CustomTextField
              select
              fullWidth
              defaultValue={t('is_sold')}
              SelectProps={{
                value: isSold,
                displayEmpty: true,
                onChange: handleIsSoldChange,
                endAdornment: (
                  <IconButton sx={{ mx: 2 }} onClick={() => setIsSold('')}>
                    <Icon icon={'tabler:circle-x'} />
                  </IconButton>
                )
              }}
            >
              <MenuItem value={''}>{t('is_sold')}</MenuItem>
              <MenuItem value={1}>{t('yes')}</MenuItem>
              <MenuItem value={0}>{t('no')}</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <CustomTextField
              select
              fullWidth
              defaultValue={t('is_featured')}
              SelectProps={{
                value: isFeatured,
                displayEmpty: true,
                onChange: handleIsFeaturedChange,
                endAdornment: (
                  <IconButton sx={{ mx: 2 }} onClick={() => setIsFeatured('')}>
                    <Icon icon={'tabler:circle-x'} />
                  </IconButton>
                )
              }}
            >
              <MenuItem value={''}>{t('is_featured')}</MenuItem>
              <MenuItem value={1}>{t('yes')}</MenuItem>
              <MenuItem value={0}>{t('no')}</MenuItem>
            </CustomTextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AdsFilters
