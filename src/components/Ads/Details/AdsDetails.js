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
import { deleteAds } from '../adsServices'
import Icon from '../../../@core/components/icon'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

const AdsDetails = ({ type }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false)

  const handleDelete = () => {
    deleteAds([type.id]).then(res => {
      toast.success(t('success'))
      setOpenDeleteSnackbar(false)
      router.replace('/ads')
    })
  }

  const handleClickDeleteButton = () => {
    setOpenDeleteSnackbar(true)
  }

  const handleCloseDeleteSnackbar = () => {
    setOpenDeleteSnackbar(false)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Typography variant={'h3'} sx={{ px: 3, pt: 3 }}>
            {t('ads')}
          </Typography>
          <CardContent>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('title')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{type.title}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('category')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {type.category?.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('price')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {type.price} {t('kwd')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('user')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{type.user?.first_name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('user_phone')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{type.user?.phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('expiration_period')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {type.expiration_period}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('created_at')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{type.created_at}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('expiration_date')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {type.expiration_date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('featured_start_date')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{type.featured_start_date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('featured_end_date')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{type.featured_end_date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('views')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {type.views}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('favorites')}:</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{type.favorites}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('featured')}:</Typography>
              {type.featured == 1 ? (
                <Icon icon='tabler:circle-check' color='green' fontSize='1.5rem' />
              ) : (
                <Icon icon='tabler:xbox-x' color='red' fontSize='1.5rem' />
              )}
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('sold')}:</Typography>
              {type.sold == 1 ? (
                <Icon icon='tabler:circle-check' color='green' fontSize='1.5rem' />
              ) : (
                <Icon icon='tabler:xbox-x' color='red' fontSize='1.5rem' />
              )}
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('is_approved')}:</Typography>
              {type.approved ? (
                <Icon icon='tabler:circle-check' color='green' fontSize='1.5rem' />
              ) : (
                <Icon icon='tabler:xbox-x' color='red' fontSize='1.5rem' />
              )}
            </Box>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>{t('is_active')}:</Typography>
              {type.active == 1 ? (
                <Icon icon='tabler:circle-check' color='green' fontSize='1.5rem' />
              ) : (
                <Icon icon='tabler:xbox-x' color='red' fontSize='1.5rem' />
              )}
            </Box>

          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='tonal' sx={{ mr: 2 }} onClick={() => router.push(`/ads/edit/${type.id}`)}>
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

export default AdsDetails
