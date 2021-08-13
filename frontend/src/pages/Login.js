import React, { useState } from "react";
import axios from 'axios';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
toast.configure();

const defaultValues = {
  user: "",
  password: "",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const [formValues, setFormValues] = useState(defaultValues);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const authToken = localStorage.getItem('AUTH_TOKEN');
  if (authToken) {
    window.location = '/pdf';
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_API}/login`, formValues)
      if (res.data.auth && res.data.token) {
        localStorage.setItem('AUTH_TOKEN', res.data.token);
        window.location = '/pdf';
      }
    } catch (error) {
      if (!error.response.data.auth && error.response.data.error) {
        toast.error(error.response.data.error, {
          position: toast.POSITION.TOP_RIGHT
        });
      } else {
        toast('Error! Pleae try it again later!')
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container alignItems="center" justify="center" direction="column">
        <h1>PDF List Application</h1>
      </Grid>
      <Grid container alignItems="center" justify="center" direction="row">
        <TextField
          id="user"
          name="user"
          label="User"
          type="text"
          required
          value={formValues.user}
          onChange={handleInputChange}
          classes={{ root: 'user' }}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          required
          type={showPassword ? "text" : "password"}
          value={formValues.password}
          onChange={handleInputChange}
        />
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </Grid>
      <Grid container alignItems="center" justify="center" direction="column">
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </Grid>
    </form>
  );
};

export default Login;
