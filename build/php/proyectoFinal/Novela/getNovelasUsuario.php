<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

$idUsuario = $_POST["idUsuario"];

    $sql="SELECT idNovelas FROM `usuario_novelas` WHERE idUsuario='$idUsuario';";
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
        $sql2="SELECT idNovelas,tituloEspanol,tituloIngles,tituloJapones FROM `novelas` WHERE validado=true;";
        $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
    }
    else{
        $cadenaNovID="(";
        foreach($datos as $valor){
            $cadenaNovID.=$valor['idNovelas'].",";
        }
        $cadenaNovID = substr($cadenaNovID, 0, strlen($cadenaNovID) - 1);
        $cadenaNovID.=")";
        $sql2="SELECT idNovelas,tituloEspanol,tituloIngles,tituloJapones FROM `novelas` WHERE idNovelas NOT IN $cadenaNovID AND validado=true;";
        $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
    }

    if (!$resultado){
        responderError( "Error al recuperar las novelas: ".mysqli_error($conexion) ,$conexion);
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