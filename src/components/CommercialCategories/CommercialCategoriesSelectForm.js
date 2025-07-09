import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useTranslation } from 'react-i18next'
import { fetchAllCommercialCategories } from './CommercialCategoriesServices'

const CommercialCategoriesSelectForm = ({ commercial_category_id, setValue, control }) => {
    const { t } = useTranslation()
    const [categories, setCategories] = useState([])

    useEffect(() => {
        getCategories()
    }, [])

    const getCategories = async () => {
        const data = await fetchAllCommercialCategories()
        setCategories(data || [])
    }

    useEffect(() => {
        if (commercial_category_id && categories.length > 0) {
            const selectedCategory = categories.find(cat => cat.id == commercial_category_id)
            if (selectedCategory) {
                setValue('commercial_category_id', selectedCategory)
            }
        }
    }, [commercial_category_id, categories, setValue])

    return (
        <Controller
            name='commercial_category_id'
            control={control}
            render={({ field: { value, onChange } }) => (
                <CustomAutocomplete
                    value={value}
                    onChange={(event, newValue) => {
                        onChange(newValue)
                    }}
                    options={categories}
                    getOptionLabel={option => option?.name || ''}
                    renderInput={params => (
                        <CustomTextField
                            {...params}
                            label={t('commercial_category')}
                            placeholder={t('select_commercial_category')}
                        />
                    )}
                />
            )}
        />
    )
}

export default CommercialCategoriesSelectForm
