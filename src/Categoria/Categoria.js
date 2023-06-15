import { useState, useEffect } from 'react';
import * as React from 'react';
import MiNavBar from "../MiNavBar";
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Box, TextField, Alert, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Categoria() {
    const [datos, setDatos] = useState([]);
    const [datosBD, setDatosBD] = useState([]);
    const [alerta, setAlerta] = useState(false);
    const [alertaOK, setAlertaOK] = useState(false);
    const [alertaDelete, setDelete] = useState(false);
    const [alertaDeleteOK, setDeleteOK] = useState(false);
    const [alertaModificar, setModificar] = useState(false);
    const [alertaModificarOK, setModificarOK] = useState(false);
    const [visibilidadText, setVisibilidadText] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    const [datoText, setDatoText] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const datosUsuario = { id: location.state.prop1, nombre: location.state.prop2, adm: location.state.prop3 };

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        const nuevosDatos = { ...datos, [name]: value };

        setDatos(nuevosDatos);
    }


    useEffect(() => {

        async function getDatosBD() {

            let response = await fetch("php/proyectoFinal/Categoria/getCategoria.php",
                {
                    method: 'GET'
                });

            if (response.ok) {
                let respuesta = await response.json();
                setDatosBD(respuesta)

            }


        }

        getDatosBD();

    }, []);


    function agregarCategoria() {

        async function agregaCatg() {

            let datosGrabar = new FormData();
            datosGrabar.append("categoria", datos.categoria);

            if (datos.categoria === undefined || datos.categoria === "") {
                setAlerta(true);
            }
            else {

                let response = await fetch("php/proyectoFinal/Categoria/registrarCategoria.php",
                    {
                        body: datosGrabar,
                        method: 'POST'
                    });

                //let respuesta = await response.json();
                if (response.ok) {
                    setAlertaOK(true);
                }
                else {
                    alert("Ha habido un error a la hora de agregar la categoria");
                }

            }
        }
        agregaCatg();

    }


    function eliminarCategoria() {


        async function eliminarCatg() {

            let datosGrabar = new FormData();
            datosGrabar.append("categoriaElimi", selectedOption);

            if (selectedOption === ""|| selectedOption=== undefined) {
                setDelete(true);
            }
            else {
                console.log("Elmiar categoria")

                let response = await fetch("php/proyectoFinal/Categoria/eliminarCategoria.php",
                    {
                        body: datosGrabar,
                        method: 'POST'
                    });

                //let respuesta = await response.json();
                if (response.ok) {
                    setDeleteOK(true);
                }
                else {
                    alert("Ha habido un error a la hora de eliminar la categoria");
                }

            }
        }
        eliminarCatg()
    }


    function modificarCategoria(){

        async function modificarCatg() {

            let datosGrabar = new FormData();

            if (datos.ModCategoria === ""|| datos.ModCategoria === undefined) {
                setModificar(true);
            }
            else {
                /*console.log(selectedOption)
                console.log(datos.ModCategoria)*/
                datosGrabar.append("idCategoria", selectedOption);
                datosGrabar.append("nuevoNombre", datos.ModCategoria);
                let response = await fetch("php/proyectoFinal/Categoria/modificarCategoria.php",
                    {
                        body: datosGrabar,
                        method: 'POST'
                    });

                //let respuesta = await response.json();
                if (response.ok) {
                    setModificarOK(true);
                }
                else {
                    alert("Ha habido un error a la hora de eliminar la categoria");
                }

            }
        }
        modificarCatg()

    }


    return (
        <>
            <MiNavBar datos={datosUsuario} />
            <div>
                {location.state.prop4 === 1 && (

                    <>
                        {alertaOK && (
                            <Alert className="alertMui" onClose={() => { setAlertaOK(false);  window.location.reload();  }} severity="success">
                                Se ha agregado una nueva categoria
                            </Alert>
                        )}
                        {alerta && (
                            <Alert className="alertMui" onClose={() => { setAlerta(false) }} severity="error">
                                El campo del nombre de la categoria no puede estar vacio
                            </Alert>
                        )}

                        <div className='col-12  d-flex justify-content-center formularioIniReg'>
                            <div className="card" style={{ width: '25rem' }}>
                                <div className="card-body">
                                    <h3 className="card-title text-center my-3">Agregar categoria</h3>
                                    <Card variant="outlined">
                                        <React.Fragment>
                                            <CardContent className='tarjetaI'>
                                                <Box variant="h5" component="div" className='my-2'>
                                                    <div className="row my-1">
                                                        <TextField id="outlined-basic categoria" label="Categoria" variant="outlined" name="categoria" onChange={handleChange} />
                                                    </div>
                                                </Box>
                                            </CardContent>
                                        </React.Fragment>
                                    </Card>
                                    <button onClick={agregarCategoria} className="btn btn-primary mt-4 col-12">Aceptar</button>
                                </div>
                            </div>
                        </div>

                    </>


                )}
            </div>

            <div>
                {location.state.prop4 === 2 && (

                    <>
                        {alertaDeleteOK && (
                            <Alert className="alertMui" onClose={() => { setDeleteOK(false);  window.location.reload(); }} severity="success">
                                Se ha eliminado la categoria correctamente
                            </Alert>
                        )}
                        {alertaDelete && (
                            <Alert className="alertMui" onClose={() => { setDelete(false) }} severity="error">
                                Debes elegir una opcion adecuada
                            </Alert>
                        )}



                        <div className='col-12  d-flex justify-content-center formularioIniReg'>
                            <div className="card" style={{ width: '25rem' }}>
                                <div className="card-body">
                                    <h3 className="card-title text-center mt-3">Eliminar categoria</h3>
                                    <FormControl variant="outlined" className="w-100 mt-3 mb-3">
                                        <InputLabel id="category-select-label" >Selecciona una categoría</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            id="category-select"
                                            value={selectedOption}
                                            onChange={(e) => setSelectedOption(e.target.value)}
                                            label="Selecciona una categoría"
                                        >
                                            {datosBD.map((option, index) => (
                                                <MenuItem key={index} value={option.idCategoria}>
                                                    {option.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <button onClick={eliminarCategoria} className="btn btn-primary mt-4 col-12">Aceptar</button>
                                </div>
                            </div>
                        </div>

                    </>

                )}
            </div>

            <div>
                {location.state.prop4 === 3 && (
                    <>
                    {alertaModificarOK && (
                        <Alert className="alertMui" onClose={() => { setModificarOK(false);  window.location.reload(); }} severity="success">
                            Se ha modificado la categoria
                        </Alert>
                    )}
                    {alertaModificar && (
                        <Alert className="alertMui" onClose={() => { setModificar(false) }} severity="error">
                            El campo del nombre de la categoria no puede estar vacio
                        </Alert>
                    )}

                    <div className='col-12  d-flex justify-content-center formularioIniReg'>
                        <div className="card" style={{ width: '25rem' }}>
                            <div className="card-body">
                                <h3 className="card-title text-center my-3">Modificar categoria</h3>
                                <FormControl variant="outlined" className="w-100 mt-3 mb-3">
                                        <InputLabel id="category-select-label" >Selecciona una categoría</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                            id="category-select"
                                            value={selectedOption}
                                            onChange={(e) => {
                                                setSelectedOption(e.target.value); 
                                                setVisibilidadText(false); 
                                                /*setDatoText(datosBD.find(op => op.idCategoria === e.target.value).nombre)*/} }
                                            label="Selecciona una categoría"
                                        >
                                            {datosBD.map((option, index) => (
                                                <MenuItem key={index} value={option.idCategoria} data-key={option.idCategoria}>
                                                    {option.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                               <div className="row my-1">
                                  <TextField id="outlined-basic categoriaMod" label="Modificar categoria" variant="outlined" name="ModCategoria" onChange={handleChange} hidden={visibilidadText} />
                               </div>
                                          
                                <button onClick={modificarCategoria} className="btn btn-primary mt-4 col-12" hidden={visibilidadText}>Aceptar</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            </div>
        </>

    );
}