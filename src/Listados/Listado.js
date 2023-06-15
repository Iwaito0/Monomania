import MiNavBar from "../MiNavBar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TableContainer, Paper, Table, TableHead, TableRow,
  TableCell, IconButton, Collapse, Box, Typography,
  TableBody, TextField, Input, Alert, Button
} from "@mui/material";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { grey } from '@mui/material/colors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Listado() {
  const location = useLocation();
  const datosUsuario = { id: location.state.prop1, nombre: location.state.prop2, adm: location.state.prop3 };
  const [datosPeliculasValidadas, setDatosPeliculasValidadas] = useState([]);
  const [mensajeError, setMensajeError] = useState("");
  const [alertaError, setAlertaError] = useState(false);
  const [mensajeOK, setMensajeOK] = useState("");
  const [alertaOK, setAlertaOK] = useState(false);
  const [alertaConfirmacion, setAlertaConfirmacion] = useState(false);
  const [idPelBorrar, setIdPelBorrar] = useState(-1);
  const [idNovBorrar, setIdNovBorrar] = useState(-1);

  const [datosNovelasValidadas, setDatosNovelasValidadas] = useState([]);

  // console.log(datosUsuario)
  //console.log(location.state.prop4);
  useEffect(() => {

    async function getPeliculasValidadas() {


      let response = await fetch(`php/proyectoFinal/Pelicula/getTodasPeliculasValidadas.php`, {
        method: 'GET'
      });

      if (response.ok) {
        //let respuesta = await response.json();
        let respuesta = await response.json();
        setDatosPeliculasValidadas(respuesta);
      }
    }
    getPeliculasValidadas();

  }, []);

  useEffect(() => {

    async function getNovelasValidadas() {


      let response = await fetch(`php/proyectoFinal/Novela/getTodasNovelasValidadas.php`, {
        method: 'GET'
      });

      if (response.ok) {
        //let respuesta = await response.json();
        let respuesta = await response.json();
        setDatosNovelasValidadas(respuesta);
      }
    }
    getNovelasValidadas();

  }, []);





  if (location.state.prop4 == "nov") {

    //Novelas

    function eliminarNov(oEvento) {
      if (location.state.prop4 == "nov") {
        let oE = oEvento || window.event;
        let lista;

        if (oE.target.id == "") {
          lista = oE.target.parentNode;
        }
        else {
          lista = oE.target;
        }
        setIdNovBorrar(lista.dataset.key);
        setAlertaConfirmacion(true);
        window.scrollTo(0, 0);
      }
    }
    async function deleteNov() {
      if (location.state.prop4 == "nov") {
        let idUpVe = new FormData();
        idUpVe.append("idNovela", idNovBorrar);
        idUpVe.append("adm", datosUsuario.adm);

        let response = await fetch(`php/proyectoFinal/Novela/eliminarNovela.php`, {
          body: idUpVe,
          method: 'POST'
        });

        let respuesta = await response.json();
        if (response.ok) {
          if (respuesta.error) {
            setMensajeError(respuesta.datos);
            setAlertaError(true);
            window.scrollTo(0, 0);
          }
          else {
            setMensajeOK(respuesta.datos);
            setAlertaOK(true);
            window.scrollTo(0, 0);
          }

        }
      }

    }


    async function modificarNov(oEvento) {
      let oE = oEvento || window.event;
      let lista;

      if (oE.target.id == "") {
        lista = oE.target.parentNode;
      }
      else {
        lista = oE.target;
      }
      let elem = document.querySelectorAll('[data-key="' + lista.dataset.key + '"]')
      //console.log(elem);
      let tituloEspanol = elem["0"].firstChild.firstChild.value;
      let tituloEn = elem["1"].firstChild.firstChild.value;
      let tituloJP = elem["2"].firstChild.firstChild.value;
      let capEstrenado = elem["3"].firstChild.firstChild.value;
      let enlace = elem["4"].firstChild.firstChild.value;

      let fotoBD = document.getElementById("fotoVerd");
      let limTamano = document.getElementById("limTamano");


      let idUpVe = new FormData();
      idUpVe.append("idNov", lista.dataset.key);
      idUpVe.append("titulo", tituloEspanol);
      idUpVe.append("tituloEN", tituloEn);
      idUpVe.append("tituloJP", tituloJP);
      idUpVe.append("capEstrenado", capEstrenado);
      idUpVe.append("enlace", enlace);
      idUpVe.append("foto", fotoBD.files[0]);
      idUpVe.append("limTam", limTamano.value);


      let response = await fetch(`php/proyectoFinal/Novela/modificarNovelasValidadas.php`, {
        body: idUpVe,
        method: 'POST'
      });

      let respuesta = await response.json();
      if (response.ok) {
        if (respuesta.error) {
          setMensajeError(respuesta.datos);
          setAlertaError(true);
          window.scrollTo(0, 0);
        }
        else {
          setMensajeOK(respuesta.datos);
          setAlertaOK(true);
          window.scrollTo(0, 0);
        }

      }
    }

    function Row(props) {
      const { row } = props;
      const [open, setOpen] = React.useState(false);

      return (
        <React.Fragment>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
              {datosUsuario.adm == 1 && (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              )}
            </TableCell>
            <TableCell align="center" component="th" scope="row" >{row.tituloEspanol}</TableCell>
            <TableCell align="center" >{row.tituloIngles}</TableCell>
            <TableCell align="center" >{row.tituloJapones}</TableCell>
            <TableCell align="center">{row.capituloEstrenado}</TableCell>
            <TableCell align="center">{row.enlace}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Modificar/Eliminar Novela
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow className="col-12">
                        <TableCell className="col-lg-2 col-md-2 col-sm-12" align="center">Nuevo titulo en Español</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Nuevo titutlo en Ingles</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Nuevo titutlo en Japones</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Capitulo estrenado</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Enlace</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Nueva foto</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Editar</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Eliminar</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        <TableRow key={"1"}>
                          <TableCell align="center" component="th" scope="row">
                            <TextField className="col-12" id="titulo" data-key={row.idNovelas} placeholder="titulo" name="titulo" ></TextField>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <TextField className="col-12" id="tituloEn" data-key={row.idNovelas} placeholder="tituloIngles" name="tituloEn" ></TextField>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <TextField className="col-12" id="tituloJP" data-key={row.idNovelas} placeholder="tituloJP" name="tituloJP" ></TextField>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <TextField className="col-12" id="capituloEstrenado" data-key={row.idNovelas} placeholder="capituloEstrenado" name="capituloEstrenado" ></TextField>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <TextField className="col-12" id="enlace" data-key={row.idNovelas} placeholder="enlace" name="enlace" ></TextField>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <Input className="col-lg-12 col-md-12  col-sm-12" type="file" name="foto" id="fotoVerd" />
                            <input type="hidden" name="lim_tamano" value="100000" id="limTamano" />
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <EditIcon id="btnEditar" data-key={row.idNovelas} onClick={() => { modificarNov() }} />
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <DeleteIcon id="btnEliminar" data-key={row.idNovelas} onClick={() => { eliminarNov() }} />
                          </TableCell>
                        </TableRow>

                      }
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    }


    return (
      <>
        <MiNavBar datos={datosUsuario} />

        {alertaConfirmacion && (
          <Alert className="alertMui " onClose={() => { setAlertaConfirmacion(false); }} severity="info">
            {
              "¿Deseas eliminar la pelicula?"
            }
            <div>
              <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); }}>
                No
              </Button>
              <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); deleteNov(); }}>
                Si
              </Button>
            </div>

          </Alert>
        )}
        {alertaError && (
          <Alert className="alertMui " onClose={() => { setAlertaError(false); }} severity="error">
            {mensajeError.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Alert>
        )}
        {alertaOK && (
          <Alert className="alertMui " onClose={() => { setAlertaOK(false); window.location.reload(); }} severity="success">
            {mensajeOK.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Alert>
        )}
        <TableContainer component={Paper} className="container-fluid">
          <Table aria-label="collapsible table " className=" my-2 col-6">
            <TableHead >
              <TableRow className="tablaList">
                <TableCell className="col-lg-2 col-md-2 col-sm-12" />
                <TableCell className="col-lg-2 col-md-2 col-sm-12" sx={{ color: grey[50] }} align="center"> Titulo en Español </TableCell>
                <TableCell className="col-lg-2 col-md-2 col-sm-12" sx={{ color: grey[50] }} align="center"> Titulo en Ingles</TableCell>
                <TableCell className="col-lg-2 col-md-2 col-sm-12" sx={{ color: grey[50] }} align="center"> Titulo en Japones</TableCell>
                <TableCell className="col-lg-2 col-md-2 col-sm-12" sx={{ color: grey[50] }} align="center"> Capitulo Estrenado</TableCell>
                <TableCell className="col-lg-2 col-md-2 col-sm-12" sx={{ color: grey[50] }} align="center"> Enlace</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                datosNovelasValidadas.map((option, index) => (
                  <Row className="" key={index} row={option} />
                ))

              }

            </TableBody>
          </Table>
        </TableContainer >
      </>
    );


  }
  else if (location.state.prop4 == "pel") {

    /////////////////////Peliculas

    function eliminarPel(oEvento) {
      if (location.state.prop4 == "pel") {
        let oE = oEvento || window.event;
        let lista;

        if (oE.target.id == "") {
          lista = oE.target.parentNode;
        }
        else {
          lista = oE.target;
        }
        setIdPelBorrar(lista.dataset.key);
        setAlertaConfirmacion(true);
        window.scrollTo(0, 0);
      }
    }
    async function deletePel() {

      if (location.state.prop4 == "pel") {
        let idUpVe = new FormData();
        idUpVe.append("idPelicula", idPelBorrar);
        idUpVe.append("adm", datosUsuario.adm);

        let response = await fetch(`php/proyectoFinal/Pelicula/eliminarPelicula.php`, {
          body: idUpVe,
          method: 'POST'
        });

        let respuesta = await response.json();
        if (response.ok) {
          if (respuesta.error) {
            setMensajeError(respuesta.datos);
            setAlertaError(true);
            window.scrollTo(0, 0);
          }
          else {
            setMensajeOK(respuesta.datos);
            setAlertaOK(true);
            window.scrollTo(0, 0);
          }

        }
      }

    }


    async function modificarPel(oEvento) {
      let oE = oEvento || window.event;
      let lista;

      if (oE.target.id == "") {
        lista = oE.target.parentNode;
      }
      else {
        lista = oE.target;
      }

      let elem = document.querySelectorAll('[data-key="' + lista.dataset.key + '"]')

      let titulo = elem["0"].firstChild.firstChild.value;
      let tituloEn = elem["1"].firstChild.firstChild.value;
      let fotoBD = document.getElementById("fotoVerd");
      let limTamano = document.getElementById("limTamano");

      let fechaTemp = elem["2"].firstChild.lastChild.firstChild.value.split("/");
      let fechaVerdadera = fechaTemp[2].trim() + "-" + fechaTemp[0].trim() + "-" + fechaTemp[1].trim();

      let idUpVe = new FormData();
      idUpVe.append("idPeli", lista.dataset.key);
      idUpVe.append("titulo", titulo);
      idUpVe.append("tituloEN", tituloEn);
      idUpVe.append("fecha", fechaVerdadera);
      idUpVe.append("foto", fotoBD.files[0]);
      idUpVe.append("limTam", limTamano.value);


      let response = await fetch(`php/proyectoFinal/Pelicula/modificarPeliculasValidadas.php`, {
        body: idUpVe,
        method: 'POST'
      });

      let respuesta = await response.json();
      if (response.ok) {
        if (respuesta.error) {
          setMensajeError(respuesta.datos);
          setAlertaError(true);
          window.scrollTo(0, 0);
        }
        else {
          setMensajeOK(respuesta.datos);
          setAlertaOK(true);
          window.scrollTo(0, 0);
        }

      }
    }

    function Row(props) {
      const { row } = props;
      const [open, setOpen] = React.useState(false);

      return (
        <React.Fragment>
          <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
              {datosUsuario.adm == 1 && (
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              )}
            </TableCell>
            <TableCell align="center" component="th" scope="row" >{row.titulo}</TableCell>
            <TableCell align="center" >{row.tituloIngles}</TableCell>
            <TableCell align="center">{row.fechaEstreno}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Modificar/Eliminar la pelicula
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow className="col-12">
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Nuevo titulo</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Nuevo titutlo en Ingles</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Nueva fecha</TableCell>
                        <TableCell className="col-lg-6 col-md-2  col-sm-12" align="center">Nueva foto</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Editar</TableCell>
                        <TableCell className="col-lg-2 col-md-2  col-sm-12" align="center">Eliminar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        <TableRow key={"1"}>
                          <TableCell align="center" component="th" scope="row">
                            <TextField className="col-12" id="titulo" data-key={row.idPelicula} placeholder="titulo" name="titulo" ></TextField>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <TextField className="col-12" id="tituloEn" data-key={row.idPelicula} placeholder="tituloIngles" name="tituloEn" ></TextField>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <div id="fecha" data-key={row.idPelicula} className="row my-1 col-12" >
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Fecha de estreno" placeholder="fecha" id="fechaPel" name="fecha" defaultValue={dayjs("1235-00-0")} />
                              </LocalizationProvider>
                            </div>
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <Input className="col-lg-12 col-md-12 col-sm-12" type="file" name="foto" id="fotoVerd" />
                            <input type="hidden" name="lim_tamano" value="100000" id="limTamano" />
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <EditIcon id="btnEditar" data-key={row.idPelicula} onClick={() => { modificarPel() }} />
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            <DeleteIcon id="btnEliminar" data-key={row.idPelicula} onClick={() => { eliminarPel() }} />
                          </TableCell>
                        </TableRow>

                      }
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    }


    return (
      <>
        <MiNavBar datos={datosUsuario} />

        {alertaConfirmacion && (
          <Alert className="alertMui " onClose={() => { setAlertaConfirmacion(false); }} severity="info">
            {
              "¿Deseas eliminar la pelicula?"
            }
            <div>
              <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); }}>
                No
              </Button>
              <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); deletePel(); }}>
                Si
              </Button>
            </div>

          </Alert>
        )}

        {alertaError && (
          <Alert className="alertMui " onClose={() => { setAlertaError(false); }} severity="error">
            {mensajeError.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Alert>
        )}
        {alertaOK && (
          <Alert className="alertMui " onClose={() => { setAlertaOK(false); window.location.reload(); }} severity="success">
            {mensajeOK.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </Alert>
        )}
        <TableContainer component={Paper} className="container-fluid">
          <Table aria-label="collapsible table " className=" my-2 col-6">
            <TableHead >
              <TableRow className="tablaList">
                <TableCell className="col-lg-2 col-md-2  col-sm-12" />
                <TableCell className="col-lg-2 col-md-2  col-sm-12" sx={{ color: grey[50] }} align="center"> Titulo </TableCell>
                <TableCell className="col-lg-2 col-md-2  col-sm-12" sx={{ color: grey[50] }} align="center"> Titulo en Ingles</TableCell>
                <TableCell className="col-lg-2 col-md-2  col-sm-12" sx={{ color: grey[50] }} align="center"> Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                datosPeliculasValidadas.map((option, index) => (
                  <Row className="" key={index} row={option} />
                ))

              }

            </TableBody>
          </Table>
        </TableContainer >
      </>
    );
  }
}