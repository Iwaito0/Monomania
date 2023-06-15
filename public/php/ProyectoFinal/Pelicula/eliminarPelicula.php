<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos();

// Recuperamos los parámetros de la petición
$pelicula = $_POST["idPelicula"];
$usuario = $_POST["idUsuario"];
$adm = $_POST["adm"];




$sql = "SELECT idPelicula FROM `peliculas` WHERE idPelicula='$pelicula';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
$row_cnt = $resultado->num_rows;

if($row_cnt!=0){
    if ($adm == 0) {
        $sql = "DELETE FROM `usuario_pelicula` WHERE idUsuario='$usuario' AND idPelicula='$pelicula'";
        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

        if (!$resultado) {
            responderError("Error al eliminar la pelicula: " . mysqli_error($conexion), $conexion);
        } else {

            $sql = "SELECT validado FROM `peliculas` WHERE idPelicula='$pelicula';";
            $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

            if (!$resultado) {
                responderError("Error al borrar una pelicula: " . mysqli_error($conexion), $conexion);
            } 
            else {
                $pru = mysqli_fetch_assoc($resultado);
                $validacion;

                foreach ($pru as $row) {
                    $validacion = $row . "<br />";
                }

                if (intval($validacion) != 1){
                    //Aqui entraria los PV y los NV

                    $sql = "DELETE FROM `peliculas_categoria` WHERE idpelicula='$pelicula';";
                    $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                    if (!$resultado) {
                        responderError("Error al eliminar la pelicula: " . mysqli_error($conexion), $conexion);
                    } 
                    else {

                        $sql="DELETE FROM `peliculas` WHERE idPelicula='$pelicula';";
                        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                        if (!$resultado) {
                            responderError("Error al eliminar la pelicula: " . mysqli_error($conexion), $conexion);
                        }
                        else { 
                            responder("Se ha eliminado correctamente", $conexion);
                        }
                    }
                }
                else{
                    responder("Se ha eliminado correctamente", $conexion);
                }
            }
        }
    } 
    else {

        $sql = "DELETE FROM `peliculas_categoria` WHERE idpelicula='$pelicula';";
        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

        if (!$resultado) {
            responderError("Error al eliminar la pelicula: " . mysqli_error($conexion), $conexion);
        } 
        else {
            $sql = "DELETE FROM `usuario_pelicula` WHERE idPelicula='$pelicula';";
            $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

            if (!$resultado) {
                responderError("Error al eliminar la pelicula: " . mysqli_error($conexion), $conexion);
            }
            else { 

                $sql="DELETE FROM `peliculas` WHERE idPelicula='$pelicula';";
                $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                if (!$resultado) {
                    responderError("Error al eliminar la pelicula: " . mysqli_error($conexion), $conexion);
                }
                else { 
                    responder("Se ha eliminado correctamente", $conexion);
                }
            }
        }    
    }
}
else{
    responderError( "No se ha podido eliminar. El ususario administrador ya elimino esta pelicula: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );


}
