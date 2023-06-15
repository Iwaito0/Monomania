<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$titulo = $_POST["titulo"];
$tituloEn = $_POST["tituloEN"];
$tituloJP = $_POST["tituloJP"];
$capEstre = $_POST["capEstrenado"];
$enlace = $_POST["enlace"];
$IdNov = $_POST["idNov"];


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


$sql="UPDATE `novelas` SET";

            if($foto_name!=""){
                $f1= fopen($foto_temporal,"rb");		
                $foto_reconvertida = fread($f1, $foto_size);
                $foto_reconvertida=addslashes($foto_reconvertida);
                $sql.=" `Foto`='$foto_reconvertida', `formato`= '$extension',";

            }
            if(!empty($titulo)){
                    $sql.=" `tituloEspanol`='$titulo',";
            }

            if(!empty($tituloEn)){
                    $sql.=" `tituloIngles`='$tituloEn',";
            }
            if(!empty($tituloJP)){
                $sql.=" `tituloJapones`='$tituloJP',";
            }
            if(!empty($capEstre)){
                $sql.=" `capituloEstrenado`=$capEstre,";
            }
            if(!empty($enlace)){
                $sql.=" `enlace`='$enlace',";
            }


           if($foto_name!="" ||!empty($titulo)|| !empty($tituloEn)||!empty($tituloJP)||!empty($capEstre)||!empty($enlace)){
                $sql=substr($sql,0,-1);
                $sql.=" WHERE `idNovelas`= '$IdNov';";
                $resultado = mysqli_query( $conexion, $sql ); //or die(mysqli_error($conexion));
                if (!$resultado){
                    responderError( "Error al actualizar la novela: ".mysqli_error($conexion) ,$conexion);
                }
                else {
                    responder("Se ha modificado correctamente", $conexion);
                }
            }
            



?>