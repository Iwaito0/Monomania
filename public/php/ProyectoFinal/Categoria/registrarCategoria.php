<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$categoria = $_POST["categoria"];

    $sql="INSERT INTO `categorias`(`nombre`) 
                              VALUES ('$categoria')";


    $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
    
    // Devolvemos el resultado
    if (!$resultado){
        responderError( "Error al agregar una categoria: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
    } else {
        responder("Se ha agregado correctamente", $conexion);
    }
  


?>