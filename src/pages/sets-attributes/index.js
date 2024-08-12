import CustomLoader from "../../components/Shared/CustomLoader";
import {useEffect, useState} from "react";
import { fetchAttributesSets } from 'src/components/AttributesSets/AttributesSetsServices'
import AttributesList from "src/components/AttributesSets/AttributesSetsList";

const AttributesSets = () => {
  const [searchValue, setSearchValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [sortModel, setSortModel] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let searchTimeout = null
    if (searchValue) {
      searchTimeout = setTimeout(() => {
        fetchAttributesSets(
          paginationModel.page,
          searchValue,
          sortModel[0]?.field,
          sortModel[0]?.sort,
          paginationModel.pageSize,
          setRows,
          setLoading
        )
      }, 500)
    } else {
      fetchAttributesSets(
        paginationModel.page,
        searchValue,
        sortModel[0]?.field,
        sortModel[0]?.sort,
        paginationModel.pageSize,
        setRows,
        setLoading
      )
    }

    return () => searchTimeout && clearTimeout(searchTimeout)
  }, [paginationModel, searchValue, sortModel])


  return (
    loading ?
      <CustomLoader />
      :
      <>
        <AttributesList
          data={rows}
          search={searchValue}
          setSearch={setSearchValue}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          sortModel={sortModel}
          setSortModel={setSortModel}
          fetchData={() => fetchAttributesSets
          (paginationModel.page,
           searchValue,
           sortModel[0]?.field,
           sortModel[0]?.sort,
           paginationModel.pageSize,
           setRows,
           setLoading)}
          canExport={false}
        />
      </> 

  )
}

export default AttributesSets
