import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Icon from '../../@core/components/icon'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

const CommercialAdsListTableHeader = props => {
    const { value, clearSearch, onChange, selectedRows, fetchData, canExport } = props
    const { t } = useTranslation()
    const router = useRouter()

    const handleAdd = () => {
        router.push('/commercial-ads/create')
    }

    return (
        <Box
            sx={{
                p: 5,
                pb: 3,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >
            <TextField
                size='small'
                value={value}
                onChange={onChange}
                placeholder={t('search')}
                sx={{ mr: 4, mb: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Icon icon='tabler:search' fontSize='1.375rem' />
                        </InputAdornment>
                    ),
                    endAdornment: value && (
                        <InputAdornment position='end'>
                            <Icon
                                icon='tabler:x'
                                fontSize='1.375rem'
                                style={{ cursor: 'pointer' }}
                                onClick={clearSearch}
                            />
                        </InputAdornment>
                    )
                }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button
                    sx={{ mb: 2 }}
                    variant='contained'
                    onClick={handleAdd}
                    startIcon={<Icon icon='tabler:plus' />}
                >
                    {t('add')}
                </Button>
            </Box>
        </Box>
    )
}

export default CommercialAdsListTableHeader
