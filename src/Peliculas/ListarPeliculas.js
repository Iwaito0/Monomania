import MiNavBar from "../MiNavBar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Card, CardMedia, CardContent, Typography, Input, Box, TextField, FormControlLabel, Checkbox, InputLabel,
    FormControl, FormLabel, FormGroup, Alert, Button, Select, Options
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { green, red } from '@mui/material/colors';
import TarjetaImagen from '../TarjetaImagen';


export default function Peliculas() {
    const location = useLocation();
    const datosUsuario = { id: location.state.prop1, nombre: location.state.prop2, adm: location.state.prop3 };
    const [datosPeliculasUsuario, setDatosPeliculasUsuario] = useState([]);
    const [datosCategoriaBD, setDatosCategoriaBD] = useState([]);
    const [idPeliculaIdCategoria, setIdPeliculaIdCategoria] = useState([]);
    const [editCards, setEditCards] = useState(true);
    const [vista, setVista] = useState();
    const [mensajeError, setMensajeError] = useState("");
    const [alertaError, setAlertaError] = useState(false);
    const [mensajeOK, setMensajeOK] = useState("");
    const [alertaOK, setAlertaOK] = useState(false);
    const [alertaConfirmacion, setAlertaConfirmacion] = useState(false);
    let color = "";
    const [numTemp, setNumTemp] = useState(-1);
    const [numIdAnt, setNumIdAnt] = useState(-1);
    const [pelDelete, setPelDelete] = useState(-1);
    const [datosRegPel, setDatosRegPel] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [fecha, setFecha] = useState(null);
    const [nDatosTarjetaCargar, setNDatosTarjetaCargar] = useState(8);

    //console.log(datosUsuario);
    //console.log(datosPeliculasUsuario);


    window.addEventListener('scroll', function () {
        let alturaScroll = this.document.documentElement.scrollHeight - this.document.documentElement.clientHeight;

        if (this.window.scrollY === alturaScroll) {
            setNDatosTarjetaCargar(nDatosTarjetaCargar + nDatosTarjetaCargar);
        }
    })



    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const nuevosDatos = { ...datosRegPel, [name]: value };

        setDatosRegPel(nuevosDatos);
    }

    const handleChange2 = (event) => {
        const categoriaId = event.target.name.slice(3); // Obtener el ID de la categoría desde el nombre del checkbox
        if (event.target.checked) {
            // Si se selecciona el checkbox, agregar el ID de la categoría al array de categorías seleccionadas
            setCategoriasSeleccionadas([...categoriasSeleccionadas, categoriaId]);
        } else {
            // Si se deselecciona el checkbox, filtrar el ID de la categoría del array de categorías seleccionadas
            setCategoriasSeleccionadas(categoriasSeleccionadas.filter((id) => id !== categoriaId));
        }
    };

    const handleChangeVista = (event) => {
        if (event.target.checked) {
            // Si se selecciona el checkbox, agregar el ID de la categoría al array de categorías seleccionadas
            setVista(true);
        } else {
            // Si se deselecciona el checkbox, filtrar el ID de la categoría del array de categorías seleccionadas
            setVista(false);
        }
    };


    useEffect(() => {

        async function getPeliculasUsuario() {

            let datosPel = new FormData();
            datosPel.append("idUsuario", datosUsuario.id);
            datosPel.append("adm", datosUsuario.adm);
            datosPel.append("nTarjetas", nDatosTarjetaCargar);

            let response = await fetch(`php/proyectoFinal/Pelicula/getTodasPeliculasUsuario.php`, {
                body: datosPel,
                method: 'POST'
            });

            if (response.ok) {
                let respuesta = await response.json();
                setDatosPeliculasUsuario(respuesta);
            }
        }
        getPeliculasUsuario();

    }, [nDatosTarjetaCargar]); /*<---- """""warning"""""" */

    useEffect(() => {

        async function getDatosCategoriaBD() {

            let response = await fetch("php/proyectoFinal/Categoria/getCategoria.php",
                {
                    method: 'GET'
                });

            if (response.ok) {
                let respuesta = await response.json();
                setDatosCategoriaBD(respuesta);

            }

        }

        getDatosCategoriaBD();

    }, []);

    useEffect(() => {

        async function getCatPel() {

            let tablaIdPelicula = [];
            datosPeliculasUsuario.forEach(function (valor, indice, array) {
                tablaIdPelicula.push(valor["idPelicula"]);
            });

            if (!tablaIdPelicula.length == 0) {

                let datosPelCat = new FormData();
                datosPelCat.append("arrayIds", tablaIdPelicula);

                let response = await fetch("php/proyectoFinal/Pelicula/getCategoriaPel.php",
                    {
                        body: datosPelCat,
                        method: 'POST'
                    });

                if (response.ok) {
                    let respuesta = await response.json();
                    setIdPeliculaIdCategoria(respuesta)
                }
            }

        }
        getCatPel();


    }, [datosPeliculasUsuario]);

    function establecerColor(num) {
        if (num === 0) {
            color = "2px solid yellow";
        }
        else if (num === 1) {
            color = "2px solid green";
        }
        else {
            color = "2px solid red";
        }
    }

    function eliminarPel(oEvento) {

        let oE = oEvento || window.event;
        let idTarjeta;

        if (oE.target.id == "") {
            idTarjeta = oE.target.parentNode.id;
        }
        else {
            idTarjeta = oE.target.id;
        }
        setPelDelete(idTarjeta)
        setAlertaConfirmacion(true);

    }

    async function deletePel() {
        //falta ADM
        let idDelete = new FormData();
        idDelete.append("idPelicula", pelDelete);
        idDelete.append("idUsuario", datosUsuario.id);
        idDelete.append("adm", datosUsuario.adm);

        let response = await fetch(`php/proyectoFinal/Pelicula/eliminarPelicula.php`, {
            body: idDelete,
            method: 'POST'
        });

        let respuesta = await response.json();
        if (response.ok) {
            if (respuesta.error) {
                setMensajeError(respuesta.datos);
                setAlertaError(true);
            }
            else {
                setMensajeOK(respuesta.datos);
                setAlertaOK(true);
            }
        }
    }
    function noDeletePel() {
        setMensajeOK("Se ha cancelado el borrado de la pelicula");
        setAlertaOK(true);
    }

    function editarPelicula(oEvento) {
        let oE = oEvento || window.event;
        let tarjeta;

        if (oE.target.id == "") {
            tarjeta = oE.target.parentNode;
            setNumIdAnt(oE.target.parentNode.id);
        }
        else {
            tarjeta = oE.target;
            setNumIdAnt(oE.target.id);
        }
        tarjeta = tarjeta.parentNode.parentNode.parentNode;
        setNumTemp(tarjeta.id);

        if (tarjeta.dataset.key != 1 && datosUsuario.id != 1) {
            tarjeta.querySelectorAll("#placeHolderBlack")[0].removeAttribute('disabled');
            tarjeta.querySelectorAll("#placeHolderBlack")[0].classList.remove("Mui-disabled");
            tarjeta.querySelectorAll("#placeHolderBlack")[0].parentNode.classList.remove("Mui-disabled");

            tarjeta.querySelectorAll("#placeHolderBlack")[1].removeAttribute('disabled');
            tarjeta.querySelectorAll("#placeHolderBlack")[1].classList.remove("Mui-disabled");
            tarjeta.querySelectorAll("#placeHolderBlack")[1].parentNode.classList.remove("Mui-disabled");

            tarjeta.querySelector(".perso").childNodes[0].lastChild.firstChild.removeAttribute('disabled');
            tarjeta.querySelector(".perso").childNodes[0].lastChild.firstChild.classList.remove("Mui-disabled");
            tarjeta.querySelector(".perso").childNodes[0].lastChild.classList.remove("Mui-disabled");
        }
        setEditCards(false)

    }
    function cancelarEdicion(oEvento) {
        setEditCards(true);
        setNumTemp(-1);

        let oE = oEvento || window.event;
        let tarjeta = oE.target.parentNode.parentNode.parentNode.parentNode;

        tarjeta.querySelectorAll("#placeHolderBlack")[0].setAttribute('disabled', true);
        tarjeta.querySelectorAll("#placeHolderBlack")[0].classList.add("Mui-disabled");
        tarjeta.querySelectorAll("#placeHolderBlack")[0].parentNode.classList.add("Mui-disabled");

        tarjeta.querySelectorAll("#placeHolderBlack")[1].setAttribute('disabled', true);
        tarjeta.querySelectorAll("#placeHolderBlack")[1].classList.add("Mui-disabled");
        tarjeta.querySelectorAll("#placeHolderBlack")[1].parentNode.classList.add("Mui-disabled");

        tarjeta.querySelector(".perso").childNodes[0].lastChild.firstChild.setAttribute('disabled', true);
        tarjeta.querySelector(".perso").childNodes[0].lastChild.firstChild.classList.add("Mui-disabled");
        tarjeta.querySelector(".perso").childNodes[0].lastChild.classList.add("Mui-disabled");
    }
    function cancelarAnterior() {

        let tarjetaAnt;
        if (numIdAnt != -1) {
            tarjetaAnt = document.getElementById(numIdAnt);

            if (tarjetaAnt == null) {
                tarjetaAnt = document.parentNode;

            }
            tarjetaAnt.querySelectorAll("#placeHolderBlack")[0].setAttribute('disabled', true);
            tarjetaAnt.querySelectorAll("#placeHolderBlack")[0].classList.add("Mui-disabled");
            tarjetaAnt.querySelectorAll("#placeHolderBlack")[0].parentNode.classList.add("Mui-disabled");

            tarjetaAnt.querySelectorAll("#placeHolderBlack")[1].setAttribute('disabled', true);
            tarjetaAnt.querySelectorAll("#placeHolderBlack")[1].classList.add("Mui-disabled");
            tarjetaAnt.querySelectorAll("#placeHolderBlack")[1].parentNode.classList.add("Mui-disabled");

            tarjetaAnt.querySelector(".perso").childNodes[0].lastChild.firstChild.setAttribute('disabled', true);
            tarjetaAnt.querySelector(".perso").childNodes[0].lastChild.firstChild.classList.add("Mui-disabled");
            tarjetaAnt.querySelector(".perso").childNodes[0].lastChild.classList.add("Mui-disabled");
        }


    }

    async function editarTarjeta(oEvento) {

        if (datosUsuario.adm == 1) {
            let oE = oEvento || window.event;

            let id = oE.target.id;
            let idUpdate = new FormData();


            idUpdate.append("adm", datosUsuario.adm);
            idUpdate.append("idPeliculaADM", oE.target.dataset.keyid);

            if (id == "NV") {

                idUpdate.append("validacion", -1);
            }
            else {
                idUpdate.append("validacion", 1);
            }

            let response = await fetch(`php/proyectoFinal/Pelicula/modificarPeliculas.php`, {
                body: idUpdate,
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
        else {

            let oE = oEvento || window.event;
            let id = oE.target.id;
            let subid = id.slice(3);

            let idUpdate = new FormData();


            idUpdate.append("titulo", datosRegPel['titulo']);
            idUpdate.append("tituloEN", datosRegPel['tituloEn']);
            idUpdate.append("idPelicula", subid);
            idUpdate.append("categ", categoriasSeleccionadas);
            idUpdate.append("vista", vista);
            idUpdate.append("idUsuario", datosUsuario.id);
            idUpdate.append("adm", datosUsuario.adm);

            if (fecha != null) {
                let dia = fecha["$D"];
                let mes = fecha["$M"] + 1;
                let ano = fecha["$y"];
                let fechaForm = ano + "-" + mes + "-" + dia;
                idUpdate.append("fecha", fechaForm);
            }

            let fotoBD = document.getElementById("fotoVerd");
            let limTamano = document.getElementById("limTamano");

            idUpdate.append("foto", fotoBD.files[0]);
            idUpdate.append("limTam", limTamano.value);

            let response = await fetch(`php/proyectoFinal/Pelicula/modificarPeliculas.php`, {
                body: idUpdate,
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
                    cancelarEdicion(oEvento);
                    setMensajeOK(respuesta.datos);
                    setAlertaOK(true);
                    window.scrollTo(0, 0);
                }
            }
        }
    }
    function cancelarValidacion() {
        setEditCards(true);
    }
    function convertiraPDF(){

        let d=datosUsuario.id+""+datosUsuario.adm;

        window.open('php/proyectoFinal/Pelicula/convertirPDFPeliculas.php?n='+datosUsuario.id+"&p="+datosUsuario.adm, '_blank');
           
        
    }


    return (
        <>
            <MiNavBar datos={datosUsuario} />
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
            {alertaConfirmacion && (
                <Alert className="alertMui " onClose={() => { setAlertaConfirmacion(false); }} severity="info">
                    {
                        "¿Deseas eliminar la pelicula?"
                    }
                    <div>
                        <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); noDeletePel() }}>
                            No
                        </Button>
                        <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); deletePel() }}>
                            Si
                        </Button>
                    </div>

                </Alert>
            )}


            <Box variant="h5" component="div" className='col-lg-12'>
                <div className=" d-flex flex-row-reverse fondoTarjeta  " id="bloqueIcon">
                    <svg  xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-earmark-pdf-fill iconoPDF" viewBox="0 0 16 16" onClick={convertiraPDF}>
                        <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z" />
                        <path fillRule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z" />
                    </svg>
                </div>
            </Box>
            <div className="row d-flex mx-0 justify-content-center fondoTarjeta">
                {datosPeliculasUsuario.map((option, index) => (

                    <React.Fragment key={index}>

                        {option.validado == 0 && (
                            establecerColor(0)

                        )}
                        {option.validado == 1 && (
                            establecerColor(1)

                        )}
                        {option.validado == -1 && (
                            establecerColor(-1)
                        )}


                        <Card id={option.idPelicula} data-key={option.validado} style={{ border: color }} className="col-lg-2 col-md-2 col-sm-1 tarjetas" key={index} >

                            <Box variant="h5" component="div" className='my-2'>
                                <div className="my-1 d-flex flex-row-reverse  " id="bloqueIcon">
                                    {datosUsuario.adm != 1 && (
                                        <DeleteIcon id={option.idPelicula} data-key={option.idPelicula} onClick={() => { eliminarPel(); window.scrollTo(0, 0); }} />
                                    )}
                                    <EditIcon id={option.idPelicula} data-key={option.idPelicula} onClick={() => { cancelarAnterior(); editarPelicula() }} />
                                </div>
                            </Box>

                            <TarjetaImagen rutaAPI={"php/proyectoFinal/Pelicula/verFotoPelicula.php?n=" + option.idPelicula+"&p="+datosUsuario.id } />

                            <CardContent>
                                <Box variant="h5" component="div" className='my-2'>
                                    <div className="row my-1 " id="titulo">
                                        <TextField id="placeHolderBlack" placeholder={option.titulo} name="titulo" onChange={handleChange} data-titulo={option.titulo} disabled>
                                            {option.titulo}
                                        </TextField>
                                    </div>
                                </Box>
                                <Box variant="h5" component="div" className='my-2'>
                                    <div className="row my-1  " id="tituloEN">
                                        <TextField id="placeHolderBlack" placeholder={option.tituloIngles} name="tituloEn" onChange={handleChange} data-tituloalt={option.tituloIngles} disabled >
                                            {option.tituloIngles}
                                        </TextField>
                                    </div>
                                </Box>
                                <Box variant="h5" component="div" className='my-3'>
                                    <div id="fecha" className="row my-1 perso" >
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker label="Fecha de estreno" name="cumple" defaultValue={dayjs(option.fechaEstreno)} onChange={(newValue) => setFecha(newValue)} data-fecha={option.fechaEstreno} disabled />
                                        </LocalizationProvider>
                                    </div>
                                </Box>
                                <Box variant="h5" component="div" className='my-2'>
                                    <div className="my-1  " id="tituloEN">
                                        {!editCards && numTemp == option.idPelicula && datosUsuario.adm == 0 && (
                                            <FormControlLabel control={<Checkbox />} label="¿Pelicula vista?" name="vista" onChange={handleChangeVista} />
                                        )}
                                        {!editCards && numTemp != option.idPelicula && (
                                            <>
                                                {option.PeliculaVista == 0 && (
                                                    <div className="row">
                                                        <InputLabel className="col labelIcono" id="category-select-label" >Pelicula Vista</InputLabel>
                                                        <CloseIcon className="col icono " sx={{ color: red[500] }} />
                                                    </div>
                                                )}
                                                {option.PeliculaVista == 1 && (
                                                    <div className="row">
                                                        <InputLabel className="col labelIcono" id="category-select-label" >Pelicula Vista</InputLabel>
                                                        <DoneIcon className="col icono " sx={{ color: green[500] }} />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {editCards && (
                                            <>
                                                {option.PeliculaVista == 0 && (
                                                    <div className="row">
                                                        <InputLabel className="col labelIcono" id="category-select-label" >Pelicula Vista</InputLabel>
                                                        <CloseIcon className="col icono " sx={{ color: red[500] }} />
                                                    </div>
                                                )}
                                                {option.PeliculaVista == 1 && (
                                                    <div className="row">
                                                        <InputLabel className="col labelIcono" id="category-select-label" >Pelicula Vista</InputLabel>
                                                        <DoneIcon className="col icono " sx={{ color: green[500] }} />
                                                    </div>
                                                )}
                                            </>

                                        )}
                                    </div>
                                </Box>
                                {!editCards && numTemp == option.idPelicula && (
                                    <>
                                        {option.validado != 1 && datosUsuario.adm == 0 && (
                                            <Box variant="h5" component="div" className='mt-3'>
                                                <FormControl component="fieldset" variant="standard" >
                                                    <FormLabel component="legend">Elige la categoría que pertenezca a la película</FormLabel>
                                                    <FormGroup className="d-flex flex-row">
                                                        {
                                                            datosCategoriaBD.map((option, index) => (
                                                                <FormControlLabel key={index}
                                                                    control={<Checkbox onChange={handleChange2} name={"cat" + option.idCategoria} />}
                                                                    label={option.nombre}
                                                                />
                                                            ))
                                                        }
                                                    </FormGroup>
                                                </FormControl>
                                            </Box>
                                        )}

                                        {datosUsuario.adm == 0 && (
                                            <div>
                                                <Box variant="h5" component="div" className='my-2'>
                                                    <div className="row my-1">
                                                        <h5 className="col-6 enlacesRes" >Selecione una foto</h5>
                                                        <Input className="col-6" type="file" name="foto" id="fotoVerd" />
                                                        <input type="hidden" name="lim_tamano" value="100000" id="limTamano" />
                                                    </div>
                                                </Box>
                                                <Box variant="h5" component="div" className='my-2 '>
                                                    <div className="row ">
                                                        <button onClick={cancelarEdicion} className="btn btn-danger mx-2 mt-2 col-lg-5 col-md-12 col-sm-12">Cancelar</button>
                                                        <button onClick={editarTarjeta} id={"pel" + option.idPelicula} className="btn btn-primary mx-2 mt-2 col-lg-5 col-md-12 col-sm-12">Modificar</button>
                                                    </div>
                                                </Box>
                                            </div>
                                        )}
                                        {datosUsuario.adm == 1 && (
                                            <div className="row ">
                                                <button onClick={editarTarjeta} id="NV" data-keyid={option.idPelicula} className="btn btn-danger  ms-2 mt-2  col-lg-5 col-md-4 col-sm-12 ">NV</button>
                                                <button onClick={editarTarjeta} id="V" data-keyid={option.idPelicula} className="btn btn-success  ms-2 mt-2 col-lg-5 col-md-4  col-sm-12 ">V</button>
                                                <button onClick={cancelarValidacion} id="V" className="btn btn-danger mt-2 col-12">Cancelar</button>
                                            </div>

                                        )}

                                    </>
                                )}
                                {!editCards && numTemp != option.idPelicula && (

                                    <Box variant="h5" component="div" className=''>
                                        <FormLabel component="legend"> Categorias</FormLabel>
                                        {
                                            //console.log(Math.random()*(1000000-0)+100)
                                            datosCategoriaBD.map((option2, index2) => (
                                                idPeliculaIdCategoria.map((option3, index3) => (
                                                    <React.Fragment key={index2 + Math.random() * (1000000 - 0) + 100}>
                                                        {option.idPelicula == option3.idpelicula && (
                                                            <React.Fragment key={index3 + Math.random() * (1000000 - 0) + 100}>
                                                                {option3.idCategoria == option2.idCategoria && (
                                                                    option2.nombre + ", "
                                                                )}
                                                            </React.Fragment>
                                                        )}
                                                    </React.Fragment>

                                                ))
                                            ))
                                        }
                                    </Box>
                                )}

                                {editCards && (

                                    <Box variant="h5" component="div" className=''>
                                        <FormLabel component="legend"> Categorias</FormLabel>
                                        {
                                            //console.log(Math.random()*(1000000-0)+100)
                                            datosCategoriaBD.map((option2, index2) => (
                                                idPeliculaIdCategoria.map((option3, index3) => (
                                                    <React.Fragment key={index2 + Math.random() * (1000000 - 0) + 100}>
                                                        {option.idPelicula == option3.idpelicula && (
                                                            <React.Fragment key={index3 + Math.random() * (1000000 - 0) + 100}>
                                                                {option3.idCategoria == option2.idCategoria && (
                                                                    option2.nombre + ", "
                                                                )}
                                                            </React.Fragment>
                                                        )}
                                                    </React.Fragment>

                                                ))
                                            ))
                                        }
                                    </Box>
                                )}


                            </CardContent>
                        </Card>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
}
