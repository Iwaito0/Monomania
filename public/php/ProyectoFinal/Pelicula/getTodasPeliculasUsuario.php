<?php
include('../config.php');

// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 
$idUsuario = $_POST["idUsuario"];
$adm = $_POST["adm"];
$nNumero = $_POST["nTarjetas"];
$sql="";

    if($adm==0){
            $sql="SELECT peliculas.idPelicula, 
                         peliculas.titulo,
                         peliculas.tituloIngles,
                         peliculas.vista,
                         peliculas.fechaEstreno,
                         peliculas.validado,
                         usuario_pelicula.PeliculaVista FROM `peliculas` 
                         INNER JOIN `usuario_pelicula`
                         WHERE usuario_pelicula.idPelicula=peliculas.idPelicula AND usuario_pelicula.idUsuario=$idUsuario
                         LIMIT $nNumero;";
                        
    }
    else{
        $sql="SELECT peliculas.idPelicula, 
                     peliculas.titulo,
                     peliculas.tituloIngles,
                     peliculas.vista,
                     peliculas.fechaEstreno,
                     peliculas.validado
                     FROM `peliculas` 
                     WHERE validado=0 LIMIT $nNumero;";
    }
    
    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

    if (!$resultado){
        responderError( "Error al recuperar las peliculas: ".mysqli_error($conexion) ,$conexion);
    } else {
        $datos = []; 

        while ($fila = mysqli_fetch_assoc($resultado)) { 
            $datos[] = $fila;
        }

        //responder($datos, $conexion);
        echo json_encode($datos);
    }
?>