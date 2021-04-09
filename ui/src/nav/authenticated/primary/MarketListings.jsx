import * as React from "react";

/** Utils */
import * as API from '../../../utils/API';
import PaginatedListWrapper from '../../../hoc/PaginatedListWrapper';
import AppNavWrapper from '../../../hoc/AppNavWrapper';

import EnhancedTable from '../../../components/EnhancedTable';

const columns = [
  { id: 'display.title', label: 'Name' },
  { id: 'vehicleVin', label: 'VIN' },
  { id: 'vehicleNhtsaInfo.modelYear', numeric: true, label: 'Model Year' },
  { field: 'createdAt', label: 'Created' }
];

const useLoadListings = (authContext, page, pageSize, sort, filters) => {
  return API.fetchMarketListings(page, pageSize, sort, filters);
}

function MarketListings({ listings }) {
  const { list, isLoading, page, pageSize, sort, error, changeSort, fetchData, setPage, setPageSize } = listings;


  const handleSortChange = async (field, direction) => {
    changeSort(field, direction);
  }

  const handlePageChange = async (pageNum) => {
    setPage(pageNum);
  }

  const handlePageSizeChange = async (size) => {
    setPageSize(size);
  }
  
  const handleRowClick = (e, name) => {
    console.log('row click', e, name);
  };

  return (
    <div>
      <EnhancedTable
        title="Market"
        rows={list}
        page={page}
        rowsPerPage={pageSize}
        headCells={columns}
        primaryColumn="id"
        handleSortChange={handleSortChange}
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        fillHeight={false}
        handleRowClick={handleRowClick}
        isLoading={isLoading}
      />
    </div>
  )
}

export default (
  AppNavWrapper({ title: 'Market' })(
    PaginatedListWrapper(MarketListings, useLoadListings, {
      propertyName: 'listings',
      defaultFilters: ['is_active[eq]=true']
    })
  )
);
