<?php
include('../config.php');
// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$idNovelas=$_GET['n'];

$sql = "SELECT * FROM `novelas` WHERE idNovelas='$idNovelas';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

if (!$resultado) {
    responderError("Error al conseguir la imagen de la novela " . mysqli_error($conexion), $conexion);
} 
else{

    $fila = mysqli_fetch_assoc($resultado);
    $tipo_foto=$fila['formato'];
    header("Content-type: $tipo_foto");
    echo $fila['foto']; 
}

?>
