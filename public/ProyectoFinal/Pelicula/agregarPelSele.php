<?php
include('../config.php');

// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$idUsuario = $_POST["idUsuario"];
$idPelicula = $_POST["idPelicula"];
$vista = $_POST["vista"];

$foto_name= $_FILES['foto']['name'];
$foto_size= $_FILES['foto']['size'];
$foto_type=  $_FILES['foto']['type'];
$foto_temporal= $_FILES['foto']['tmp_name'];

if ($foto_type=="image/x-png" OR $foto_type=="image/png"){
    $extension="image/png";
}

if ($foto_type=="image/pjpeg" OR $foto_type=="image/jpeg"){
    $extension="image/jpeg";
}

if ($foto_type=="image/gif" OR $foto_type=="image/gif"){
    $extension="image/gif";
}
if($foto_type=="image/webp" OR $foto_type=="image/webp"){
    $extension="image/webp";
}

$sql = "SELECT idPelicula FROM `peliculas` WHERE idPelicula='$idPelicula';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
$row_cnt = $resultado->num_rows;

if($row_cnt!=0){

    if(empty($vista)){
        if($foto_name!=""){
            $f1= fopen($foto_temporal,"rb");		
            $foto_reconvertida = fread($f1, $foto_size);
            $foto_reconvertida=addslashes($foto_reconvertida);

            $sql="INSERT INTO `usuario_pelicula`(`idUsuario`, `idPelicula`, `Foto`, `formato`, `PeliculaVista`) 
                        VALUES ('$idUsuario','$idPelicula','$foto_reconvertida','$extension',false)";
        }
        else{
            $sql="INSERT INTO `usuario_pelicula`(`idUsuario`, `idPelicula`, `Foto`, `formato`,  `PeliculaVista`) 
                        VALUES ('$idUsuario','$idPelicula',null,null,false)";
        }
    }
    else{
        if($foto_name!=""){
            $f1= fopen($foto_temporal,"rb");		
            $foto_reconvertida = fread($f1, $foto_size);
            $foto_reconvertida=addslashes($foto_reconvertida);

            $sql="INSERT INTO `usuario_pelicula`(`idUsuario`, `idPelicula`, `Foto`,`formato`,`PeliculaVista`) 
                                                    VALUES ('$idUsuario','$idPelicula','$foto_reconvertida','$extension',$vista)";
        }
        else{
            $sql="INSERT INTO `usuario_pelicula`(`idUsuario`, `idPelicula`, `Foto`, `formato`, `PeliculaVista`) 
                                                        VALUES ('$idUsuario','$idPelicula',null,null,$vista)";
        }
    }  

    $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
    
    // Devolvemos el resultado
    if (!$resultado){
        responderError( "Error al agregar la pelicula: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
    } else {
        responder("Se ha agregado correctamente", $conexion);
    }
}
else{
    responderError( "No se ha podido añadir. El ususario administrador ya elimino esta pelicula: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
}
?>