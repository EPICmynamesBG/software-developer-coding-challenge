import * as React from "react";
import { useState, useEffect, useContext } from "react";

import { authContext } from "../contexts/AuthContext";

function buildSortString(field, direction = 'asc') {
  const dir = direction === 'asc' ? '+' : '-';
  return `${dir}${field}`;
}

function PaginatedListWrapper(Component, fetchFn, {
  loadOnMount = true,
  requiresAuthentication = true,
  propertyName = 'data',
  defaultSort = 'id'
}) {
  return function PaginatedComponent(props) {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(0);
    const [sortField, setSortField] = useState(defaultSort);
    const [sortDir, setSortDir] = useState('asc');
    const [isLoading, setIsLoading] = useState(false);
    const loadedContext = useContext(authContext);

    const fetchPage = async () => {
      if (isLoading) {
        return;
      }
      const sortStr = buildSortString(sortField, sortDir);
      const fetchArgs = requiresAuthentication ?
        [loadedContext, page, sortStr] :
        [page, sortStr];
      try {
        setIsLoading(true);
        const data = await fetchFn(...fetchArgs);
        console.log(data);
        setList([...list, ...data]);
        setPage(page + 1);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    };

    const reset = () => {
      setSortField(defaultSort);
      setSortDir('asc');
      setList([]);
      setPage(0);
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
    };


    useEffect(async () => {
      if (loadOnMount) {
        fetchPage();
      }
      return reset;
    }, []);

    const injectProps = {
      [propertyName]: {
        sort: buildSortString(sortField, sortDir),
        list,
        page,
        fetchData: fetchPage,
        resetList: reset,
        isLoading,
        changeSort,
        setPage
      }
    };

    return <Component {...props} {...injectProps} />;
  }
}

export default PaginatedListWrapper;
