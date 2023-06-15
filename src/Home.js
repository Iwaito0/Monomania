import MiNavBar from "./MiNavBar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box, IconButton, Typography, TextField, Input,
    FormControl, InputLabel, OutlinedInput, InputAdornment, Alert, Button
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AvatarIMGPrinci from "./AvatarIMGPrinci";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';


export default function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const datosUsuario = { id: location.state.prop1, nombre: location.state.prop2, adm: location.state.prop3 };
    const [datosUsuarioBD, setDatosUsuarioBD] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [alertaError, setAlertaError] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const [mensajeOK, setMensajeOK] = useState("");
    const [alertaOK, setAlertaOK] = useState(false);
    const [alertaConfirmacion, setAlertaConfirmacion] = useState(false);
    const [visionBloqueEditar, setVisionBloqueEditar] = useState("none");
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [datosModUsu, setDatosModUsu] = useState([]);
    const [fecha, setFecha] = useState(null);

    let nuevaFecha;
    // console.log(datosUsuario)

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const nuevosDatos = { ...datosModUsu, [name]: value };

        setDatosModUsu(nuevosDatos);
    }

    useEffect(() => {

        async function fetchDatosUsuario() {


            let idUsuario = new FormData();
            idUsuario.append("idUsuario", location.state.prop1);

            let response = await fetch(`php/proyectoFinal/Usuario/getDatosUsuario.php`, {
                body: idUsuario,
                method: 'POST'
            });

            if (response.ok) {

                let respuesta = await response.json();
                setDatosUsuarioBD(respuesta);
            }
        }

        fetchDatosUsuario();

    }, [])

    //console.log(datosUsuarioBD)

    function modificarFecha() {
        let arrayFecha = datosUsuarioBD[0]["Fecha"].split("-");
        let dia = arrayFecha[2].slice(0, 2);

        nuevaFecha = dia + "-" + arrayFecha[1] + "-" + arrayFecha[0];

    }
    function btnEdicion() {
        setVisionBloqueEditar("none");
    }

    async function editarUsuario() {
        //console.log(datosModUsu);
        /*console.log(fecha);*/
        var sMensaje = "";


        if (!/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(datosModUsu["nombre"])) {
            sMensaje += "El nombre introducido solo puede llevar letras y no puede estar vacio\n";
            document.getElementById("nmbDB").parentNode.parentNode.classList.add("error");
        }
        else {
            document.getElementById("nmbDB").parentNode.parentNode.classList.remove("error");
        }
        if (!/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(datosModUsu["apellidos"])) {
            sMensaje += "El apellido introducido solo puede llevar letras y no puede estar vacio \n";
            document.getElementById("apllDB").parentNode.parentNode.classList.add("error");
        }
        else {
            document.getElementById("apllDB").parentNode.parentNode.classList.remove("error");
        }
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(datosModUsu["nombreUsuario"])) {
            sMensaje += "El nombre del ususario solo puede empezar con letras y no puede estar vacio \n";
            document.getElementById("nbrUsuDB").parentNode.parentNode.classList.add("error");
        }
        else {
            document.getElementById("nbrUsuDB").parentNode.parentNode.classList.remove("error");
        }


        if ((datosModUsu["correElectronico"] != undefined || datosModUsu["correElectronico"] != "") && !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(datosModUsu["correElectronico"])) {
            if (datosModUsu["correElectronico"] == undefined) {
                document.getElementById("crrlDB").parentNode.parentNode.classList.remove("error");
            }
            else if (datosModUsu["correElectronico"] == "") {
                document.getElementById("crrlDB").parentNode.parentNode.classList.remove("error");
            }
            else {
                sMensaje += "El campo email esta mal\n";
                document.getElementById("crrlDB").parentNode.parentNode.classList.add("error");
            }

        }
        else {
            document.getElementById("crrlDB").parentNode.parentNode.classList.remove("error");
        }
        if (!/[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*/.test(datosModUsu["password"])) {
            sMensaje += "El contraseña introducida esta en un formato no valido\n";
            document.getElementById("password").parentNode.parentNode.classList.add("error");
        }
        else {
            document.getElementById("password").parentNode.parentNode.classList.remove("error");
        }

        let fechaUsuario
        if (fecha !== null) {
            let fechaActual = new Date(Date.now());


            let fechaSistema = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate())
            fechaUsuario = new Date(fecha["$y"], fecha["$M"], fecha["$D"])


            if (fechaUsuario > fechaSistema) {
                sMensaje += "La fecha no puede ser posterior a la actual\n";
                document.getElementById("fecha").parentNode.classList.add("error");
            }
            else {
                document.getElementById("fecha").parentNode.classList.remove("error");
            }

        }
        if (sMensaje !== "") {
            setMensajeError(sMensaje);
            setAlertaError(true);
            window.scrollTo(0, 0);
        }
        else {

            let datosUsuarioActualizar = new FormData();
            datosUsuarioActualizar.append("id", location.state.prop1);
            datosUsuarioActualizar.append("nombre", datosModUsu["nombre"]);
            datosUsuarioActualizar.append("apellidos", datosModUsu["apellidos"]);
            datosUsuarioActualizar.append("usuario", datosModUsu["nombreUsuario"]);
            datosUsuarioActualizar.append("correo", datosModUsu["correElectronico"]);
            datosUsuarioActualizar.append("contr", datosModUsu["password"]);

            if (fecha != null) {
                let dia = fechaUsuario.getDate();
                let mes = fechaUsuario.getMonth() + 1;
                let anio = fechaUsuario.getFullYear();

                let fechaSubirBD = anio + "-" + mes + "-" + dia;

                datosUsuarioActualizar.append("fecha", fechaSubirBD);
            }

            let fotoBD = document.getElementById("fotoVerd");
            let limTamano = document.getElementById("limTamano");

            datosUsuarioActualizar.append("foto", fotoBD.files[0]);
            datosUsuarioActualizar.append("limTam", limTamano.value);

            let response = await fetch(`php/proyectoFinal/Usuario/modificarUsuario.php`, {
                body: datosUsuarioActualizar,
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
    function eliminarUsuario() {
        setAlertaConfirmacion(true);
    }

    function noDeleteUser() {
        setMensajeOK("Se ha cancelado el borrado del usuario");
        setAlertaOK(true);
    }
    async function deleteUsuario() {

        let datosUsuarioEliminar = new FormData();
        datosUsuarioEliminar.append("id", location.state.prop1);

        let response = await fetch(`php/proyectoFinal/Usuario/eliminarUsuario.php`, {
            body: datosUsuarioEliminar,
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
                navigate('/');
            }
        }

    }


    //mx-2 de abajo solucio problema de la barra de desplazamiento
    return (
        <>
            <MiNavBar datos={datosUsuario} />
            {alertaError && (
                <Alert className="alertMui " onClose={() => { setAlertaError(false) }} severity="error">
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
                        "¿Deseas eliminar el usuario? (Se eleminara todas las peliculas y novelas del usuario)"
                    }
                    <div>
                        <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); noDeleteUser() }}>
                            No
                        </Button>
                        <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); deleteUsuario() }}>
                            Si
                        </Button>
                    </div>

                </Alert>
            )}
            <Box className="row d-flex mt-2 mx-2 justify-content-center">
                <Box className="row col-lg-4 col-md-4 col-sm-4">
                    <Box className="col-lg-12 col-md-12 col-sm-12">
                        <AvatarIMGPrinci rutaAPI={"php/proyectoFinal/Usuario/verFotoUsuario.php?n=" + location.state.prop1} />
                    </Box>
                    <Box className="col-lg-8 col-md-8 col-sm-8" id="bloqueEditarFile" display={visionBloqueEditar}>
                        <Box variant="h5" component="div" className='my-2'>
                            <div className="row my-1">
                                <h4 className="col-lg-12 col-md-12 col-sm-12 enlacesRes" >Selecione una foto</h4>
                                <Input className="col-lg-12 col-md-12 col-sm-12" type="file" name="foto" id="fotoVerd" />
                                <input type="hidden" name="lim_tamano" value="100000" id="limTamano" />
                            </div>
                        </Box>
                    </Box>
                </Box>
                <Box className="row col-lg-8 col-md-8 col-sm-8">
                    {datosUsuarioBD.length !== 0 && (
                        <>
                            {modificarFecha()}

                            <Box className="row col-lg-12 col-md-12 col-sm-12">
                                <Box className="row col-lg-12 col-md-12 col-sm-12">
                                    <Box className="col-lg-8 col-md-8 col-sm-8 mt-2">
                                        <h2>Bienvenido {datosUsuarioBD[0]["nombreUsuario"]}</h2>
                                    </Box>
                                    <Box className="col-lg-4 col-md-4 col-sm-4 mt-2">
                                        {visionBloqueEditar != "block" && (
                                            <>
                                                <EditIcon fontSize="large" className="mx-2" id={location.state.prop1} data-key={location.state.prop1} onClick={() => { setVisionBloqueEditar("block") }} />

                                                {location.state.prop3 != 1 && (

                                                    <DeleteIcon fontSize="large" className="mx-2 " id={location.state.prop1} data-key={location.state.prop1} onClick={() => { eliminarUsuario(); window.scrollTo(0, 0); }} />

                                                )}

                                            </>
                                        )}
                                        {visionBloqueEditar != "none" && (
                                            <>
                                                <UndoIcon fontSize="large" className="mx-2" onClick={() => { setVisionBloqueEditar("none") }} />
                                            </>
                                        )}
                                    </Box>

                                </Box>

                                <Box className="row col-lg-12 col-md-12 col-sm-12 ">

                                    <Box className="row  col-lg-5 col-md-5 col-sm-5 mx-1">
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1 " id="tituloMi">

                                                <Typography variant="h5" gutterBottom>Mis datos:</Typography>

                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1 " id="nombreMi">

                                                <Typography variant="h6" className="my-2" >
                                                    Nombre: {datosUsuarioBD[0]["nombre"]}
                                                </Typography>

                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1 " id="apellidoMi">

                                                <Typography variant="h6" className="my-2" >
                                                    Apellidos: {datosUsuarioBD[0]["apellidos"]}
                                                </Typography>

                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1 " id="usuarioMi">

                                                <Typography variant="h6" className="my-2" >
                                                    Usuario: {datosUsuarioBD[0]["nombreUsuario"]}
                                                </Typography>

                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1 " id="correoMi">

                                                <Typography variant="h6" className="my-2" >
                                                    Correo: {datosUsuarioBD[0]["correElectronico"]}
                                                </Typography>

                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1" id="passMi">

                                                <Typography variant="h6" className="my-2" >
                                                    Password: **************
                                                </Typography>

                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div id="fechaMi" className="row my-1 perso" >
                                                <Typography variant="h6" className="my-2" >
                                                    Cumpleaños: {nuevaFecha}
                                                </Typography>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2' display={visionBloqueEditar}>
                                            <div id="btnEditar" className="row my-1 perso" >
                                                <button onClick={btnEdicion} id="cancelarEdicion" data-keyid={location.state.prop1} className="btn btn-danger mt-2 col-12">Cancelar edicion</button>
                                            </div>
                                        </Box>
                                    </Box>

                                    <Box className="row  col-lg-5 col-sm-5 mx-1" id="bloqueEditar" >
                                        <Box variant="h5" component="div" className='my-2' display={visionBloqueEditar}>
                                            <div className="row my-1 " id="titulo">
                                                <Typography variant="h5" gutterBottom>Nuevo datos:</Typography>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2' display={visionBloqueEditar}>
                                            <div className="row my-1 " id="titulo">
                                                <TextField id="nmbDB" label="Nombre" variant="outlined" name="nombre" onChange={handleChange}>

                                                </TextField>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2' display={visionBloqueEditar}>
                                            <div className="row my-1 " id="titulo">
                                                <TextField id="apllDB" label="Apellidos" variant="outlined" name="apellidos" onChange={handleChange}>

                                                </TextField>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2' display={visionBloqueEditar}>
                                            <div className="row my-1 " id="titulo">
                                                <TextField id="nbrUsuDB" label="Nombre usuario" variant="outlined" name="nombreUsuario" onChange={handleChange}>

                                                </TextField>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2' display={visionBloqueEditar}>
                                            <div className="row my-1 " id="titulo">
                                                <TextField id="crrlDB" label="Correo Electronico" variant="outlined" name="correElectronico" onChange={handleChange}>

                                                </TextField>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='mt-3' display={visionBloqueEditar}>
                                            <div className="row mt-1">
                                                <FormControl variant="outlined">
                                                    <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                                                    <OutlinedInput
                                                        id="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={handleClickShowPassword}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                    edge="end"
                                                                >
                                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        label="password" name="password"
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-3' display={visionBloqueEditar}>
                                            <div id="fecha" className="row my-1 perso" >
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker label="Cumpleaños" name="cumple" defaultValue={dayjs(nuevaFecha)} onChange={(newValue) => setFecha(newValue)} />
                                                </LocalizationProvider>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-3' display={visionBloqueEditar}>
                                            <div id="btnEditar" className="row my-1 perso" >
                                                <button onClick={editarUsuario} id="V" data-keyid={location.state.prop1} className="btn btn-success col-12">Editar usuario</button>
                                            </div>
                                        </Box>

                                    </Box>
                                </Box>

                            </Box>
                        </>
                    )}
                </Box>
            </Box >
        </>
    );
}