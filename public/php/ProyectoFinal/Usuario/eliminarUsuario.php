<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos();

// Recuperamos los parámetros de la petición
$usuario = $_POST["id"];


//Borrado de peliculas
$sql = "SELECT idPelicula FROM `usuario_pelicula` WHERE idUsuario='$usuario' ";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

if (!$resultado) {
    responderError("Error al encontrar el ususario: " . mysqli_error($conexion), $conexion);
} 
else {

    while ($fila = mysqli_fetch_assoc($resultado)) { 
        // Almacenamos en un array cada una de las filas que vamos leyendo del recordset.
        $validacion[] = $fila["idPelicula"];
    }
    

    //print_r($validacion);

    foreach ($validacion as $row) {
        $id = $row;


        $sql = "SELECT validado FROM `peliculas` WHERE idPelicula='$id';";
        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

        if (!$resultado) {
            responderError("Error al encontrar las peliuclas " . mysqli_error($conexion), $conexion);
        } 
        else {
            $validacionPel = mysqli_fetch_assoc($resultado);

            if (intval($validacionPel["validado"]) != 1){
                //Aqui entraria los PV y los NV
                $sql = "DELETE FROM `usuario_pelicula` WHERE idPelicula='$id' AND idUsuario='$usuario'";               
                $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                if (!$resultado) {
                    responderError("Error al borrar las peliculas del usuario: " . mysqli_error($conexion), $conexion);
                }
                else{

                    $sql = "DELETE FROM `peliculas_categoria` WHERE idpelicula='$id';";
                    $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                    if (!$resultado) {
                        responderError("Error al las categorias de la peliculas: " . mysqli_error($conexion), $conexion);
                    }
                    else{

                        $sql = "DELETE FROM `peliculas` WHERE idPelicula='$id';";
                        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                        if (!$resultado) {
                            responderError("Error al borrar las peliculas " . mysqli_error($conexion), $conexion);
                        }
                    }

                }            
            }
            else{
                //Aqui entraria los validados
                $sql = "DELETE FROM `usuario_pelicula` WHERE idPelicula='$id' AND idUsuario='$usuario'";
                $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                if (!$resultado) {
                    responderError("Error al borrar las peliculas del usuario: " . mysqli_error($conexion), $conexion);
                }
            }
        }
    }
}





//Borrado de novelas
$sql = "SELECT idNovelas FROM `usuario_novelas` WHERE idUsuario='$usuario' ";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

if (!$resultado) {
    responderError("Error al encontrar el ususario: " . mysqli_error($conexion), $conexion);
} 
else {

    while ($fila = mysqli_fetch_assoc($resultado)) { 
        // Almacenamos en un array cada una de las filas que vamos leyendo del recordset.
        $validacion[] = $fila["idNovelas"];
    }
    

    //print_r($validacion);

    foreach ($validacion as $row) {
        $id = $row;

        $sql = "SELECT validado FROM `novelas` WHERE idNovelas='$id';";
        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

        if (!$resultado) {
            responderError("Error al encontrar las novelas: " . mysqli_error($conexion), $conexion);
        } 
        else {
            $validacionPel = mysqli_fetch_assoc($resultado);

            if (intval($validacionPel["validado"]) != 1){
                //Aqui entraria los PV y los NV
                $sql = "DELETE FROM `usuario_novelas` WHERE idNovelas='$id' AND idUsuario='$usuario'";               
                $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                if (!$resultado) {
                    responderError("Error al borrar las novelas del usuario: " . mysqli_error($conexion), $conexion);
                }
                else{

                    $sql = "DELETE FROM `novelas_categoria` WHERE idNovelas='$id';";
                    $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                    if (!$resultado) {
                        responderError("Error al borrar las categorias de la novela:  " . mysqli_error($conexion), $conexion);
                    }
                    else{

                        $sql = "DELETE FROM `novelas` WHERE idNovelas='$id';";
                        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                        if (!$resultado) {
                            responderError("Error al borrar las novelas: " . mysqli_error($conexion), $conexion);
                        }
                    }

                }            
            }
            else{
                //Aqui entraria los validados
                $sql = "DELETE FROM `usuario_novelas` WHERE idNovelas='$id' AND idUsuario='$usuario'";
                $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

                if (!$resultado) {
                    responderError("Error al borrar las novelas del usuario: " . mysqli_error($conexion), $conexion);
                }
            }
        }
    }
}

$sql = "DELETE FROM `usuario` WHERE idUsuario='$usuario' ";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

if (!$resultado) {
    responderError("Error al borrar el ususario: " . mysqli_error($conexion), $conexion);
}
else{
    responder("Se ha eliminado correctamente", $conexion);
}



?>