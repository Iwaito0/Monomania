<?php
include('../config.php');

// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

            $sql="SELECT idPelicula, titulo, tituloIngles, fechaEstreno FROM `peliculas` WHERE validado = 1;";
                        

    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

    if (!$resultado){
        responderError( "Error al recuperar las peliculas: ".mysqli_error($conexion) ,$conexion);
    } else {
        $datos = []; 

        while ($fila = mysqli_fetch_assoc($resultado)) { 
            $datos[] = $fila;
        }

        //responder($datos, $conexion);
        echo json_encode($datos);
    }
?>