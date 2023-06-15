import { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';


export default function AvatarIMGPrinci({ rutaAPI }) {
    const [dato, setDato] = useState("");
    const [fotoHay, setFotoHay] = useState(-1);
    const [datosUsuario, setDatosUsuario] = useState([]);

    useEffect(() => {

        async function fetchDatos(ruta) {

            let response = await fetch(ruta);

            if (response.ok) {
                let imagenBlob = await response.blob();
                let imagenUrl = URL.createObjectURL(imagenBlob);

                if (imagenBlob.size === 0 || imagenBlob.type === '') {
                    setFotoHay(-1)
                }
                else {
                    setFotoHay(0)
                }

                setDato(imagenUrl);

            }
        }

        fetchDatos(rutaAPI);

    }, [rutaAPI])

    useEffect(() => {

        async function fetchDatosUsuario(ruta) {

            var cadena2 = ruta.split("=")

            let idUsuario = new FormData();
            idUsuario.append("idUsuario", cadena2[1]);

            let response = await fetch(`php/proyectoFinal/Usuario/getDatosUsuario.php`, {
                body: idUsuario,
                method: 'POST'
            });

            if (response.ok) {

                let respuesta = await response.json();
                setDatosUsuario(respuesta);
            }
        }

        fetchDatosUsuario(rutaAPI);

    }, [])


    return (

        <>
            {datosUsuario.length !== 0 && (
                <>
                    {fotoHay === -1 && (

                        <Avatar alt={datosUsuario[0]["nombreUsuario"]} src="ninguna Foto" sx={{ width: 280, height: 280 }} />

                    )}
                    {fotoHay !== -1 && (

                        <Avatar alt={datosUsuario[0]["nombreUsuario"]} src={dato} sx={{ width: 280, height: 280 }} />

                    )}
                </>
            )}

        </>
    );
}