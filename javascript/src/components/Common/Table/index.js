import {useState, useContext} from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button} from '@mui/material';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faEdit} from '@fortawesome/free-solid-svg-icons'
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {UserContext} from "../../../Context/UserContext";
import {Controller, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {client} from "../../../utils/api";
import {useMutation, useQueryClient} from "react-query";
import {allUserSongs} from "../../../utils/queryKeys";
import TextField from '@mui/material/TextField';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import moment from 'moment';
import {ErrorMessage} from "@hookform/error-message";
import {yupResolver} from '@hookform/resolvers/yup';
import Grid from '@mui/material/Grid';
import * as yup from "yup";
import AddIcon from '@mui/icons-material/Add';
import {useNavigate} from "react-router-dom";

const schema = yup.object().shape({
  title: yup
    .string()
    .matches(/^[A-Za-z0-9\s]{2,}$/, "Title is invalid"),
  artist: yup
    .string()
    .matches(/^[A-Za-z0-9\s]{2,}$/, "Artist is invalid")
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SongBookTable({song_headers, rows}) {
  // FORM
  const {currentUser, setCurrentUser} = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [editRow, setEditRow] = useState('')
  const [postAction, setPostAction] = useState('patch')
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const notifySuccess = () => toast.success("Song " + actionMapper[postAction] + " succeeded.");
  const notifyError = () => toast.error("Song " + actionMapper[postAction] + " failed.");

  // FORM
  const {control, register, handleSubmit, reset, formState: {errors}} = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema)
  });

  // Update all non-Date fields
  const onChange = (e) => {
    setEditRow({...editRow, [e.target.name]: e.target.value});
  };


  async function actionForm(data) {
    // Unpack values to variable
    const {title, artist, release_date} = data
    // format my date
    const formattedDueDate = moment(editRow.release_date).utc().format()
    console.log("Post Action:", postAction)

    if (postAction === 'patch') {
      // Make the request and wait for the response
      return await client.patch('/songs/' + editRow.id, {
        title: title,
        artist: artist,
        release_date: formattedDueDate,
      })
    } else if (postAction === 'post') {
      // Make the request and wait for the response
      return await client.post('/songs', {
        title: title,
        artist: artist,
        release_date: formattedDueDate,
        user_id: currentUser.id
      })
    } else if (postAction === 'delete') {
      // Make the request and wait for the response
      return await client.delete('/songs/' + editRow.id)
    }
  }

  const {isLoading, mutateAsync: sendData} = useMutation(actionForm);

  const onSubmit = async (data, e) => {
    try {
      await sendData(data)
      await queryClient.refetchQueries([allUserSongs, {userId: currentUser.id}])
      notifySuccess()
      reset()
      e.target.reset()
      setOpen(false)
    } catch (err) {
      notifyError()
      throw new Error(err)
    }
  }

  // MODAL
  const actionMapper = {
    "patch": "Edit",
    "delete": "Delete",
    "post": "Add"
  }

  const handleOpen = (row) => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditRow({})
  }

  const handleLogout = () => {
    localStorage.removeItem("logged_in_user");
    setCurrentUser({})
    navigate("/login");
  }


  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      spacing={2} columns={12}
      alignItems="center">
      <Grid item xs={8}>
        <Button
          color="primary"
          size="small"
          startIcon={<AddIcon/>}
          component="button"
          variant="contained"
          onClick={() => {
            setPostAction('post')
            setOpen(true)
            setEditRow({})
          }}
        >
          Add New Song
        </Button>
      </Grid>

      <Grid item xs={8}>
        <TableContainer sx={{width: "auto"}} component={Paper}>
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow>
                {
                  song_headers.map((song_head) => (
                    <TableCell key={song_head} align="left">{song_head}</TableCell>
                  ))
                }
                < TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.title + row.id.toString()}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.title}</TableCell>
                  <TableCell align="left">{row.artist}</TableCell>
                  <TableCell align="left">{moment(row.release_date).utc().local().format('L')}</TableCell>
                  <TableCell align="center">
                    <Button size="small" songob={JSON.stringify(row)} onClick={(e) => {
                      setPostAction('patch')
                      setOpen(true)
                      setEditRow(JSON.parse(e.target.getAttribute('songob')))
                    }} key={"edit" + row.id.toString()} variant="text" startIcon={<FontAwesomeIcon icon={faEdit}/>}>
                      Edit
                    </Button>
                    <Button size="small" color="error" songob={JSON.stringify(row)} onClick={(e) => {
                      setPostAction('delete')
                      setEditRow(JSON.parse(e.target.getAttribute('songob')))
                      setOpen(true)
                    }} key={"delete" + row.id.toString()} variant="text"
                            startIcon={<FontAwesomeIcon icon={faTrash}/>}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {/* TITLE */}
              <Typography mb={3} id="modal-modal-title" variant="h6" component="h2">
                {actionMapper[postAction]} Song {["patch", "delete"].includes(postAction) ? "#" + editRow.id : ""}
              </Typography>

              {/* FORM */}
              <form method="patch" onSubmit={handleSubmit(onSubmit)}>

                {/* Title */}
                {
                  postAction === "delete" ? <></>
                    :
                    <Controller
                      name={"title"}
                      control={control}
                      render={({
                                 field: {ref, ...field},
                                 fieldState: {invalid, error}
                               }) => (
                        <>
                          <TextField
                            {...field}
                            id="title"
                            label="Title"
                            autoFocus
                            fullWidth
                            margin="normal"
                            defaultValue={editRow.title || ""}
                            variant="outlined"
                            error={invalid}
                          />
                          <ErrorMessage style={{color: "red"}} errors={errors} name="title" as="p"/>
                        </>
                      )}
                    />
                }

                {/* Artist */}
                {
                  postAction === "delete" ? <></>
                    :
                    <Controller
                      name={"artist"}
                      control={control}
                      render={({
                                 field: {ref, ...field},
                                 fieldState: {invalid, error}
                               }) => (
                        <>
                          <TextField
                            {...field}
                            fullWidth
                            margin="normal"
                            id="artist"
                            label="Artist"
                            defaultValue={editRow.artist || ""}
                            variant="outlined"
                            error={invalid}
                          />
                          <ErrorMessage style={{color: "red"}} errors={errors} name="artist" as="p"/>
                        </>
                      )}
                    />
                }


                {/* DATE */}
                {
                  postAction === "delete" ? <></>
                    :
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Release Date"
                        value={editRow.release_date}
                        onChange={(date) => {
                          setEditRow({...editRow, ['release_date']: date});
                        }}
                        renderInput={(params) =>
                          <TextField {...params} sx={{width: '100%', marginTop: 2}}/>
                        }
                      />
                    </LocalizationProvider>
                }

                {
                  postAction === "delete" ?
                    <>
                      <p>Are you sure you want to delete the song <b>{editRow.title}</b></p>
                    </>
                    : <></>
                }

                <button className="reg-form" type="submit">{actionMapper[postAction]}</button>
              </form>
            </Box>
          </Modal>
        </TableContainer>
      </Grid>

      <Grid item xs={8}>
        <Button
          color="secondary"
          size="small"
          component="button"
          variant="text"
          onClick={() => {
            handleLogout()
            setOpen(false)
            setEditRow({})
          }}
        >
          Logout
        </Button>
      </Grid>
    </Grid>
  )
}