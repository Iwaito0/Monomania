import MiNavBar from "../MiNavBar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Card, CardContent, Typography, Input, Box, TextField, FormControlLabel, Checkbox, InputLabel,
    FormControl, FormLabel, FormGroup, Alert, Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TarjetaImagen from '../TarjetaImagen';


export default function Novelas() {
    const location = useLocation();
    const datosUsuario = { id: location.state.prop1, nombre: location.state.prop2, adm: location.state.prop3 };
    const [datosNovelasUsuario, setDatosNovelasUsuario] = useState([]);
    const [datosCategoriaBD, setDatosCategoriaBD] = useState([]);
    const [idNovelaIdCategoria, setIdNovelaIdCategoria] = useState([]);
    const [editCards, setEditCards] = useState(true);
    const [mensajeError, setMensajeError] = useState("");
    const [alertaError, setAlertaError] = useState(false);
    const [mensajeOK, setMensajeOK] = useState("");
    const [alertaOK, setAlertaOK] = useState(false);
    const [alertaConfirmacion, setAlertaConfirmacion] = useState(false);
    let color = "";
    const [numTemp, setNumTemp] = useState(-1);
    const [numIdAnt, setNumIdAnt] = useState(-1);
    const [novDelete, setNovDelete] = useState(-1);
    const [datosRegNov, setDatosRegNov] = useState([]);
    const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [nDatosTarjetaCargar, setNDatosTarjetaCargar] = useState(8);

    //console.log(datosUsuario);


    window.addEventListener('scroll', function () {

        let alturaScroll = this.document.documentElement.scrollHeight - this.document.documentElement.clientHeight;

        if (this.window.scrollY === alturaScroll) {
            setNDatosTarjetaCargar(nDatosTarjetaCargar + nDatosTarjetaCargar);
        }
    })



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

        async function getNovelasUsuario() {

            let datosNov = new FormData();
            datosNov.append("idUsuario", datosUsuario.id);
            datosNov.append("adm", datosUsuario.adm);
            datosNov.append("nTarjetas", nDatosTarjetaCargar);

            let response = await fetch(`php/proyectoFinal/Novela/getTodasNovelasUsuario.php`, {
                body: datosNov,
                method: 'POST'
            });

            if (response.ok) {
                let respuesta = await response.json();
                setDatosNovelasUsuario(respuesta);
            }
        }
        getNovelasUsuario();

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

        async function getCatNov() {

            let tablaidNovela = [];
            datosNovelasUsuario.forEach(function (valor, indice, array) {
                tablaidNovela.push(valor["idNovelas"]);
            });

            if (!tablaidNovela.length == 0) {

                let datosNovCat = new FormData();
                datosNovCat.append("arrayIds", tablaidNovela);

                let response = await fetch("php/proyectoFinal/Novela/getCategoriaNov.php",
                    {
                        body: datosNovCat,
                        method: 'POST'
                    });

                if (response.ok) {
                    let respuesta = await response.json();
                    setIdNovelaIdCategoria(respuesta)
                }
            }

        }
        getCatNov();


    }, [datosNovelasUsuario]);

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

    function eliminarNov(oEvento) {

        let oE = oEvento || window.event;
        let idTarjeta;

        if (oE.target.id == "") {
            idTarjeta = oE.target.parentNode.id;
        }
        else {
            idTarjeta = oE.target.id;
        }
        setNovDelete(idTarjeta)
        setAlertaConfirmacion(true);

    }

    async function deleteNov() {
        //falta ADM
        let idDelete = new FormData();
        idDelete.append("idNovela", novDelete);
        idDelete.append("idUsuario", datosUsuario.id);
        idDelete.append("adm", datosUsuario.adm);

        let response = await fetch(`php/proyectoFinal/Novela/eliminarNovela.php`, {
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
    function noDeleteNov() {
        setMensajeOK("Se ha cancelado el borrado de la novela");
        setAlertaOK(true);
    }

    function editarNovelas(oEvento) {
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
        setNumTemp(tarjeta.id)
            ;
        let elemTar = tarjeta.querySelectorAll("#placeHolderBlack");

        if (tarjeta.dataset.key != 1 && datosUsuario.id != 1) {
            elemTar.forEach(element => {
                element.removeAttribute('disabled');
                element.classList.remove("Mui-disabled");
                element.parentNode.classList.remove("Mui-disabled");
            });

        }
        else {

            if (datosUsuario.id != 1) {

                elemTar.forEach(element => {

                    if (element.name == "capLe" || element.name == "enlace") {
                        element.removeAttribute('disabled');
                        element.classList.remove("Mui-disabled");
                        element.parentNode.classList.remove("Mui-disabled");
                    }

                });
            }
        }
        setEditCards(false)

    }
    function cancelarEdicion(oEvento) {
        setEditCards(true);
        setNumTemp(-1);

        let oE = oEvento || window.event;
        let tarjeta = oE.target.parentNode.parentNode.parentNode.parentNode;

        let elemTar = tarjeta.querySelectorAll("#placeHolderBlack");

        elemTar.forEach(element => {
            element.setAttribute('disabled', true);
            element.classList.add("Mui-disabled");
            element.parentNode.classList.add("Mui-disabled");
        });

    }
    function cancelarAnterior() {

        let tarjetaAnt;
        if (numIdAnt != -1) {
            tarjetaAnt = document.getElementById(numIdAnt);

            if (tarjetaAnt == null) {
                tarjetaAnt = document.parentNode;

            }


            let elemTar = tarjetaAnt.querySelectorAll("#placeHolderBlack");

            elemTar.forEach(element => {
                element.setAttribute('disabled', true);
                element.classList.add("Mui-disabled");
                element.parentNode.classList.add("Mui-disabled");
            });

        }
    }

    async function editarTarjeta(oEvento) {

        if (datosUsuario.adm == 1) {
            let oE = oEvento || window.event;

            let id = oE.target.id;
            let idUpdate = new FormData();


            idUpdate.append("adm", datosUsuario.adm);
            idUpdate.append("idNovelaADM", oE.target.dataset.keyid);

            if (id == "NV") {

                idUpdate.append("validacion", -1);
            }
            else {
                idUpdate.append("validacion", 1);
            }

            let response = await fetch(`php/proyectoFinal/Novela/modificarNovelas.php`, {
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
            idUpdate.append("titulo", datosRegNov['titulo']);
            idUpdate.append("tituloEN", datosRegNov['tituloEn']);
            idUpdate.append("tituloJP", datosRegNov['tituloJP']);
            idUpdate.append("capLe", datosRegNov['capLe']);
            idUpdate.append("capEs", datosRegNov['capEs']);
            idUpdate.append("enlace", datosRegNov['enlace']);
            idUpdate.append("idNovelas", subid);
            idUpdate.append("categ", categoriasSeleccionadas);
            idUpdate.append("idUsuario", datosUsuario.id);
            idUpdate.append("adm", datosUsuario.adm);


            let fotoBD = document.getElementById("fotoVerd");
            let limTamano = document.getElementById("limTamano");

            idUpdate.append("foto", fotoBD.files[0]);
            idUpdate.append("limTam", limTamano.value);

            let response = await fetch(`php/proyectoFinal/Novela/modificarNovelas.php`, {
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
    function convertiraPDF() {

        let d = datosUsuario.id + "" + datosUsuario.adm;

        window.open('php/proyectoFinal/Novela/convertirPDFNovelas.php?n=' + datosUsuario.id + "&p=" + datosUsuario.adm, '_blank');


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
                        "¿Deseas eliminar la novela?"
                    }
                    <div>
                        <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); noDeleteNov() }}>
                            No
                        </Button>
                        <Button color="inherit" size="small" onClick={() => { setAlertaConfirmacion(false); deleteNov() }}>
                            Si
                        </Button>
                    </div>

                </Alert>
            )}
            <Box variant="h5" component="div" className='col-lg-12'>
                <div className=" d-flex flex-row-reverse fondoTarjeta  " id="bloqueIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-file-earmark-pdf-fill iconoPDF" viewBox="0 0 16 16" onClick={convertiraPDF}>
                        <path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z" />
                        <path fillRule="evenodd" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z" />
                    </svg>
                </div>
            </Box>
            <div className="row d-flex mx-0 justify-content-center fondoTarjeta">
                {datosNovelasUsuario.map((option, index) => (

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


                        <Card id={option.idNovelas} data-key={option.validado} style={{ border: color }} className="col-lg-2 col-md-2 col-sm-1 tarjetas" key={index} >

                            <Box variant="h5" component="div" className='my-2'>
                                <div className="my-1 d-flex flex-row-reverse  " id="bloqueIcon">
                                    {datosUsuario.adm != 1 && (
                                        <DeleteIcon id={option.idNovelas} data-key={option.idNovelas} onClick={() => { eliminarNov(); window.scrollTo(0, 0); }} />
                                    )}
                                    <EditIcon id={option.idNovelas} data-key={option.idNovelas} onClick={() => { cancelarAnterior(); editarNovelas() }} />
                                </div>
                            </Box>

                            <TarjetaImagen rutaAPI={"php/proyectoFinal/Novela/verFotoNovela.php?n=" + option.idNovelas + "&p=" + datosUsuario.id} />

                            <CardContent>
                                <Box variant="h5" component="div" className='my-2'>
                                    <div className="row my-1 " id="titulo">
                                        <TextField id="placeHolderBlack" placeholder={option.tituloEspanol} name="titulo" onChange={handleChange} data-titulo={option.titulo} disabled>
                                            {option.titulo}
                                        </TextField>
                                    </div>
                                </Box>
                                <Box variant="h5" component="div" className='my-2'>
                                    <div className="row my-1  " id="tituloEN">
                                        <TextField id="placeHolderBlack" placeholder={option.tituloIngles} name="tituloEn" onChange={handleChange} data-tituloalt={option.tituloIngles} disabled>
                                            {option.tituloIngles}
                                        </TextField>
                                    </div>
                                </Box>
                                <Box variant="h5" component="div" className='my-2'>
                                    <div className="row my-1  " id="tituloJP">
                                        <TextField id="placeHolderBlack" placeholder={option.tituloJapones} name="tituloJP" onChange={handleChange} data-tituloalt={option.tituloJapones} disabled>
                                            {option.tituloJapones}
                                        </TextField>
                                    </div>
                                </Box>
                                <Box variant="h5" component="div" className='mt-3 col-12 m-0 row'>
                                    <div className="my-1 px-0 me-1 col " id="capituloLeido">
                                        <TextField id="placeHolderBlack" placeholder={option.capituloLeido} name="capLe" onChange={handleChange} data-tituloalt={option.capituloLeido} disabled>
                                            {option.capituloLeido}
                                        </TextField>
                                    </div>
                                    <div className="my-1 px-0 ms-1 col " id="capituloEstrenado">
                                        <TextField id="placeHolderBlack" placeholder={option.capituloEstrenado} name="capEs" onChange={handleChange} data-tituloalt={option.capituloEstrenado} disabled>
                                            {option.capituloEstrenado}
                                        </TextField>
                                    </div>
                                </Box>
                                <Box variant="h5" component="div" className='mt-3'>
                                    <div className="row my-1" id="enlace">
                                        {datosUsuario.adm == 1 && (
                                            <TextField id="placeHolderBlack" placeholder={option.enlaceNov} name="enlace" onChange={handleChange} data-tituloalt={option.enlace} disabled>
                                                {option.enlace}
                                            </TextField>
                                        )}
                                        {datosUsuario.adm == 0 && (

                                            <>
                                                {datosUsuario.adm == 0 && (
                                                    <>


                                                        {option.enlace != null && (
                                                            <TextField id="placeHolderBlack" placeholder={option.enlace} name="enlace" onChange={handleChange} data-tituloalt={option.enlace} disabled>
                                                                {option.enlace}
                                                            </TextField>
                                                        )}
                                                        {option.enlaceNov != null && option.enlace == null && (
                                                            <TextField id="placeHolderBlack" placeholder={option.enlaceNov} name="enlace" onChange={handleChange} data-tituloalt={option.enlaceNov} disabled>
                                                                {option.enlaceNov}
                                                            </TextField>
                                                        )}

                                                    </>


                                                )}
                                            </>

                                        )}
                                    </div>
                                </Box>
                                {!editCards && numTemp == option.idNovelas && (
                                    <>
                                        {option.validado != 1 && datosUsuario.adm == 0 && (
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
                                                        <button onClick={editarTarjeta} id={"nov" + option.idNovelas} className="btn btn-primary mx-1 mt-2 col-lg-5 col-md-12  col-sm-12">Modificar</button>
                                                    </div>
                                                </Box>
                                            </div>
                                        )}
                                        {datosUsuario.adm == 1 && (
                                            <div className="row ">
                                                <button onClick={editarTarjeta} id="NV" data-keyid={option.idNovelas} className="btn btn-danger ms-2 mt-2 col-lg-5 col-md-4  col-sm-12">NV</button>
                                                <button onClick={editarTarjeta} id="V" data-keyid={option.idNovelas} className="btn btn-success  ms-2 mt-2 col-lg-5 col-md-4  col-sm-12">V</button>
                                                <button onClick={cancelarValidacion} id="V" className="btn btn-danger mt-2 col-12">Cancelar</button>
                                            </div>

                                        )}

                                    </>
                                )}
                                {!editCards && numTemp != option.idNovelas && (

                                    <Box variant="h5" component="div" className=''>
                                        <FormLabel component="legend"> Categorias</FormLabel>
                                        {
                                            //console.log(Math.random()*(1000000-0)+100)
                                            datosCategoriaBD.map((option2, index2) => (
                                                idNovelaIdCategoria.map((option3, index3) => (
                                                    <React.Fragment key={index2 + Math.random() * (1000000 - 0) + 100}>
                                                        {option.idNovelas == option3.idNovelas && (
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
                                                idNovelaIdCategoria.map((option3, index3) => (
                                                    <React.Fragment key={index2 + Math.random() * (1000000 - 0) + 100}>
                                                        {option.idNovelas == option3.idNovelas && (
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
