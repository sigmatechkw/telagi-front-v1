import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CustomDataGrid from '../Shared/CustomDataGrid'
import Snackbar from '@mui/material/Snackbar'
import SnackbarConfirmActions from '../Shared/SnackbarConfirmActions'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Icon from '../../@core/components/icon'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { deleteCommercialCategories } from './CommercialCategoriesServices'
import CommercialCategoriesRowOptions from './CommercialCategoriesRowOptions'
import CommercialCategoriesListTableHeader from './CommercialCategoriesListTableHeader'

const CommercialCategoriesList = ({
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
    const ImgStyled = styled('img')(({ theme }) => ({
        width: 40,
        height: 40,
        borderRadius: theme.shape.borderRadius,
        objectFit: 'cover'
    }))
    const { t } = useTranslation()
    const [total, setTotal] = useState(data.total)
    const [rowSelectionModel, setRowSelectionModel] = useState([])
    const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false)
    const [selectedRowId, setSelectedRowId] = useState(null)

    const handleDelete = () => {
        deleteCommercialCategories([selectedRowId]).then(res => {
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
            flex: 0.1,
            minWidth: 80,
            field: 'image',
            headerName: t('image'),
            renderCell: ({ row }) => (
                row.image ? (
                    <ImgStyled
                        src={row.image}
                        alt={row.name}
                    />
                ) : (
                    <Box sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1
                    }}>
                        <Icon icon='tabler:photo-off' fontSize='1.5rem' color='text.disabled' />
                    </Box>
                )
            )
        },
        {
            flex: 0.175,
            minWidth: 120,
            field: 'name',
            headerName: t('name'),
            renderCell: ({ row }) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {row.name}
                </Typography>
            )
        },
        {
            flex: 0.175,
            minWidth: 120,
            field: 'order',
            headerName: t('order'),
            renderCell: ({ row }) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {row.order}
                </Typography>
            )
        },
        {
            flex: 0.1,
            minWidth: 100,
            field: 'active',
            headerName: t('active'),
            renderCell: ({ row }) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {row.active == 1 ? (
                        <Icon icon='tabler:circle-check' color='green' fontSize='2rem' />
                    ) : (
                        <Icon icon='tabler:xbox-x' fontSize='2rem' color='red' />
                    )}
                </Typography>
            )
        },
        {
            flex: 0.1,
            minWidth: 100,
            field: 'featured',
            headerName: t('featured'),
            renderCell: ({ row }) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {row.featured == 1 ? (
                        <Icon icon='tabler:circle-check' color='green' fontSize='2rem' />
                    ) : (
                        <Icon icon='tabler:xbox-x' fontSize='2rem' color='red' />
                    )}
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
            renderCell: ({ row }) => <CommercialCategoriesRowOptions id={row.id} handleClickDeleteButton={handleClickDeleteButton} />
        }
    ]

    useEffect(() => {
        setTotal(data.total)
    }, [data])

    return (
        <div>
            <Card>
                <CardHeader title={t('commercial_categories')} />
                <CustomDataGrid
                    toolbar={CommercialCategoriesListTableHeader}
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

export default CommercialCategoriesList
