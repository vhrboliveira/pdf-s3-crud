import React, { useState, useEffect } from 'react';
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import axios from 'axios';
import PDFTable from '../components/Table';

import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
toast.configure();


export default function ListPDF() {
  const [pdfList, setPdfList] = useState([]);
  const [pdfHeader, setPdfHeader] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const authToken = localStorage.getItem('AUTH_TOKEN');
  if (!authToken) window.location = '/';

  useEffect(() => {
    async function getPdfs() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/pdf`,
          {
            headers: { Authorization: `Bearer ${authToken} ` }
          });

        setPdfHeader('PDF List');
        setPdfList(response.data.files);
      } catch (error) {
        if (error.response && error.response.data) {
          localStorage.removeItem('AUTH_TOKEN');
          window.location = '/';
        }
      }
    }
    if (authToken) {
      getPdfs();
    }
  }, [authToken]);

  const handleSelectedFile = (event) => {
    setSelectedFile(event.target.files[0]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_API}/pdf`, formData, {
        headers: { Authorization: `Bearer ${authToken} ` }
      });
      if (res.data.status && res.data.status === 'ok') {
        window.location = '/pdf';
      }
    } catch (error) {
      if (!error.response.data.auth && error.response.data.error) {
        toast.error(error.response.data.error, {
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        toast('Error! Pleae try it again later!');
      }
    }
  }

  return (
    <div>
      {pdfHeader ? (
        <>
          <Grid container alignItems='center' justify='space-between' direction='row'>
            <h1>{pdfHeader}</h1>
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={() => { window.location = '/logout' }}
            >
              Logout
            </Button>
          </Grid>
          <br />
          <form onSubmit={handleSubmit}>
            <Grid container alignItems='center' justify='space-between' direction='row'>
              <Input
                id="pdf"
                name="pdf"
                type="file"
                onChange={handleSelectedFile}
              />
              <Grid container alignItems="center" justify="center" direction="column">
                <Button variant="contained" color="primary" type="submit" fullWidth={true}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </>) : ''}
      {PDFTable(pdfList)}
    </div>
  );
};
