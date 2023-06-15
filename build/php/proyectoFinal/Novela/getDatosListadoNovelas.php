<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 
//$categorias = explode(",", $_POST["categorias"]);

$categ = $_POST["categ"];


    $cadenaNovID="(";
    $cadenaNovID.=$categ;
    $cadenaNovID.=")";
    //echo $cadenaPelID;

    $sql2="SELECT DISTINCT novelas.idNovelas,tituloEspanol,tituloIngles,tituloJapones,capituloEstrenado, Enlace 
            FROM `novelas` 
            INNER JOIN `novelas_categoria` 
            WHERE novelas_categoria.idNovelas=novelas.idNovelas 
            AND novelas_categoria.idCategoria  IN  $cadenaNovID AND validado=true;";
    $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
    

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