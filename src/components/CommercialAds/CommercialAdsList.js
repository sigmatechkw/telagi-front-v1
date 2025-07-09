import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CustomDataGrid from '../Shared/CustomDataGrid'
import Snackbar from '@mui/material/Snackbar'
import SnackbarConfirmActions from '../Shared/SnackbarConfirmActions'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Icon from '../../@core/components/icon'
import { deleteCommercialAds } from './CommercialAdsServices'
import CommercialAdsRowOptions from './CommercialAdsRowOptions'
import CommercialAdsListTableHeader from './CommercialAdsListTableHeader'
import { useRouter } from 'next/router'

const CommercialAdsList = ({
  data,
  search,
  setSearch,
  paginationModel,
  setPaginationModel,
  sortModel,
  setSortModel,
  fetchData,
  canExport = false
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [total, setTotal] = useState(data.total)
  const [rowSelectionModel, setRowSelectionModel] = useState([])
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState(null)

  const handleDelete = () => {
    deleteCommercialAds([selectedRowId]).then(res => {
      setSelectedRowId(null)
      setOpenDeleteSnackbar(false)
      fetchData()
    })
  }

  const handleClickDeleteButton = id => {
    setSelectedRowId(id)
    setOpenDeleteSnackbar(true)
  }

  const handleCloseDeleteSnackbar = () => {
    setSelectedRowId(null)
    setOpenDeleteSnackbar(false)
  }

  const handleCategoryClick = (categoryId) => {
    router.push(`/commercial-categories/details/${categoryId}`)
  }

  const columns = [
    {
      flex: 0.1,
      minWidth: 50,
      field: 'id',
      headerName: t('id'),
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.id}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'title',
      headerName: t('title'),
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.title}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'phone',
      headerName: t('phone'),
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.phone}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'whatsapp',
      headerName: t('whatsapp'),
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.whatsapp}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'views',
      headerName: t('views'),
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.views}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'start_date',
      headerName: t('start_date'),
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.start_date}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'end_date',
      headerName: t('end_date'),
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.end_date}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'category',
      headerName: t('commercial_category'),
      renderCell: ({ row }) => (
        <Typography
          variant='body2'
          sx={{
            color: 'primary.main',
            cursor: 'pointer'
          }}
          onClick={() => handleCategoryClick(row.category?.id)}
        >
          {row.category?.name}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'created_at',
      headerName: t('created_at'),
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.created_at}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 150,
      sortable: false,
      field: 'actions',
      headerName: t('actions'),
      renderCell: ({ row }) => <CommercialAdsRowOptions id={row.id} handleClickDeleteButton={handleClickDeleteButton} />
    }
  ]

  useEffect(() => {
    setTotal(data.total)
  }, [data])

  return (
    <div>
      <Card>
        <CardHeader title={t('commercial_ads')} />
        <CustomDataGrid
          toolbar={CommercialAdsListTableHeader}
          toolbarProps={{
            value: search,
            clearSearch: () => setSearch(''),
            onChange: event => setSearch(event.target.value),
            selectedRows: rowSelectionModel,
            fetchData: fetchData,
            canExport: canExport
          }}
          rows={data.items}
          columns={columns}
          total={total}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          rowSelectionModel={rowSelectionModel}
          setRowSelectionModel={setRowSelectionModel}
          sortModel={sortModel}
          setSortModel={setSortModel}
        />
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openDeleteSnackbar}
        onClose={handleCloseDeleteSnackbar}
        message={t('are_you_sure')}
        action={<SnackbarConfirmActions handleConfirm={handleDelete} handleClose={handleCloseDeleteSnackbar} />}
      />
    </div>
  )
}

export default CommercialAdsList
