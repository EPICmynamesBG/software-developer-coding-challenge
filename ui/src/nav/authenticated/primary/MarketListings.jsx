import * as React from "react";

/** Utils */
import * as API from '../../../utils/API';
import PaginatedListWrapper from '../../../hoc/PaginatedListWrapper';
import AppNavWrapper from '../../../hoc/AppNavWrapper';

import EnhancedTable from '../../../components/EnhancedTable';

const columns = [
  { id: 'id', hidden: true, label: 'ID' },
  { id: 'displayName', label: 'Name' },
  { id: 'vin', label: 'VIN' },
  { id: 'modelYear', numeric: true, label: 'Model Year' }
];

const useLoadListings = (authContext, page, sort) => {
  const { auth } = authContext;
  return API.fetchMarketListings(auth.token, page, sort);
}

function MarketListings({ listings }) {
  const { list, isLoading, page, sort, changeSort, fetchData, setPage } = listings;

  const handleSortChange = async (field, direction) => {
    changeSort(field, direction);
    await fetchData();
  }

  const handlePageChange = async (pageNum) => {
    setPage(pageNum);
    await fetchData();
  }

  console.log(isLoading, list);
  return (
    <div>
      <EnhancedTable
        title="Market"
        rows={list}
        page={page}
        headCells={columns}
        primaryColumn="id"
        handleSortChange={handleSortChange}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}

export default (
  AppNavWrapper({ title: 'Market' })(
    PaginatedListWrapper(MarketListings, useLoadListings, { propertyName: 'listings' })
  )
);
