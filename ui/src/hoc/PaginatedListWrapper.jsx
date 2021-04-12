import * as React from "react";
import { useState, useEffect, useContext, useCallback } from "react";

import { authContext } from "../contexts/AuthContext";

function buildSortString(field, direction = 'asc') {
  const dir = direction === 'asc' ? '+' : '-';
  return `${dir}${field}`;
}

function PaginatedListWrapper(Component, fetchFn, {
  loadOnMount = true,
  requiresAuthentication = true,
  propertyName = 'data',
  defaultSort = 'id',
  defaultFilters = [],
  defaultPageSize = 50
}) {
  return function PaginatedComponent(props) {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(0);
    const [sortField, setSortField] = useState(defaultSort);
    const [sortDir, setSortDir] = useState('asc');
    const [filters, setFilters] = useState(defaultFilters);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const loadedContext = useContext(authContext);

    const fetchPage = async () => {
      if (isLoading) {
        return;
      }
      const sortStr = buildSortString(sortField, sortDir);
      const fetchArgs = requiresAuthentication ?
        [loadedContext, page, pageSize, sortStr, filters] :
        [page, pageSize, sortStr, filters];
      try {
        console.log('fetching', sortStr);
        setIsLoading(true);
        const data = await fetchFn(...fetchArgs);
        setList(data);
      } catch (e) {
        console.error(e);
        setError(e);
      }
      setIsLoading(false);
    };

    useEffect(() => {
      fetchPage();
    }, [pageSize, filters, sortDir, sortField, page]);


    const reset = () => {
      setSortField(defaultSort);
      setSortDir('asc');
      setList([]);
      setPage(0);
      setFilters(defaultFilters);
    };

    const changeSort = (field, direction) => {
      let changed = false;
      if (field) {
        setSortField(field);
        changed = true;
      }
      if (direction) {
        setSortDir(direction);
        changed = true;
      }
      if (changed) {
        setList([]);
        setPage(0);
      }
      console.log('changed sort', field, direction);
    };

    const changePage = (goToPage = 0) => {
      setPage(goToPage);
      setList([]);
    };

    const changePageSize = (newSize) => {
      setPageSize(newSize);
      setList([]);
    };

    const addFilter = (filterString) => {
      setFilters([...filters, filterString]);
    };

    const removeFilter = (filterString) => {
      const idx = filters.indexOf(filterString);
      if (idx === -1) {
        console.warn('Attempted to remove unset filter');
        return null;
      }
      setFilters([
        ...filters.slice(0, idx),
        ...filters.slice(idx + 1)
      ]);
    };

    useEffect(() => {
      if (loadOnMount) {
        fetchPage(true);
      }
      return reset;
    }, []);

    const injectProps = {
      [propertyName]: {
        sort: buildSortString(sortField, sortDir),
        list,
        page,
        pageSize,
        filters,
        error,
        fetchData: fetchPage,
        resetList: reset,
        isLoading,
        changeSort,
        setPage: changePage,
        setPageSize: changePageSize,
        addFilter,
        removeFilter
      }
    };

    return <Component {...props} {...injectProps} />;
  }
}

export default PaginatedListWrapper;
