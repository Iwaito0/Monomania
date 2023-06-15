<?php
include('../config.php');

// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

            $sql="SELECT COUNT(idNovelas) FROM `novelas` WHERE validado=0";
                        

    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

    if (!$resultado){
        responderError( "Error al recuperar el numero de las novelas: ".mysqli_error($conexion) ,$conexion);
    } 
    else {

            while ($fila = mysqli_fetch_array($resultado)) {
                $numero = $fila[0]; 
            }
            echo json_encode($numero);




     

        
    }
?>