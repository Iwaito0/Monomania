<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$categ = $_POST["categoriaElimi"];

$sql="DELETE FROM `novelas_categoria` WHERE idCategoria='$categ';";
$resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

if (!$resultado){
    responderError( "Error al eliminar la categoria: ".mysqli_error($conexion) ,$conexion);
} 


$sql="DELETE FROM `peliculas_categoria` WHERE idCategoria='$categ';";
$resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

if (!$resultado){
    responderError( "Error al eliminar la categoria: ".mysqli_error($conexion) ,$conexion);
} 
   

$sql="DELETE FROM `categorias` WHERE idCategoria='$categ';";
$resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

if (!$resultado){
    responderError( "Error al eliminar la categoria: ".mysqli_error($conexion) ,$conexion);
} 
else {

            
    responder("Se a eliminado con exito", $conexion);

}
       
?>