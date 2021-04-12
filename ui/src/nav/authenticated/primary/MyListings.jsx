import * as React from "react";
import { Link, useHistory } from 'react-router-dom';

/** Utils */
import * as API from '../../../utils/API';
import PaginatedListWrapper from '../../../hoc/PaginatedListWrapper';
import AppNavWrapper from '../../../hoc/AppNavWrapper';

import EnhancedTable from '../../../components/EnhancedTable';
import { Button, makeStyles } from "@material-ui/core";

const boolDisplay = val => val ? 'Yes' : 'No';
const columns = [
  { id: 'vehicleVin', label: 'VIN' },
  { id: 'createdAt', label: 'Created' },
  { id: 'isActive', label: 'Active', formatDisplay: boolDisplay },
  { id: 'isComplete', label: 'Complete', formatDisplay: boolDisplay }
];

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: 20,
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'end',
    '& > a': {
      textDecoration: 'none',
      margin: 'auto 0 auto auto'
    }
  }
}));

const useLoadListings = (authContext, page, pageSize, sort, filters) => API.fetchAccountListings(authContext, page, pageSize, sort, filters);

function MyListings({ listings }) {
  const { list, isLoading, page, pageSize, changeSort, setPage, setPageSize, error } = listings;
  const history = useHistory();
  const classes = useStyles();

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
    history.push(`/my-listings/${row.id}`);
  };

  return (
    <div>
      <div className={classes.container}>
        <Link to="/my-listings/create">
          <Button variant="outlined" color="primary">Create</Button>
        </Link>
      </div>
      <EnhancedTable
        title="My Listings"
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
        isLoading={isLoading}
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

