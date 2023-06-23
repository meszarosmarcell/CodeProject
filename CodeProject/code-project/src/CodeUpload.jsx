import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

import axios from "axios";

export default function HomePage() {
  const todaysDate = new Date().toLocaleString("hu-Hu", {
    month: "long",
    day: "2-digit",
  });
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [date, setDate] = useState(todaysDate);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [missingDialog, setMissingDialog] = useState(false);
  const [emailMisMatch, setEmailMisMatch] = useState(false);
  const [inapropiateCode, setInapropiateCode] = useState(false);
  const [dateMisMatch, setDateMisMatch] = useState(false);
  const [succes, setSucces] = useState(false);
  const [lose, setLose] = useState(false);

  const dates = [];
  const hours = [];
  const minutes = [];

  let navigate = useNavigate();

  function validate() {
    if (email === "" || code === "" || hour === "" || minute === "") {
      setMissingDialog(true);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailMisMatch(true);
      return;
    }
    if (code.length !== 8 || !/^[A-Za-z0-9]*$/.test(code)) {
      setInapropiateCode(true);
      return;
    }
    if (date > todaysDate) {
      setDateMisMatch(true);
      return;
    }

    uploadCode();
  }

  async function uploadCode() {
    const selectedDate = date.split(" ");
    let month = selectedDate[0];
    const day = selectedDate[1].slice(0, -1);
    if (month === "június") month = "06";
    if (month === "július") month = "07";
    if (month === "augusztus") month = "08";
    const sendDate = "2023-" + month + "-" + day + " " + hour + ":" + minute;
    console.log(sendDate);
    const uploadData = {
      email: email,
      code: code,
      purchase_time: sendDate,
    };
    try {
      const response = await axios.post(
        "https://ncp-dummy.staging.moonproject.io/api/meszaros-marcell/code/upload/",
        uploadData
      );

      if (response.data.data.won) {
        setSucces(true);
      } else {
        setLose(true);
      }
    } catch (error) {
      if (error.response.data.errors[0].code === "email:not_found") {
        navigate("/registration", {
          state: { email: email, sendDate: sendDate, code: code },
        });
      }
      console.log(error);
    }
  }

  for (let i = 0; i <= 2; i++) {
    for (let j = 1; j <= 31; j++) {
      if (i === 0 && j !== 31) {
        dates.push("június " + j + ".");
      }
      if (i === 1) {
        dates.push("július " + j + ".");
      }
      if (i === 2) {
        dates.push("augusztus " + j + ".");
      }
    }
  }
  for (let i = 0; i <= 23; i++) {
    if (i < 10) hours.push("0" + i);
    else hours.push(i);
  }
  for (let i = 0; i <= 59; i++) {
    if (i < 10) minutes.push("0" + i);
    else minutes.push(i);
  }

  return (
    <>
      <Dialog open={missingDialog}>
        <DialogContent dividers>
          <Typography variant="h6">Minden adatot meg kell adnod!</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMissingDialog(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={emailMisMatch}>
        <DialogContent dividers>
          <Typography variant="h6">Az email cím nem megfelelő!</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEmailMisMatch(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={inapropiateCode}>
        <DialogContent dividers>
          <Typography variant="h6">
            A kódnak 8 karakterből kell állnia és csak az angol abc betűit és
            számokat tartalmazhat!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setInapropiateCode(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dateMisMatch}>
        <DialogContent dividers>
          <Typography variant="h6">
            Nem adhatsz meg a mainál későbbi dátumot!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDateMisMatch(false);
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
          <CardHeader title="Kódfeltöltés" style={{ textAlign: "center" }} />
          <CardContent>
            <TextField
              sx={{ marginTop: 3 }}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              label="E-mail"
              required
              value={email}
              type="email"
            />
            <TextField
              sx={{ marginTop: 3 }}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              label="Kód"
              required
              value={code}
            />
            <Grid>
              Dátum
              <Select
                sx={{ marginTop: 3, marginRight: 3 }}
                value={date}
                label="Date"
                onChange={(e) => setDate(e.target.value)}
                type="date"
                required
              >
                {dates.map((i) => (
                  <MenuItem value={i} key={i}>
                    {i}
                  </MenuItem>
                ))}
              </Select>
              Óra
              <Select
                sx={{ marginTop: 3, marginRight: 3 }}
                required
                value={hour}
                label="Hour"
                onChange={(e) => setHour(e.target.value)}
              >
                {hours.map((i) => (
                  <MenuItem value={i} key={i}>
                    {i}
                  </MenuItem>
                ))}
              </Select>
              Perc
              <Select
                sx={{ marginTop: 3 }}
                value={minute}
                label="Minute"
                required
                onChange={(e) => setMinute(e.target.value)}
              >
                {minutes.map((i) => (
                  <MenuItem value={i} key={i}>
                    {i}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </CardContent>
          <CardActions
            disableSpacing
            sx={{ marginBottom: 1, justifyContent: "center" }}
          >
            <Button variant="outlined" onClick={() => validate()}>
              Kódfeltöltés
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}
