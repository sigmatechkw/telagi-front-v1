import CustomLoader from "../../components/Shared/CustomLoader";
import {useEffect, useState} from "react";
import { fetchAds } from "src/components/Ads/adsServices";
import AdsList from "src/components/Ads/AdsList";

const Ads = () => {
  const [searchValue, setSearchValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const [sortModel, setSortModel] = useState([])
  const [isActive, setIsActive] = useState('')
  const [isExpired, setIsExpired] = useState('')
  const [isSold, setIsSold] = useState('')
  const [isFeatured, setIsFeatured] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let searchTimeout = null
    if (searchValue) {
      searchTimeout = setTimeout(() => {
        fetchAds(
          paginationModel.page,
          searchValue,
          sortModel[0]?.field,
          sortModel[0]?.sort,
          paginationModel.pageSize,
          isActive,
          isExpired,
          isSold,
          isFeatured,
          setRows,
          setLoading
        )
      }, 500)
    } else {
        fetchAds(
        paginationModel.page,
        searchValue,
        sortModel[0]?.field,
        sortModel[0]?.sort,
        paginationModel.pageSize,
        isActive,
        isExpired,
        isSold,
        isFeatured,
        setRows,
        setLoading
      )
    }

    return () => searchTimeout && clearTimeout(searchTimeout)
  }, [paginationModel, searchValue, sortModel, isActive ,isExpired , isFeatured , isSold])


  return (
    loading ?
      <CustomLoader />
      :
      <>
        <AdsList
          data={rows}
          search={searchValue}
          setSearch={setSearchValue}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          sortModel={sortModel}
          setSortModel={setSortModel}
          isActive={isActive}
          setIsActive={setIsActive}
          isExpired={isExpired}
          setIsExpired={setIsExpired}
          isSold={isSold}
          setIsSold={setIsSold}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          fetchData={() => fetchAds
          (paginationModel.page,
           searchValue,
           sortModel[0]?.field,
           sortModel[0]?.sort,
           paginationModel.pageSize,
           isActive,
           isExpired,
           isSold,
           isFeatured,
           setRows,
           setLoading)}
          canExport={false}
        />
      </> 

  )
}

export default Ads
