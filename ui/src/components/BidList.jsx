import * as React from 'react';
import { Button, CircularProgress, makeStyles } from "@material-ui/core";
import Bid from "./Bid";
import * as API from '../utils/API';

const { useState, useEffect } = React;
const emptyMessage = '0 bids';

const useStyles = makeStyles(theme => ({

}));

function BidList(props) {
  const { listingId, appendData = [] } = props;

  const fetchBids = page => API.fetchBids(listingId, page, 5);

  const [data, setData] = useState(appendData);
  const [pageNum, setPageNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const loadMore = async () => {
    try {
      setIsLoading(true);
      const moreData = await fetchBids(pageNum);
      if (moreData) {
        setData([...data, ...moreData]);
        setPageNum(pageNum + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMore()
      .then(() => null);
  }, []);

  const renderData = [...appendData, ...data];

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {renderData.map((obj) => {
          return <Bid key={obj.id} {...obj} />
        })}
        {renderData.length === 0 && emptyMessage}
      </div>
      {renderData.length > 0 && (
        <div className={classes.loadMore}>
          <Button endIcon={isLoading ? <CircularProgress /> : null} type="button" onClick={loadMore} variant="link" disabled={isLoading}>Load More</Button>
        </div>
      )}
    </div>
  );
}

export default BidList;
