import * as React from "react";

/** Utils */
import * as API from '../../../utils/API';
import PaginatedListWrapper from '../../../hoc/PaginatedListWrapper';
import AppNavWrapper from '../../../hoc/AppNavWrapper';

import EnhancedTable from '../../../components/EnhancedTable';

const columns = [
  { id: 'id', hidden: true, label: 'ID' },
  { id: 'vehicleVin', label: 'VIN' },
  { id: 'createdAt', label: 'Created' }
];


const useLoadListings = (authContext, page, pageSize, sort, filters) => {
  const { auth } = authContext;
  console.log(auth);
  return API.fetchAccountListings(auth.token, auth.id, page, pageSize, sort, filters);
}

function MyListings({ listings }) {
  const { list, isLoading, page, pageSize, sort, changeSort, fetchData, setPage, setPageSize } = listings;

  const handleSortChange = async (field, direction) => {
    changeSort(field, direction);
    await fetchData();
  }

  const handlePageChange = async (pageNum) => {
    setPage(pageNum);
    await fetchData();
  }

  const handlePageSizeChange = async (size) => {
    setPageSize(size);
    await fetchData();
  }

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
      />
    </div>
  );
}

export default (
  AppNavWrapper({ title: 'My Listings' })(
    PaginatedListWrapper(MyListings, useLoadListings, {
      propertyName: 'listings',
      defaultSort: '+createdAt'
    })
  )
);

