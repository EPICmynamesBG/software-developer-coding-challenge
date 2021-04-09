import * as React from "react";
import { useHistory } from 'react-router-dom';

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


const useLoadListings = (authContext, page, pageSize, sort, filters) => API.fetchAccountListings(authContext, page, pageSize, sort, filters);

function MyListings({ listings }) {
  const { list, isLoading, page, pageSize, sort, changeSort, setPage, setPageSize, error } = listings;
  const history = useHistory();

  const handleSortChange = async (field, direction) => {
    changeSort(field, direction);
  }

  const handlePageChange = async (pageNum) => {
    setPage(pageNum);
  }

  const handlePageSizeChange = async (size) => {
    setPageSize(size);
  }

  const handleRowClick = (e, row) => {
    history.push(`/my-listings/${row.id}`);
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
        error={error}
        handleRowClick={handleRowClick}
      />
    </div>
  );
}

export default (
  AppNavWrapper({ title: 'My Listings' })(
    PaginatedListWrapper(MyListings, useLoadListings, {
      propertyName: 'listings',
      defaultSort: 'createdAt'
    })
  )
);

