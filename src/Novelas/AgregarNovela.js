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

//18.05.X.14.42
export default function AgregarNovela() {

    const location = useLocation();
    const datosUsuario = { id: location.state.prop1, nombre: location.state.prop2, adm: location.state.prop3 };
    const [formNNov, setFormNNov] = useState(false);
    const [datosRegNov, setDatosRegNov] = useState([]);
    const [datosNovUsuario, setDatosNovUsuariol] = useState([]);
    const [mensajeError, setMensajeError] = useState("");
    const [alertaError, setAlertaError] = useState(false);
    const [mensajeOK, setMensajeOK] = useState("");
    const [alertaOK, setAlertaOK] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [datosCategoriaBD, setDatosCategoriaBD] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [alertaConfirmacion, setAlertaConfirmacion] = useState(false);
    const [mostrarFormuFotoVist, setMostrarFormuFotoVist] = useState(false);


    //console.log(datosUsuario.adm);


    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        const nuevosDatos = { ...datosRegNov, [name]: value };

        setDatosRegNov(nuevosDatos);
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

        async function getNovelasUsuario() {

            if (datosUsuario.adm == 0) {
                let datosNov = new FormData();
                datosNov.append("idUsuario", location.state.prop1);

                let response = await fetch(`php/proyectoFinal/Novela/getNovelasUsuario.php`, {
                    body: datosNov,
                    method: 'POST'
                });


                if (response.ok) {
                    let respuesta = await response.json();
                    setDatosNovUsuariol(respuesta);
                }

            }
        }
        getNovelasUsuario();

    }, []);


    function agregarDesdeSelect() {
        //Desde el select de novelas
        async function registrarNovelaExistente() {
            if (selectedOption === '') {
                setMensajeError("Error debes selecionar una novela");
                setAlertaError(true);
            }
            else {
                window.scrollTo(0, 0);
                setAlertaConfirmacion(true);
            }

        }
        registrarNovelaExistente();
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
        var sMensaje = "";
        setMensajeError("");
        setAlertaError(false);

        if (!/^[0-9]+$/.test(datosRegNov.capituloLeidoN) || datosRegNov.capituloLeidoN === undefined) {
            sMensaje += "Se debe introducir un numero valido.\n";
            document.getElementById("capituloLeidoN").classList.add("error");
        }
        else {
            document.getElementById("capituloLeidoN").classList.remove("error");
        }
        if (!/^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(datosRegNov.enlaceN) || datosRegNov.enlaceN === undefined) {
            sMensaje += "El enlace introducido no es valido.\n";
            document.getElementById("enlaceN").classList.add("error");
        }
        else {
            document.getElementById("enlaceN").classList.remove("error");
        }

        if (sMensaje !== "") {
            setMensajeError(sMensaje);
            setAlertaError(true);
            window.scrollTo(0, 0);
        }
        else {

            let datosId = new FormData();
            datosId.append("idUsuario", location.state.prop1);
            datosId.append("idNovela", selectedOption);
            datosId.append("enlace", datosRegNov.enlaceN);
            datosId.append("capLe", datosRegNov.capituloLeidoN);
            let fotoBD = document.getElementById("fotoVerd");
            let limTamano = document.getElementById("limTamano");

            //fallo Aqui

            datosId.append("foto", fotoBD.files[0]);
            datosId.append("limTam", limTamano.value);
            

            let response = await fetch(`php/proyectoFinal/Novela/agregarNovSele.php`, {
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

    }
    async function agregarSinDatos() {
        //Ya que no añadimos mas datos se inserta directamente
        let datosId = new FormData();
        datosId.append("idUsuario", location.state.prop1);
        datosId.append("idNovela", selectedOption);
        datosId.append("enlace", null);
        datosId.append("capLe", 0);

        let response = await fetch(`php/proyectoFinal/Novela/agregarNovSele.php`, {
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
            }

        }
    }

    function nuevaNovForm() {
        setFormNNov(true)
    }

    function agregarNuevaNov() {


        async function registrarEnBD() {
            var sMensaje = "";
            setMensajeError("");
            setAlertaError(false);

            if (!/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(datosRegNov.titulo) || datosRegNov.titulo === undefined) {
                sMensaje += "El nombre introducido solo puede llevar letras y no puede estar vacio.\n";
                document.getElementById("titulo").classList.add("error");
            }
            else {
                document.getElementById("titulo").classList.remove("error");
            }
            if (!/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(datosRegNov.tituloIngles) || datosRegNov.tituloIngles === undefined) {
                sMensaje += "El nombre introducido en ingles solo puede llevar letras y no puede estar vacio.\n";
                document.getElementById("tituloIngles").classList.add("error");
            }
            else {
                document.getElementById("tituloIngles").classList.remove("error");
            }
            if (!/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/.test(datosRegNov.tituloJapones) || datosRegNov.tituloJapones === undefined) {
                sMensaje += "El nombre introducido en japones solo puede llevar letras y no puede estar vacio\n";
                document.getElementById("tituloJapones").classList.add("error");
            }
            else {
                document.getElementById("tituloJapones").classList.remove("error");
            }
            if (!/^[0-9]+$/.test(datosRegNov.capituloLeido) || datosRegNov.capituloLeido === undefined) {
                sMensaje += "Se debe introducir un numero valido.\n";
                document.getElementById("capituloLeido").classList.add("error");
            }
            else {
                document.getElementById("capituloLeido").classList.remove("error");
            }
            if (!/^[0-9]+$/.test(datosRegNov.capituloEstrenado) || datosRegNov.capituloEstrenado === undefined) {
                sMensaje += "Se debe introducir un numero valido.\n";
                document.getElementById("capituloEstrenado").classList.add("error");
            }
            else {
                document.getElementById("capituloEstrenado").classList.remove("error");
            }
            if (!/^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(datosRegNov.enlace) || datosRegNov.enlace === undefined) {
                sMensaje += "El enlace introducido no es valido.\n";
                document.getElementById("enlace").classList.add("error");
            }
            else {
                document.getElementById("enlace").classList.remove("error");
            }
            if (parseInt(datosRegNov.capituloLeido) > parseInt(datosRegNov.capituloEstrenado)) {

                sMensaje += "El capitulo leido no puede superrar al capitulo estrenado.\n";
                document.getElementById("capituloLeido").classList.add("error");
                document.getElementById("capituloEstrenado").classList.add("error");
            }
            else {
                document.getElementById("capituloLeido").classList.remove("error");
                document.getElementById("capituloEstrenado").classList.remove("error");
            }

            if (sMensaje !== "") {
                setMensajeError(sMensaje);
                setAlertaError(true);
                window.scrollTo(0, 0);
            }
            else {

                let datosGrabar = new FormData();
                datosGrabar.append("nombre", datosRegNov.titulo);
                datosGrabar.append("nombreEN", datosRegNov.tituloIngles);
                datosGrabar.append("nombreJP", datosRegNov.tituloJapones);
                datosGrabar.append("capLe", datosRegNov.capituloLeido);
                datosGrabar.append("capEstre", datosRegNov.capituloEstrenado);
                datosGrabar.append("enlace", datosRegNov.enlace);
                datosGrabar.append("categorias", categoriasSeleccionadas);
                datosGrabar.append("idUsuario", location.state.prop1);
                datosGrabar.append("adm", location.state.prop3);

                let fotoBD = document.getElementById("fotoVerd");
                let limTamano = document.getElementById("limTamano");

                datosGrabar.append("foto", fotoBD.files[0]);
                datosGrabar.append("limTam", limTamano.value);

                let response = await fetch("php/proyectoFinal/Novela/registrarNovela.php",
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

    if (!formNNov) {

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
                        <Alert className="alertMui" onClose={() => { setAlertaOK(false); window.location.reload(); }} severity="success">
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
                                "Deseas modificar la foto, el enlace, y el capitulo que hay por defecto"
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
                            <h3 className="card-title text-center my-3">Agregar Novela</h3>
                            {datosUsuario.adm == 0 && (
                                <>
                                    <FormControl variant="outlined" className="w-100 mt-3 mb-3" disabled={mostrarFormuFotoVist}>
                                        <InputLabel id="category-select-label" >Selecciona una novela</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            id="category-select"
                                            value={selectedOption}
                                            onChange={(e) => {
                                                setSelectedOption(e.target.value);
                                                /* setVisibilidadText(false); */
                                                /*setDatoText(datosBD.find(op => op.idCategoria === e.target.value).nombre)*/
                                            }}
                                            label="Selecciona una novela" >
                                            {
                                                datosNovUsuario.map((option, index) => (
                                                    <MenuItem key={index} value={option.idNovelas}>
                                                        {option.tituloJapones}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                    <Box variant="h5" component="div">
                                        <h5 className='mt-2 '>¿No encuentras la novela? <a className='enlacesRes' onClick={nuevaNovForm}>Crea una nueva</a></h5>
                                    </Box>
                                    <button onClick={agregarDesdeSelect} className="btn btn-primary mt-4 col-12" disabled={mostrarFormuFotoVist}>Aceptar</button>
                                </>
                            )}
                            {datosUsuario.adm == 1 && (
                                <Box variant="h5" component="div">
                                    <h5 className='mt-2 text-center '><a className='enlacesRes' onClick={nuevaNovForm}>Crea una nueva novela</a></h5>
                                </Box>
                            )}


                            {mostrarFormuFotoVist && (
                                <Box variant="h5" component="div" className='my-2 '>
                                    <Box variant="h5" component="div" className='mt-3'>
                                        <div className="row my-1" id="capituloLeidoN">
                                            <TextField id="outlined-basic " label="Capitulo leido" variant="outlined" name="capituloLeidoN" onChange={handleChange} />
                                        </div>
                                    </Box>
                                    <Box variant="h5" component="div" className='mt-3'>
                                        <div className="row my-1" id="enlaceN">
                                            <TextField id="outlined-basic " label="Enlace " variant="outlined" name="enlaceN" onChange={handleChange} />
                                        </div>
                                    </Box>
                                    <div className="row my-2">
                                        <h5 className="col-6 enlacesRes" >Selecione una foto de portada</h5>
                                        <input className="col-6" type="file" name="foto" id="fotoVerd" />
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



    if (formNNov) {

        return (
            <>
                <MiNavBar datos={datosUsuario} />
                {alertaOK && (
                    <Alert className="alertMui" onClose={() => { setAlertaOK(false) }} severity="success">
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
                            <h3 className="card-title text-center my-3">Registrar nueva Novela</h3>
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
                                        <Box variant="h5" component="div" className='mt-3'>
                                            <div className="row my-1" id="tituloJapones">
                                                <TextField id="outlined-basic " label="Titulo en Japones" variant="outlined" name="tituloJapones" onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='mt-3 col-12 m-0 row'>
                                            <div className="my-1 px-0 me-1 col " id="capituloLeido">
                                                <TextField id="outlined-basic " label="Capitulo leido" variant="outlined" name="capituloLeido" onChange={handleChange} />
                                            </div>
                                            <div className="my-1 px-0 ms-1 col " id="capituloEstrenado">
                                                <TextField id="outlined-basic " label="Capitulo estrenado" variant="outlined" name="capituloEstrenado" onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='mt-3'>
                                            <div className="row my-1" id="enlace">
                                                <TextField id="outlined-basic " label="Enlace " variant="outlined" name="enlace" onChange={handleChange} />
                                            </div>
                                        </Box>
                                        <Box variant="h5" component="div" className='mt-3'>
                                            <FormControl component="fieldset" variant="standard" >
                                                <FormLabel component="legend">Elige la categoría que pertenezca a la novela</FormLabel>
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
                            <button onClick={agregarNuevaNov} className="btn btn-primary mt-4 col-12">Agregar nueva novela</button>
                        </div>
                    </div>

                </div>

            </>
        );
    }
}   