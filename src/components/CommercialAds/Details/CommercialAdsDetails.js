import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import SnackbarConfirmActions from '../../Shared/SnackbarConfirmActions'
import Snackbar from '@mui/material/Snackbar'
import { deleteCommercialAds } from '../CommercialAdsServices'
import Icon from '../../../@core/components/icon'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const CommercialAdsDetails = ({ ad }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false)

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 80,
    height: 80,
    borderRadius: theme.shape.borderRadius,
    marginInline: 20
  }))

  const handleDelete = () => {
    deleteCommercialAds([ad.id]).then(res => {
      toast.success(t('success'))
      setOpenDeleteSnackbar(false)
      router.replace('/commercial-ads')
    })
  }

  const handleClickDeleteButton = () => {
    setOpenDeleteSnackbar(true)
  }

  const handleCloseDeleteSnackbar = () => {
    setOpenDeleteSnackbar(false)
  }

  const handleCategoryClick = categoryId => {
    router.push(`/commercial-categories/details/${categoryId}`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Typography variant={'h3'} sx={{ px: 3, pt: 3 }}>
            {t('commercial_ad')}
          </Typography>
          <CardContent>
            <Box sx={{ display: 'flex', mb: 3, alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {ad.images && ad.images.length > 0 ? (
                  ad.images.map((image, index) => (
                    <ImgStyled key={index} src={image.url} alt={`${t('commercial_ad')} ${index + 1}`} />
                  ))
                ) : (
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}
                  >
                    <Icon icon='tabler:photo-off' fontSize='2rem' color='text.disabled' />
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('title')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.title}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('phone')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('phone_secondary')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.phone_secondary}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('phone_third')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.phone_third}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('whatsapp')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.whatsapp}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                {t('whatsapp_secondary')}:
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.whatsapp_secondary}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('whatsapp_third')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.whatsapp_third}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('views')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.views}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('start_date')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.start_date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('end_date')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.end_date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                {t('commercial_category')}:
              </Typography>
              <Typography
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer'
                }}
                onClick={() => handleCategoryClick(ad.category?.id)}
              >
                {ad.category?.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('created_at')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{ad.created_at}</Typography>
            </Box>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='tonal' sx={{ mr: 2 }} onClick={() => router.push(`/commercial-ads/edit/${ad.id}`)}>
              {t('edit')}
            </Button>
            <Button color='error' variant='tonal' onClick={handleClickDeleteButton}>
              {t('delete')}
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openDeleteSnackbar}
        onClose={handleCloseDeleteSnackbar}
        message={t('are_you_sure')}
        action={<SnackbarConfirmActions handleConfirm={handleDelete} handleClose={handleCloseDeleteSnackbar} />}
      />
    </Grid>
  )
}

export default CommercialAdsDetails
