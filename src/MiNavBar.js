import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Badge, Box, Tooltip, IconButton, Avatar, Menu, Typography, MenuItem } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { red } from '@mui/material/colors';
import AvatarIMG from './AvatarIMG';
import { DisabledByDefault } from '@mui/icons-material';

export default function MiNavBar(datos) {
    const navigate = useNavigate();
    const props = {
        prop1: datos["datos"]["id"],
        prop2: datos["datos"]["nombre"],
        prop3: datos["datos"]["adm"]
    }
    const [nPeliculasValidar, setNPeliculasValidar] = useState("");
    const [nNovelasValidar, setNNovelasValidar] = useState("");
    const [anchorElUser, setAnchorElUser] = React.useState(null);


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    function haciaFuera() {
        navigate('/');
    }

    function haciaHome() {
        navigate('/home', { state: props });
    }

    function haciaPeliculas() {
        navigate('/peliculas', { state: props });
    }
    function haciaNuevaPelicula() {
        navigate('/agregaPelicula', { state: props });

    }
    function haciaNovelas() {
        navigate('/novelas', { state: props });
    }
    function haciaNuevaNovela() {
        navigate('/agregaNovela', { state: props });
    }
    function haciaCategoria() {
        props.prop4 = 1;
        navigate('/categoria', { state: props });
    }
    function haciaCategoriaEli() {
        props.prop4 = 2;
        navigate('/categoria', { state: props });
    }
    function haciaCategoriaMod() {
        props.prop4 = 3;
        navigate('/categoria', { state: props });
    }
    function haciaPeliList() {
        props.prop4 = 'pel';
        navigate('/listadoAll', { state: props });
    }
    function haciaNovList() {
        props.prop4 = 'nov';
        navigate('/listadoAll', { state: props });
    }
    function haciaPelCat() {
        props.prop4 = 'pel';
        navigate('/listadoCatPel', { state: props });
    }
    function haciNovCat() {
        props.prop4 = 'nov';
        navigate('/listadoCatNov', { state: props });
    }

    useEffect(() => {

        async function getnNovelasPV() {


            let response = await fetch(`php/proyectoFinal/Novela/getNNovelasPV.php`, {
                method: 'GET'
            });

            if (response.ok) {
                //let respuesta = await response.json();
                let respuesta = await response.json();
                setNNovelasValidar(respuesta);
            }
        }
        getnNovelasPV();

    }, []);

    useEffect(() => {

        async function getnPeliculasPV() {


            let response = await fetch(`php/proyectoFinal/Pelicula/getNPeliculasPV.php`, {
                method: 'GET'
            });

            if (response.ok) {
                //let respuesta = await response.json();
                let respuesta = await response.json();
                setNPeliculasValidar(respuesta);
            }
        }
        getnPeliculasPV();

    }, []);



    window.onload = function () {
        document.addEventListener("contextmenu", function (e) {
            e.preventDefault();
        }, false)
    }


    const bar = document.getElementById("barraNavegacion");
    if (bar != null) {
        bar.oncontextmenu = new Function("return false");
    }

    return (

        <nav id="barraNavegacion" className="navbar navbar-dark navbar-expand-lg bg-dark ">
            <div className="container-fluid">
                <a className="navbar-brand blanco" href=" " >

                    <Button style={{ color: 'white' }} key={`Home`} color="inherit" onClick={haciaHome}>
                        <Avatar alt="Remy Sharp" src="Monomaniat.png" sx={{ width: 60, height: 60 }} />
                    </Button>

                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon " />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ">
                        <li className="nav-item">
                            <a className="nav-link blanco" aria-current="page" href=" ">
                                {datos["datos"]["adm"] == 1 && (
                                    <Badge color='error' badgeContent={nNovelasValidar}>
                                        <Button style={{ color: 'white' }} key={`lNovelas`} color="inherit" onClick={haciaNovelas}>
                                            Listar novelas
                                        </Button>
                                    </Badge>
                                )}
                                {datos["datos"]["adm"] == 0 && (
                                    <Button style={{ color: 'white' }} key={`lNovelas`} color="inherit" onClick={haciaNovelas}>
                                        Listar novelas
                                    </Button>
                                )}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link blanco" href=" " >
                                {datos["datos"]["adm"] == 1 && (
                                    <Badge color='error' badgeContent={nPeliculasValidar}>
                                        <Button style={{ color: 'white' }} key={`lPeliculas`} color="inherit" onClick={haciaPeliculas}>
                                            Listar peliculas
                                        </Button>
                                    </Badge>
                                )}
                                {datos["datos"]["adm"] == 0 && (
                                    <Button style={{ color: 'white' }} key={`lPeliculas`} color="inherit" onClick={haciaPeliculas}>
                                        Listar peliculas
                                    </Button>
                                )}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link blanco" href=" " >
                                <Button key={`nNovelaNueva`} color="inherit" onClick={haciaNuevaNovela}>
                                    Agregar novela
                                </Button>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link blanco" href=" " >
                                <Button key={`nPeliculaNueva`} color="inherit" onClick={haciaNuevaPelicula}>
                                    Agregar pelicula
                                </Button>
                            </a>
                        </li>
                        {datos["datos"]["adm"] == 1 && (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle blanco" href=" " role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <Button key={`categoria`} color="inherit" >
                                        Categoria
                                    </Button>
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Button key={`AgrCategoria`} color="inherit" onClick={haciaCategoria}>
                                            Agregar
                                        </Button>
                                    </li>
                                    <li>
                                        <Button key={`EliCategoria`} color="inherit" onClick={haciaCategoriaEli}>
                                            Eliminar
                                        </Button>
                                    </li>
                                    <li>
                                        <Button key={`ModCategoria`} color="inherit" onClick={haciaCategoriaMod}>
                                            Modificar
                                        </Button>
                                    </li>
                                </ul>
                            </li>)}
                        <li className="nav-item dropdown" >
                            <a className="nav-link dropdown-toggle blanco" href=" " role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <Button key={`categoria`} color="inherit" >
                                    Listados
                                </Button>
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <Button key={`listPelicula`} color="inherit" onClick={haciaPeliList}>
                                        Listar peliculas verificadas
                                    </Button>
                                </li>
                                <li>
                                    <Button key={`listNovela`} color="inherit" onClick={haciaNovList}>
                                        Listar novelas verificadas
                                    </Button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Button key={`listPelicula`} color="inherit" onClick={haciaPelCat}>
                                        Listar peliculas por categorias
                                    </Button>
                                </li>
                                <li>
                                    <Button key={`listNovela`} color="inherit" onClick={haciNovCat}>
                                        Listar novelas por categorias
                                    </Button>
                                </li>
                            </ul>
                        </li>

                        {/*Avatar */}
                        <li className="nav-item ">
                            <div className='idem'>
                                <IconButton onClick={handleOpenUserMenu} sx={{ marginTop: "15%" }}>
                                    <AvatarIMG rutaAPI={"php/proyectoFinal/Usuario/verFotoUsuario.php?n=" + datos["datos"]["id"]} />
                                </IconButton>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem key={"perfil"} onClick={haciaHome}>
                                        <Typography textAlign="center">Perfil</Typography>
                                    </MenuItem>
                                    <MenuItem key={"Cerrar Session"} onClick={haciaFuera}>
                                        <Typography textAlign="center">Cerrar sesión</Typography>
                                    </MenuItem>
                                </Menu>
                            </div>

                            {/*Fin Avatar */}


                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
}

