<?php
include('../config.php');
// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$idNovelas=$_GET['n'];
$idUsu=$_GET['p'];


$sql = "SELECT * FROM `novelas` WHERE idNovelas='$idNovelas';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

if (!$resultado) {
    responderError("Error al conseguir la imagen de la novela " . mysqli_error($conexion), $conexion);
} 
else{

    $sql2 = "SELECT * FROM `usuario_novelas` WHERE idNovelas='$idNovelas' AND idUsuario='$idUsu';";
    $resultado2 = mysqli_query($conexion, $sql2) or die(mysqli_error($conexion));

    if (!$resultado2) {
        responderError("Error al conseguir la imagen de la novela " . mysqli_error($conexion), $conexion);
    } 
    else{
        $fila2 = mysqli_fetch_assoc($resultado2);

        if($fila2['Foto']==null){

            $fila = mysqli_fetch_assoc($resultado);
            $tipo_foto=$fila['formato'];
            header("Content-type: $tipo_foto");
            echo $fila['foto'];
        }
        else{
            $tipo_foto2=$fila2['formato'];
            header("Content-type: $tipo_foto2");
            echo $fila2['Foto'];
        }
    }
 
}

?>
