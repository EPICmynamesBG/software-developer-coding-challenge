import * as React from "react";
import { useHistory } from 'react-router-dom';

/** Utils */
import * as API from '../../../utils/API';
import PaginatedListWrapper from '../../../hoc/PaginatedListWrapper';
import AppNavWrapper from '../../../hoc/AppNavWrapper';

import EnhancedTable from '../../../components/EnhancedTable';

const columns = [
  { id: 'display.title', label: 'Name' },
  { id: 'vehicleVin', label: 'VIN' },
  { id: 'vehicleNhtsaInfo.modelYear', label: 'Model Year' },
  { id: 'startAtTimestamp', label: 'Active as Of' },
  { id: 'endAtTimestamp', label: 'Ending At' }
];

const useLoadListings = (page, pageSize, sort, filters) => {
  return API.fetchMarketListings(page, pageSize, sort, filters);
}

const useLoadListingsCount = (filters) => {
  return API.fetchCountOfMarketListings(filters);
}

function MarketListings({ listings }) {
  const { list, isLoading, page, pageSize, changeSort, setPage, setPageSize, totalCount } = listings;
  const history = useHistory();

  const handleSortChange = (field, direction) => {
    changeSort(field, direction);
  }

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size);
  }

  const handleRowClick = (e, row) => {
    history.push(`/market/${row.id}`);
  };

  return (
    <div>
      <EnhancedTable
        title="Market Listings"
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
        totalCount={totalCount}
      />
    </div>
  )
}

export default (
  AppNavWrapper({ title: 'Market' })(
    PaginatedListWrapper(MarketListings, useLoadListings, {
      propertyName: 'listings',
      defaultFilters: ['is_active[eq]=true'],
      requiresAuthentication: false,
      totalCountFn: useLoadListingsCount
    })
  )
);
