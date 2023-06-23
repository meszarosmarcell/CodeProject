import { useState } from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import axios from "axios";
import { useLocation } from "react-router-dom";

export default function HomePage() {
  let location = useLocation();

  const [email, setEmail] = useState(location?.state?.email);
  const [name, setName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [missingData, setMissingData] = useState(false);
  const [notAccepted, setNotAccapted] = useState(false);
  const [succes, setSucces] = useState(false);
  const [lose, setLose] = useState(false);

  function validate() {
    if (email === "" || name === "") {
      setMissingData(true);
      return;
    }
    if (!accepted) {
      setNotAccapted(true);
      return;
    }
    register();
  }

  async function register() {
    const sendData = {
      email: email,
      name: name,
    };
    try {
      const response = await axios.post(
        "https://ncp-dummy.staging.moonproject.io/api/meszaros-marcell/user/register/",
        sendData
      );
      if (response.status === 200) {
        uploadCode();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadCode() {
    const uploadData = {
      email: email,
      code: location.state.code,
      purchase_time: location.state.sendDate,
    };
    try {
      const response = await axios.post(
        "https://ncp-dummy.staging.moonproject.io/api/meszaros-marcell/code/upload/",
        uploadData
      );
      console.log(response.data);

      if (response.data.data.won) {
        setSucces(true);
      } else {
        setLose(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Dialog open={missingData}>
        <DialogContent dividers>
          <Typography variant="h6">Minden adatot meg kell adnod!</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMissingData(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={notAccepted}>
        <DialogContent dividers>
          <Typography variant="h6">
            El kell fogadnod a játékszabályzatot!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setNotAccapted(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={succes}>
        <DialogContent dividers>
          <Typography variant="h6">Gratulálunk, nyertél!</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSucces(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={lose}>
        <DialogContent dividers>
          <Typography variant="h6">Sajnos most nem nyertél!</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLose(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container marginY={12} justifyContent={"center"}>
        <Card elevation={20}>
          <CardHeader title="Regisztráció" style={{ textAlign: "center" }} />
          <CardContent>
            <TextField
              sx={{ marginTop: 3 }}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              label="E-mail"
              required
              value={email}
              type="email"
              inputProps={{
                readOnly: true,
              }}
            />
            <TextField
              sx={{ marginTop: 3 }}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              label="Név"
              required
              value={name}
            />

            <FormControlLabel
              checked={accepted}
              control={<Checkbox />}
              label="Elolvastam és elfogadom a játékszabályzatot."
              onChange={() => setAccepted(!accepted)}
            />
          </CardContent>
          <CardActions
            disableSpacing
            sx={{ marginBottom: 1, justifyContent: "center" }}
          >
            <Button variant="outlined" onClick={() => validate()}>
              Regisztrálok
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}
