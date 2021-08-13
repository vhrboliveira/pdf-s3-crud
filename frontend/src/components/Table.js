import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import axios from 'axios';

const authToken = localStorage.getItem('AUTH_TOKEN');
const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'download', label: 'Download', minWidth: 50 },
  { id: 'delete', label: 'Delete', minWidth: 50 },
];

async function downloadPdf(pdf) {
  const result = await axios.get(`${process.env.REACT_APP_BACKEND_API}/download/${pdf}`, {
    headers: { Authorization: `Bearer ${authToken} ` }
  });
  if (result.data && result.data.url) {
    window.open(result.data.url);
  }
}

async function deletePdf(pdf) {
  await axios.delete(`${process.env.REACT_APP_BACKEND_API}/pdf/${pdf}`, {
    headers: { Authorization: `Bearer ${authToken} ` }
  });
  window.location = '/pdf';
}

function formatData(pdfs) {
  const list = pdfs.map(pdf => {
    return {
      name: pdf,
      download: (
        <IconButton onClick={() => downloadPdf(pdf)}>
          <GetAppIcon />
        </IconButton >),
      delete: (
        <IconButton onClick={() => deletePdf(pdf)}>
          <DeleteIcon />
        </IconButton>),
    }
  });

  return list;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '100%',
  },
});

export default function PDFTable(data) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const rows = formatData(data);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}