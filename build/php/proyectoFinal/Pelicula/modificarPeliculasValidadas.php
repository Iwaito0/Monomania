<?php
include('../config.php');



// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$titulo = $_POST["titulo"];
$tituloEn = $_POST["tituloEN"];
$fecha = $_POST["fecha"];
$idPel = $_POST["idPeli"];


//Procesamiento de fotografias
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


$sql="UPDATE `peliculas` SET";

            if($foto_name!=""){
                $f1= fopen($foto_temporal,"rb");		
                $foto_reconvertida = fread($f1, $foto_size);
                $foto_reconvertida=addslashes($foto_reconvertida);
                $sql.=" `foto`='$foto_reconvertida', `formato`= '$extension',";

            }
            if(!empty($titulo)){
                    $sql.=" `titulo`='$titulo',";
            }

            if(!empty($tituloEn)){
                    $sql.=" `tituloIngles`='$tituloEn',";
            }

            if(!$fecha=="1234-11-30"){
                    $sql.=" `fechaEstreno`='$fecha',";
            }

           if($foto_name!="" ||!empty($titulo)|| !empty($tituloEn)|| !$fecha=="1234-11-30"){
                $sql=substr($sql,0,-1);
                $sql.=" WHERE `idPelicula`= '$idPel';";
                $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
                if (!$resultado){
                    responderError( "Error al actualizar la pelicula: ".mysqli_error($conexion) ,$conexion);
                }
                else {
                    responder("Se ha modificado correctamente", $conexion);
                }
            }
            



?>