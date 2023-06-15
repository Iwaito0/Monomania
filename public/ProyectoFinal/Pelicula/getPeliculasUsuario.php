<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$idUsuario = $_POST["idUsuario"];

    $sql="SELECT idPelicula FROM `usuario_pelicula` WHERE idUsuario='$idUsuario';";
    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));
    if ($resultado){
        $datos = []; // Creamos un array vacío
        //Recorremos los registros que ha devuelto la base de datos
        while ($fila = mysqli_fetch_assoc($resultado)) { 
            // Almacenamos en un array cada una de las filas que vamos leyendo del recordset.
            $datos[] = $fila;
        }

    }
    if(empty($datos)){
        $sql2="SELECT idPelicula,titulo,tituloIngles FROM `peliculas` WHERE validado=true;";
        $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
    }
    else{
        $cadenaPelID="(";
        foreach($datos as $valor){
            $cadenaPelID.=$valor['idPelicula'].",";
        }
        $cadenaPelID = substr($cadenaPelID, 0, strlen($cadenaPelID) - 1);
        $cadenaPelID.=")";
        $sql2="SELECT idPelicula,titulo,tituloIngles FROM `peliculas` WHERE idPelicula NOT IN $cadenaPelID AND validado=true;";
        $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
    }

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