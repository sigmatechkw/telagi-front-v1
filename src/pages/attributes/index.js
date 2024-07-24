import CustomLoader from "../../components/Shared/CustomLoader";
import {useEffect, useState} from "react";
import { fetchAttributes } from "src/components/Attributes/AttributesServices";
import AttributesList from "src/components/Attributes/AttributesList";

const Attributes = () => {
  const [searchValue, setSearchValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [sortModel, setSortModel] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let searchTimeout = null
    if (searchValue) {
      searchTimeout = setTimeout(() => {
        fetchAttributes(
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
      fetchAttributes(
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
          fetchData={() => fetchAttributes
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

export default Attributes
