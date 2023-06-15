import { useState, useEffect } from 'react';
import { CardMedia } from '@mui/material';


export default function Tabla({ rutaAPI }) {
    const [dato, setDato] = useState("");
    const [fotoHay, setFotoHay] = useState(-1);

    useEffect(() => {

        async function fetchDatos(ruta) {
            let response = await fetch(ruta);

            if (response.ok) {
                let imagenBlob = await response.blob();
                let imagenUrl = URL.createObjectURL(imagenBlob);
                if (imagenBlob.size === 0 || imagenBlob.type === '' ) {
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


    return (
        <>
            {fotoHay === -1 && (
                <CardMedia
                    component="img"
                    height="360"
                    image="NIMG.svg"
                    alt="foto"
                />
            )}
            {fotoHay !== -1 && (
                <CardMedia
                    component="img"
                    height="360"
                    image={dato}
                    alt={fotoHay}
                />
            )}
        </>
    );
}