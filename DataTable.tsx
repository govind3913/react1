import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export default function ServerPaginationGrid() {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [rowCountState, setRowCountState] = React.useState(0);

  React.useEffect(() => {
    fetchData();
  }, [paginationModel]); 

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          _page: paginationModel.page + 1, 
          _limit: paginationModel.pageSize,
        },
      });
      setRows(response.data);
      const totalCount = parseInt(response.headers['x-total-count']);
      setRowCountState(totalCount || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'title', headerName: 'Title', width: 250 },
    { field: 'body', headerName: 'Body', width: 450 },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowCount={rowCountState}
        pageSizeOptions={[5,10,20]}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
}
