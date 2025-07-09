import React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Icon from '../../@core/components/icon'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

const CommercialAdsRowOptions = ({ id, handleClickDeleteButton }) => {
    const { t } = useTranslation()
    const router = useRouter()
    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleView = (e) => {
        e.stopPropagation()
        router.push(`/commercial-ads/details/${id}`)
        handleClose()
    }

    const handleEdit = (e) => {
        e.stopPropagation()
        router.push(`/commercial-ads/edit/${id}`)
        handleClose()
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        handleClickDeleteButton(id)
        handleClose()
    }

    return (
        <>
            <IconButton
                color="secondary"
                onClick={handleView}>
                <Icon icon='tabler:eye' fontSize={20} />
            </IconButton>
            <IconButton
                color="warning"
                onClick={handleEdit}>
                <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
            <IconButton
                color="error"
                onClick={handleDelete}>
                <Icon icon='tabler:trash' fontSize={20} />
            </IconButton>
        </>
    )
}

export default CommercialAdsRowOptions
