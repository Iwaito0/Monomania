import MiNavBar from "../MiNavBar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    ListItemButton, ListItemText, ListItemIcon, Box, ThemeProvider, createTheme, Paper
    , styled, List, Divider, Checkbox, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses
} from "@mui/material";
import { grey } from '@mui/material/colors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ArrowBack } from "@mui/icons-material";

export default function ListadoCatNov() {
    const location = useLocation();
    const datosUsuario = { id: location.state.prop1, nombre: location.state.prop2, adm: location.state.prop3 };
    const [datosBD, setDatosBD] = useState([]);
    const [visibilidadListaCategoria, setVisibilidadListaCategoria] = useState(true);
    const [visibilidadListado, setVisibilidadListado] = useState(false);
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState([]);
    const [btnDispo, setbBtnDispo] = useState(true);
    const [datosBDListado, setDatosBDListado] = useState([]);


    // console.log(datosUsuario)
    //console.log(location.state.prop4);

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

    const handleToggle = (valueID) => () => {

        const currentIndex = checked.indexOf(valueID);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(valueID);
        } else {
            newChecked.splice(currentIndex, 1);

        }
        setChecked(newChecked);

    };

    useEffect(() => {
        if (!checked.length == 0) {
            setbBtnDispo(false);
        }
        else {
            setbBtnDispo(true);
        }

    }, [checked]);


    const FireNav = styled(List)({
        '& .MuiListItemButton-root': {
            paddingLeft: 24,
            paddingRight: 24,
        },
        '& .MuiListItemIcon-root': {
            minWidth: 0,
            marginRight: 16,
        },
        '& .MuiSvgIcon-root': {
            fontSize: 20,
        },
    });

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    }));

    async function listadoNov() {
        if (checked[0] == 0) {
            checked.shift();
        }
        let datos = new FormData();
        datos.append("categ", checked);


        let response = await fetch(`php/proyectoFinal/Novela/getDatosListadoNovelas.php`, {
            body: datos,
            method: 'POST'
        });

        if (response.ok) {
            //let respuesta = await response.json();
            setVisibilidadListado(true);
            setVisibilidadListaCategoria(false);
            let respuesta = await response.json();
            setDatosBDListado(respuesta);
        }

    }

    function paraAtras() {
        setVisibilidadListado(false);
        setVisibilidadListaCategoria(true);
    }

    return (
        <>
            <MiNavBar datos={datosUsuario} />

            {visibilidadListado && (
                <>
                    <TableContainer component={Paper} className="mx-0 mt-3">
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" className="tablaList" sx={{ color: grey[50] }}>Titulo en Español</TableCell>
                                    <TableCell align="center" className="tablaList" sx={{ color: grey[50] }}>Titulo en Ingles</TableCell>
                                    <TableCell align="center" className="tablaList" sx={{ color: grey[50] }}>Titulo en Japones</TableCell>
                                    <TableCell align="center" className="tablaList" sx={{ color: grey[50] }}>Capitulo estrenado</TableCell>
                                    <TableCell align="center" className="tablaList" sx={{ color: grey[50] }}>Enlace</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {datosBDListado.map((row) => (
                                    <StyledTableRow key={row.idNovelas}>
                                        <StyledTableCell align="center"> {row.tituloEspanol}</StyledTableCell>
                                        <StyledTableCell align="center">{row.tituloIngles}</StyledTableCell>
                                        <StyledTableCell align="center">{row.tituloJapones}</StyledTableCell>
                                        <StyledTableCell align="center">{row.capituloEstrenado}</StyledTableCell>
                                        <StyledTableCell align="center">{row.Enlace}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <button className="mx-4 my-4">
                        <ArrowBack fontSize="large" className="mx-2 my-2"  onClick={paraAtras} />
                    </button>


                </>
            )}
            {visibilidadListaCategoria && (

                <div className='col-12  d-flex justify-content-center formularioIniReg'>
                    <div className="card" style={{ width: '25rem' }}>
                        <div className="card-body">

                            <h2 className="card-title text-center mt-3">Listar novelas</h2>


                            <h4 className="card-title text-center mt-3">Elige una categoria</h4>

                            <Box sx={{ display: 'flex', marginTop: '5%' }} className="justify-content-center">
                                <ThemeProvider
                                    theme={createTheme({
                                        palette: {
                                            mode: 'dark',
                                        },
                                    })}
                                >
                                    <Paper elevation={0} >
                                        <FireNav component="nav" disablePadding>

                                            <Divider />
                                            <Box
                                                sx={{
                                                    bgcolor: open ? 'rgba(71, 98, 130, 0.2)' : null,
                                                    pb: open ? 2 : 0,
                                                }}
                                            >
                                                <ListItemButton
                                                    alignItems="flex-start"
                                                    onClick={() => setOpen(!open)}
                                                    sx={{
                                                        px: 3,
                                                        pt: 2.5,
                                                        pb: open ? 0 : 2.5,
                                                        '&:hover, &:focus': { '& svg': { opacity: open ? 1 : 0 } },
                                                    }}>

                                                    <ListItemText
                                                        primary="Selecione una categoria"
                                                        primaryTypographyProps={{
                                                            fontSize: 15,
                                                            fontWeight: 'medium',
                                                            lineHeight: '20px',
                                                            mb: '2px',
                                                        }}
                                                    />

                                                    {
                                                        open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
                                                    }

                                                </ListItemButton>
                                                {open &&
                                                    datosBD.map((item) => (
                                                        <ListItemButton role={undefined} key={item.nombre} onClick={handleToggle(item.idCategoria)} dense>
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={checked.indexOf(item.idCategoria) !== -1}
                                                                    tabIndex={-1}
                                                                    disableRipple
                                                                    inputProps={{ 'aria-labelledby': item.nombre }}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText id={item.idCategoria} primary={item.nombre} />
                                                        </ListItemButton>
                                                    ))}
                                            </Box>
                                        </FireNav>
                                    </Paper>
                                </ThemeProvider>
                            </Box>
                            <button onClick={listadoNov} className="btn btn-dark mt-4 col-12" disabled={btnDispo}>Aceptar</button>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
}