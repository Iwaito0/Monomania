<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$idCat = $_POST["idCategoria"];
$nombre = $_POST["nuevoNombre"];

// Insert SQL

$sql="UPDATE `categorias` SET `nombre`='$nombre' WHERE `idCategoria`='$idCat'";
$resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));


if (!$resultado){
    responderError( "Error al modificar la categoria: ".mysqli_error($conexion) ,$conexion);
} else {

       responder("Se a modificado con exito", $conexion);

}
?>