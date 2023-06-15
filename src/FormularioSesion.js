import { useState } from 'react';
import * as React from 'react';
import {
    Card, CardContent, Box, TextField, InputLabel, OutlinedInput, InputAdornment,
    IconButton, FormControl, Input, Alert
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';



export default function FormularioSesion() {
    const [datos, setDatos] = useState([]);
    const [alertaError, setAlertaError] = useState(false);
    const [mensajeError, setMensajeError] = useState("");
    const [fecha, setFecha] = useState(null);
    const [registrar, setRegistrar] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [inicionSession, setInicionSession] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const navigate = useNavigate();

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const nuevosDatos = { ...datos, [name]: value };

        setDatos(nuevosDatos);
    }

    function inicioSession() {

        async function resReg() {

            let datosGrabar = new FormData();
            datosGrabar.append("usuario", datos.usuarioSesion);
            datosGrabar.append("password", datos.passwordSesion);

            let response = await fetch("php/proyectoFinal/Usuario/inicioSesion.php",
                {
                    body: datosGrabar,
                    method: 'POST'
                });

            let respuesta = await response.json();
            if (response.ok) {
                if (respuesta.datos[0] !== undefined) {
                    navigate('/home', {
                        state: {
                            prop1: respuesta.datos[0]["idUsuario"],
                            prop2: respuesta.datos[0]["nombreUsuario"],
                            prop3: respuesta.datos[0]["esAdmin"]

                        }
                    });
                }
                else {
                    setInicionSession(true)
                }

            }
        }


        resReg();

    }

    function registrarUsuario() {
        setDatos([])
        setRegistrar(true);
    }
    function cancelarBD() {
        setRegistrar(false);

    }

    function registrarBD() {


        async function registrarUsuarioBD() {
            var sMensaje = "";

            if (!/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(datos.nombre) || datos.nombre === undefined) {
                sMensaje += "El nombre introducido solo puede llevar letras y no puede estar vacio\n";
                document.getElementById("nombre").parentNode.parentNode.classList.add("error");
            }
            else {
                document.getElementById("nombre").parentNode.parentNode.classList.remove("error");
            }

            if (!/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(datos.apellidos) || datos.apellidos === undefined) {
                sMensaje += "Los apelLidos solo puede llevar letras y no puede estar vacio\n";
                document.getElementById("apellidos").parentNode.parentNode.classList.add("error");
            }
            else {
                document.getElementById("apellidos").parentNode.parentNode.classList.remove("error");
            }

            if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(datos.usuario) || datos.usuario === undefined) {
                sMensaje += "El usuario debe empezar por al menos una letra y no puede estar vacio\n";
                document.getElementById("usuario").parentNode.parentNode.classList.add("error");
            }
            else {
                document.getElementById("usuario").parentNode.parentNode.classList.remove("error");
            }

            if (!/[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?(( |\-)[a-zA-Z1-9À-ÖØ-öø-ÿ]+\.?)*/.test(datos.password) || datos.password === undefined) {
                sMensaje += "La contraseña no puede estar en blanco\n";
                document.getElementById("password").parentNode.parentNode.classList.add("error");
            }
            else {
                document.getElementById("password").parentNode.parentNode.classList.remove("error");
            }

            if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(datos.correo)) {
                sMensaje += "El campo email esta mal\n";
                document.getElementById("correo").parentNode.parentNode.classList.add("error");
            }
            else {
                document.getElementById("correo").parentNode.parentNode.classList.remove("error");
            }

            if (fecha === null) {
                sMensaje += "El campo fecha esta mal (Se debe actualizar el campo)\n";
                document.getElementById("fecha").parentNode.classList.add("error");
            }
            else {
                document.getElementById("fecha").parentNode.classList.remove("error");
            }

            if (fecha !== null) {
                let fechaActual = new Date(Date.now());
                let anio = fechaActual.getFullYear();
                let mes = fechaActual.getMonth() + 1;
                let dias = fechaActual.getDate();

                if (fecha["$y"] > anio) {
                    sMensaje += "El año no puede ser mayor que el actual\n";
                    document.getElementById("fecha").parentNode.classList.add("error");
                }
                else {
                    document.getElementById("fecha").parentNode.classList.remove("error");
                }

                let mesDatos = fecha["$M"] + 1;

                if (fecha["$y"] === anio && mesDatos > mes) {
                    sMensaje += "El mes no puede ser mayor que el actual\n";
                    document.getElementById("fecha").parentNode.classList.add("error");
                }
                else {
                    document.getElementById("fecha").parentNode.classList.remove("error");
                }

                if (fecha["$y"] === anio && mesDatos === mes && fecha["$D"] >= dias) {
                    sMensaje += "No puedes escoger ese dia\n";
                    document.getElementById("fecha").parentNode.classList.add("error");
                }
                else {
                    document.getElementById("fecha").parentNode.classList.remove("error");
                }

            }
            if (sMensaje !== "") {
                setMensajeError(sMensaje);
                setAlertaError(true);
            }
            else {
                let dia = fecha["$D"];
                let mes = fecha["$M"] + 1;
                let ano = fecha["$y"];

                let datosGrabar = new FormData();

                datosGrabar.append("nombre", datos.nombre);
                datosGrabar.append("apellidos", datos.apellidos);
                datosGrabar.append("usuario", datos.usuario);
                datosGrabar.append("password", datos.password);
                datosGrabar.append("correo", datos.correo);
                datosGrabar.append("fechaD", dia);
                datosGrabar.append("fechaM", mes);
                datosGrabar.append("fechaY", ano);

                let fotoBD = document.getElementById("fotoVerd");
                let limTamano = document.getElementById("limTamano");

                datosGrabar.append("foto", fotoBD.files[0]);
                datosGrabar.append("limTam", limTamano.value);

                let response = await fetch("php/proyectoFinal/Usuario/registrarUsuario.php",
                    {
                        body: datosGrabar,
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
                        setRegistrar(false);
                    }
                    
                }
            }

        }
        registrarUsuarioBD();

    }



    if (registrar === false) {
        return (
            <>

                {inicionSession && (

                    <Alert className="alertMui" onClose={() => { setInicionSession(false) }} severity="error">
                        El usuario o la contraseña no son correctas
                    </Alert>
                )}


                <div className='col-12  d-flex justify-content-center formularioIniReg'>
                    <div className="card" style={{ width: '25rem' }}>
                        <div className="card-body">
                            <h3 className="card-title text-center my-3">Inicio de sesión</h3>
                            <Card variant="outlined">
                                <React.Fragment>
                                    <CardContent className='tarjetaI'>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1">
                                                <TextField id="outlined-basic usuario" label="Usuario" variant="outlined" name="usuarioSesion" onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='mt-3'>
                                            <div className="row mt-1">
                                                <FormControl variant="outlined">
                                                    <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                                                    <OutlinedInput
                                                        id="outlined-adornment-password password"
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
                                                        label="password" name="passwordSesion"
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </div>
                                        </Box>
                                    </CardContent>
                                </React.Fragment>
                            </Card>
                            <button onClick={inicioSession} className="btn btn-primary mt-4 col-12">Inicio de session</button>
                            <Box variant="h5" component="div">
                                <div className="row my-3 mx-3">
                                </div>
                                <h5 className='mt-2 '>¿No tienes una cuenta? <a className='enlacesRes' href='# ' onClick={registrarUsuario}>Resgistrate</a></h5>
                            </Box>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    else {

        return (
            <div>
                <div>
                    {alertaError && (
                        <Alert className="alertMui" onClose={() => { setAlertaError(false) }} severity="error">
                            {mensajeError.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </Alert>
                    )}
                </div>




                <div className='col-12  d-flex justify-content-center formularioIniReg'>
                    <div className="card" style={{ width: '25rem' }}>
                        <div className="card-body">
                            <h3 className="card-title text-center my-3">Registrate</h3>
                            <Card variant="outlined">
                                <React.Fragment>
                                    <CardContent className='tarjetaI'>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1">
                                                <TextField id="nombre" label="Nombre" variant="outlined" name="nombre" className='' onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1">
                                                <TextField id="apellidos" label="Apellidos" variant="outlined" name="apellidos" onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1">
                                                <TextField id="usuario" label="Usuario" variant="outlined" name="usuario" onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='mt-3'>
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
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1">
                                                <TextField id="correo" label="Correo Electronico" variant="outlined" name="correo" onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div id="fecha" className="row my-1">
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker label="Fecha de cumpleaños" name="cumple" defaultValue={dayjs('2000-01-01')} onChange={(newValue) => setFecha(newValue)} />
                                                </LocalizationProvider>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1">
                                                <h5 className="col-6 enlacesRes" >Selecione una foto de perfil</h5>
                                                <Input className="col-6" type="file" name="foto" id="fotoVerd" />
                                                <input type="hidden" name="lim_tamano" value="100000" id="limTamano" />
                                            </div>
                                        </Box>
                                    </CardContent>
                                </React.Fragment>
                            </Card>
                            <button onClick={cancelarBD} className="btn btn-danger mt-4 ms-4 mx-2 col-5">Cancelar</button>
                            <button onClick={registrarBD} className="btn btn-primary mt-4 mx-2 col-5">Registrarse</button>
                        </div>
                    </div>
                </div>


            </div>

        );
    }




}//export