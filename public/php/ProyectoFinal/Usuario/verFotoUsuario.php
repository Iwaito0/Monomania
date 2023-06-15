<?php
include('../config.php');
// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$idPelicula=$_GET['n'];

$sql = "SELECT * FROM `usuario` WHERE idUsuario='$idPelicula';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

if (!$resultado) {
    responderError("Error al conseguir la imagen del usuario " . mysqli_error($conexion), $conexion);
} 
else{

        $fila2 = mysqli_fetch_assoc($resultado);

        $tipo_foto2=$fila2['formato'];
        header("Content-type: $tipo_foto2");
        echo $fila2['foto'];        

}

?>
