import CustomLoader from "../../components/Shared/CustomLoader";
import {useEffect, useState} from "react";
import { fetchCategories } from "src/components/Categories/CategoriesServices";
import CategoriesList from "src/components/Categories/CategoriesList";

const emptyCategoriesData = { items: [], total: 0 }

const Categories = () => {
  const [searchValue, setSearchValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [sortModel, setSortModel] = useState([])
  const [rows, setRows] = useState(emptyCategoriesData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let searchTimeout = null
    if (searchValue) {
      searchTimeout = setTimeout(() => {
        fetchCategories(
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
        fetchCategories(
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
        <CategoriesList
          data={rows}
          search={searchValue}
          setSearch={setSearchValue}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          sortModel={sortModel}
          setSortModel={setSortModel}
          fetchData={() => fetchCategories
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

export default Categories
