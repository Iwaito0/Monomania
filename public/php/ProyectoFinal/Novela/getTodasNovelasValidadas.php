<?php
include('../config.php');

// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

            $sql="SELECT idNovelas, tituloEspanol, tituloIngles, tituloJapones, capituloEstrenado, enlace FROM `novelas` WHERE validado = 1;";
                        

    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

    if (!$resultado){
        responderError( "Error al recuperar las novelas: ".mysqli_error($conexion) ,$conexion);
    } else {
        $datos = []; 

        while ($fila = mysqli_fetch_assoc($resultado)) { 
            $datos[] = $fila;
        }

        //responder($datos, $conexion);
        echo json_encode($datos);
    }
?>