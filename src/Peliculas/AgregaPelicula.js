import MiNavBar from "../MiNavBar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    TextField, FormControl, InputLabel, Select, Box, Card, CardContent,
    Input, Checkbox, FormControlLabel, FormLabel, FormGroup, Alert, MenuItem, Button
} from '@mui/material';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function AgregaPelicula() {
    const location = useLocation();
    const datosUsuario = { id: location.state.prop1, nombre: location.state.prop2, adm: location.state.prop3 };
    const [formNPeli, setFormNPeli] = useState(false);
    const [datosRegPel, setDatosRegPel] = useState([]);
    const [datosPelUsuario, setDatosPelUsuariol] = useState([]);
    const [fecha, setFecha] = useState(null);
    const [mensajeError, setMensajeError] = useState("");
    const [alertaError, setAlertaError] = useState(false);
    const [mensajeOK, setMensajeOK] = useState("");
    const [alertaOK, setAlertaOK] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [datosCategoriaBD, setDatosCategoriaBD] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [vista, setVista] = useState(false);
    const [alertaConfirmacion, setAlertaConfirmacion] = useState(false);
    const [mostrarFormuFotoVist, setMostrarFormuFotoVist] = useState(false);



    //console.log(datosUsuario.adm);


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
    const handleChange3 = (event) => {
        if (event.target.checked) {
            // Si se selecciona el checkbox, agregar el ID de la categoría al array de categorías seleccionadas
            setVista(true);
        } else {
            // Si se deselecciona el checkbox, filtrar el ID de la categoría del array de categorías seleccionadas
            setVista(false);
        }
    };
    useEffect(() => {

        async function getDatosCategoriaBD() {

            let response = await fetch("php/proyectoFinal/Categoria/getCategoria.php",
                {
                    method: 'GET'
                });

            if (response.ok) {
                let respuesta = await response.json();
                setDatosCategoriaBD(respuesta)

            }


        }

        getDatosCategoriaBD();

    }, []);


    useEffect(() => {

        async function getPeliculasUsuario() {

            if (datosUsuario.adm == 0) {
                let datosPel = new FormData();
                datosPel.append("idUsuario", location.state.prop1);

                let response = await fetch(`php/proyectoFinal/Pelicula/getPeliculasUsuario.php`, {
                    body: datosPel,
                    method: 'POST'
                });


                if (response.ok) {
                    let respuesta = await response.json();
                    setDatosPelUsuariol(respuesta);
                }

            }
        }
        getPeliculasUsuario();

    }, []);


    function agregarDesdeSelect() {
        //Desde el select de peliculas
        async function registrarPeliculaExistente() {
            if (selectedOption === '') {
                setMensajeError("Error debes selecionar una pelicula");
                setAlertaError(true);
            }
            else {
                window.scrollTo(0, 0);
                setAlertaConfirmacion(true);
            }

        }
        registrarPeliculaExistente();
    }
    function cancelarSelecion() {
        setMostrarFormuFotoVist(false);
    }
    function agregarMasDatos() {
        //Aqui mostramos los elementos del formulario para agregar
        setMostrarFormuFotoVist(true);
    }
    async function agregarDatosNuevos() {
        //recoger los datos y colocarlo en la base de datos
        let datosId = new FormData();
        datosId.append("idUsuario", location.state.prop1);
        datosId.append("idPelicula", selectedOption);
        datosId.append("vista", vista);

        let fotoBD = document.getElementById("fotoVerd");
        let limTamano = document.getElementById("limTamano");
        //fallo aqui

        datosId.append("foto", fotoBD.files[0]);
        datosId.append("limTam", limTamano.value);

        let response = await fetch(`php/proyectoFinal/Pelicula/agregarPelSele.php`, {
            body: datosId,
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
                setMostrarFormuFotoVist(false);
                window.scrollTo(0, 0);


            }

        }

    }
    async function agregarSinDatos() {
        //Ya que no añadimos mas datos se inserta directamente
        let datosId = new FormData();
        datosId.append("idUsuario", location.state.prop1);
        datosId.append("idPelicula", selectedOption);

        let response = await fetch(`php/proyectoFinal/Pelicula/agregarPelSele.php`, {
            body: datosId,
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

    function nuevaPeliForm() {
        setFormNPeli(true)
    }

    function agregarNuevaPeli() {


        async function registrarEnBD() {
            var sMensaje = "";
            setMensajeError("");
            setAlertaError(false);

            if (!/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(datosRegPel.titulo) || datosRegPel.titulo === undefined) {
                sMensaje += "El nombre introducido solo puede llevar letras y no puede estar vacio.\n";
                document.getElementById("titulo").classList.add("error");
            }
            else {
                document.getElementById("titulo").classList.remove("error");
            }
            if (!/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(datosRegPel.tituloIngles) || datosRegPel.tituloIngles === undefined) {
                sMensaje += "El nombre introducido en ingles solo puede llevar letras y no puede estar vacio.\n";
                document.getElementById("tituloIngles").classList.add("error");
            }
            else {
                document.getElementById("tituloIngles").classList.remove("error");
            }
            if (fecha === null) {
                sMensaje += "El campo fecha esta mal (Se debe actualizar el campo).\n";
                document.getElementById("fecha").classList.add("error");
            }
            else {
                document.getElementById("fecha").classList.remove("error");
            }

            if (sMensaje !== "") {
                setMensajeError(sMensaje);
                setAlertaError(true);
                window.scrollTo(0, 0);
            }
            else {
                let dia = fecha["$D"];
                let mes = fecha["$M"] + 1;
                let ano = fecha["$y"];

                let datosGrabar = new FormData();
                datosGrabar.append("nombre", datosRegPel.titulo);
                datosGrabar.append("nombreEN", datosRegPel.tituloIngles);
                datosGrabar.append("fechaD", dia);
                datosGrabar.append("fechaM", mes);
                datosGrabar.append("fechaY", ano);
                datosGrabar.append("categorias", categoriasSeleccionadas);
                datosGrabar.append("vista", vista);
                datosGrabar.append("idUsuario", location.state.prop1);
                datosGrabar.append("adm", location.state.prop3);

                let fotoBD = document.getElementById("fotoVerd");
                let limTamano = document.getElementById("limTamano");

                datosGrabar.append("foto", fotoBD.files[0]);
                datosGrabar.append("limTam", limTamano.value);
                /*
                    console.log(fotoBD.files[0]);
                    console.log(limTamano.value);
                */
                let response = await fetch("php/proyectoFinal/Pelicula/registrarPelicula.php",
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
                        setMensajeOK(respuesta.datos);
                        setAlertaOK(true);
                        window.scrollTo(0, 0);
                    }
                }
            }

        }
        registrarEnBD();

    }

    if (!formNPeli) {

        return (
            <>
                <MiNavBar datos={datosUsuario} />

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
                    {alertaOK && (
                        <Alert className="alertMui" onClose={() => { setAlertaOK(false); window.location.reload();}} severity="success">
                            {mensajeOK.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </Alert>
                    )}
                    {alertaConfirmacion && (
                        <Alert className="alertMui" onClose={() => { setAlertaConfirmacion(false); }} severity="info">
                            {
                                "Deseas modificar la foto y la vista que hay por defecto"
                            }
                            <div>
                                <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); agregarSinDatos() }}>
                                    No
                                </Button>
                                <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); agregarMasDatos() }}>
                                    Si
                                </Button>
                            </div>

                        </Alert>
                    )}
                </div>

                <div className='col-12  d-flex justify-content-center formularioIniReg'>
                    <div className="card" style={{ width: '25rem' }}>
                        <div className="card-body">
                            <h3 className="card-title text-center my-3">Agregar pelicula</h3>
                            {datosUsuario.adm == 0 && (
                                <>
                                    <FormControl variant="outlined" className="w-100 mt-3 mb-3" disabled={mostrarFormuFotoVist}>
                                        <InputLabel id="category-select-label" >Selecciona una pelicula</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            id="category-select"
                                            value={selectedOption}
                                            onChange={(e) => {
                                                setSelectedOption(e.target.value);
                                                /* setVisibilidadText(false); */
                                                /*setDatoText(datosBD.find(op => op.idCategoria === e.target.value).nombre)*/
                                            }}
                                            label="Selecciona una Pelicula" >
                                            {
                                                datosPelUsuario.map((option, index) => (
                                                    <MenuItem key={index} value={option.idPelicula}>
                                                        {option.titulo}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <Box variant="h5" component="div">
                                        <h5 className='mt-2 '>¿No encuentras la pelicula? <a className='enlacesRes' onClick={nuevaPeliForm}>Crea una nueva</a></h5>
                                    </Box>
                                    <button onClick={agregarDesdeSelect} className="btn btn-primary mt-4 col-12" disabled={mostrarFormuFotoVist}>Aceptar</button>
                                </>
                            )}
                            {datosUsuario.adm == 1 && (
                                <Box variant="h5" component="div">
                                    <h5 className='mt-2 text-center '><a className='enlacesRes' onClick={nuevaPeliForm}>Crea una nueva pelicula</a></h5>
                                </Box>
                            )}


                            {mostrarFormuFotoVist && (
                                <Box variant="h5" component="div" className='my-2 '>
                                    <div id="fecha" className="row my-1" >
                                        <FormControlLabel control={<Checkbox />} label="¿Pelicula vista?" name="vista" onChange={handleChange3} />
                                    </div>
                                    <div className="row my-2">
                                        <h5 className="col-6 enlacesRes" >Selecione una foto de portada</h5>
                                        <Input className="col-6" type="file" name="foto" id="fotoVerd" />
                                        <input type="hidden" name="lim_tamano" value="100000" id="limTamano" />

                                        <button onClick={cancelarSelecion} className="btn btn-danger mt-4 ms-3 col-5">Cancelar</button>
                                        <button onClick={agregarDatosNuevos} className="btn btn-primary mt-4 ms-4  col-5">Agregar</button>
                                    </div>
                                </Box>
                            )}
                        </div>
                    </div>
                </div>

            </>
        );
    }



    if (formNPeli) {

        return (
            <>
                <MiNavBar datos={datosUsuario} />
                {alertaOK && (
                    <Alert className="alertMui" onClose={() => { setAlertaOK(false);  }} severity="success">
                        {mensajeOK.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </Alert>
                )}

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
                            <h3 className="card-title text-center my-3">Registrar nueva Pelicula</h3>
                            <Card variant="outlined">
                                <React.Fragment>
                                    <CardContent className='tarjetaI'>
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1  " id="titulo">
                                                <TextField id="outlined-basic " label="Titulo" variant="outlined" name="titulo" onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='mt-3'>
                                            <div className="row my-1" id="tituloIngles">
                                                <TextField id="outlined-basic " label="Titulo en ingles" variant="outlined" name="tituloIngles" onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-3'>
                                            <div id="fecha" className="row my-1">
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker label="Fecha de estreno" name="cumple" defaultValue={dayjs('2000-01-01')} onChange={(newValue) => setFecha(newValue)} />
                                                </LocalizationProvider>
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='my-3'>
                                            <div id="fecha" className="row my-1" >
                                                <FormControlLabel control={<Checkbox />} label="¿Pelicula vista?" name="vista" onChange={handleChange3} />
                                            </div>
                                        </Box>
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
                                        <Box variant="h5" component="div" className='my-2'>
                                            <div className="row my-1">
                                                <h5 className="col-6 enlacesRes" >Selecione una foto de portada</h5>
                                                <input className="col-6" type="file" name="foto" id="fotoVerd" />
                                                <input type="hidden" name="lim_tamano" value="100000" id="limTamano" />
                                            </div>
                                        </Box>
                                    </CardContent>
                                </React.Fragment>
                            </Card>
                            <button onClick={agregarNuevaPeli} className="btn btn-primary mt-4 col-12">Agregar nueva pelicula</button>
                        </div>
                    </div>

                </div>

            </>
        );
    }
}