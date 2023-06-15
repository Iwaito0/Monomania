<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$tablaIdUsuario ="(". $_POST["arrayIds"].")";


    $sql="SELECT * FROM `peliculas_categoria` WHERE idpelicula IN $tablaIdUsuario";

   $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

   if (!$resultado){
    responderError( "Error al recuperar las peliculas: ".mysqli_error($conexion) ,$conexion);
} else {

    $datos = []; // Creamos un array vacío
    //Recorremos los registros que ha devuelto la base de datos
    while ($fila = mysqli_fetch_assoc($resultado)) { 
        // Almacenamos en un array cada una de las filas que vamos leyendo del recordset.
        $datos[] = $fila;
    }
    
    //responder($datos, $conexion);
    echo json_encode($datos);
}

?>