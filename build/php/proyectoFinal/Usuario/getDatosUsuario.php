<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$idUsu=$_POST["idUsuario"];

    $sql="SELECT nombre, apellidos, nombreUsuario, correElectronico, Fecha FROM `usuario` WHERE idUsuario='$idUsu';";

    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

    if (!$resultado){
        responderError( "Error al recuperar los usuarios: ".mysqli_error($conexion) ,$conexion);
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