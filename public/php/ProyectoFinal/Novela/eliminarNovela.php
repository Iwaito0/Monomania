<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos();

// Recuperamos los parámetros de la petición
$novela = $_POST["idNovela"];
$usuario = $_POST["idUsuario"];
$adm = $_POST["adm"];



$sql = "SELECT idNovelas FROM `novelas` WHERE idNovelas='$novela';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
$row_cnt = $resultado->num_rows;

if($row_cnt!=0){
    if ($adm == 0) {
        $sql = "DELETE FROM `usuario_novelas` WHERE idUsuario='$usuario' AND idNovelas='$novela'";
        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

        if (!$resultado) {
            responderError("Error al eliminar la novela: " . mysqli_error($conexion), $conexion);
        } else {

            $sql = "SELECT validado FROM `novelas` WHERE idNovelas='$novela';";
            $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

            if (!$resultado) {
                responderError("Error al borrar una novela: " . mysqli_error($conexion), $conexion);
            } 
            else {
                $pru = mysqli_fetch_assoc($resultado);
                $validacion;

                foreach ($pru as $row) {
                    $validacion = $row . "<br />";
                }

                if (intval($validacion) != 1){
                    //Aqui entraria los PV y los NV

                    $sql = "DELETE FROM `novelas_categoria` WHERE idNovelas='$novela';";
                    $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                    if (!$resultado) {
                        responderError("Error al eliminar la novela: " . mysqli_error($conexion), $conexion);
                    } 
                    else {

                        $sql="DELETE FROM `novelas` WHERE idNovelas='$novela';";
                        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                        if (!$resultado) {
                            responderError("Error al eliminar la novela: " . mysqli_error($conexion), $conexion);
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

        $sql = "DELETE FROM `novelas_categoria` WHERE idNovelas='$novela';";
        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

        if (!$resultado) {
            responderError("Error al eliminar la novela: " . mysqli_error($conexion), $conexion);
        } 
        else {
            $sql = "DELETE FROM `usuario_novelas` WHERE idNovelas='$novela';";
            $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

            if (!$resultado) {
                responderError("Error al eliminar la novela: " . mysqli_error($conexion), $conexion);
            }
            else { 

                $sql="DELETE FROM `novelas` WHERE idNovelas='$novela';";
                $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                if (!$resultado) {
                    responderError("Error al eliminar la novela: " . mysqli_error($conexion), $conexion);
                }
                else { 
                    responder("Se ha eliminado correctamente", $conexion);
                }
            }
        }
  
    }
}
else{
    responderError( "No se ha podido eliminar. El ususario administrador ya elimino esta novela: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );

}

