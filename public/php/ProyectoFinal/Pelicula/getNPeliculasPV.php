<?php
include('../config.php');

// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

            $sql="SELECT COUNT(idPelicula) FROM `peliculas` WHERE validado=0";
                        

    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

    if (!$resultado){
        responderError( "Error el numero de las peliculas: ".mysqli_error($conexion) ,$conexion);
    } 
    else {

            while ($fila = mysqli_fetch_array($resultado)) {
                $numero = $fila[0]; 
            }
            echo json_encode($numero);




     

        
    }
?>