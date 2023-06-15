<?php
include('../config.php');

// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 
$idUsuario = $_POST["idUsuario"];
$adm = $_POST["adm"];
$nNumero = $_POST["nTarjetas"];
$sql="";

    if($adm==0){
            $sql="SELECT novelas.idNovelas, 
                         novelas.tituloEspanol,
                         novelas.tituloIngles,
                         novelas.tituloJapones,
                         novelas.capituloLeido,
                         novelas.capituloEstrenado,
                         novelas.enlace AS enlaceNov,
                         novelas.validado,
                         usuario_novelas.enlace,
                         usuario_novelas.capituloLeido
                         FROM `novelas` 
                         INNER JOIN `usuario_novelas`
                         WHERE usuario_novelas.idNovelas=novelas.idNovelas AND usuario_novelas.idUsuario=$idUsuario
                         LIMIT $nNumero;";          
    }
    else{
        $sql="SELECT novelas.idNovelas, 
                     novelas.tituloEspanol,
                     novelas.tituloIngles,
                     novelas.tituloJapones,
                     novelas.capituloLeido,
                     novelas.capituloEstrenado,
                     novelas.enlace AS enlaceNov,
                     novelas.validado
                     FROM `novelas` 
                     WHERE  validado=0 LIMIT $nNumero;";
    }
    
    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

    if (!$resultado){
        responderError( "Error al recuperar las novelas: ".mysqli_error($conexion) ,$conexion);
    } else {
        $datos = []; 

        while ($fila = mysqli_fetch_assoc($resultado)) { 
            $datos[] = $fila;
        }

        //responder($datos, $conexion);
        echo json_encode($datos);
    }
?>