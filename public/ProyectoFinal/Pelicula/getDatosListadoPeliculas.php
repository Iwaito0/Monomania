<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 
//$categorias = explode(",", $_POST["categorias"]);

$categ = $_POST["categ"];


    $cadenaPelID="(";
    $cadenaPelID.=$categ;
    $cadenaPelID.=")";
    //echo $cadenaPelID;

    $sql2="SELECT DISTINCT peliculas.idPelicula,titulo,tituloIngles,fechaEstreno 
            FROM `peliculas` 
            INNER JOIN `peliculas_categoria` 
            WHERE peliculas_categoria.idpelicula=peliculas.idPelicula 
            AND peliculas_categoria.idCategoria  IN  $cadenaPelID AND validado=true;";
    $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
    

    if (!$resultado){
        responderError( "Error al recuperar las peliculas: ".mysqli_error($conexion) ,$conexion);
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