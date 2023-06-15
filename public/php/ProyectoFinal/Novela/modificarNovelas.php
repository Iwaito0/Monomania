<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$titulo = $_POST["titulo"];
$tituloEn = $_POST["tituloEN"];
$tituloJp = $_POST["tituloJP"];
$capLe = $_POST["capLe"];
$capEs = $_POST["capEs"];
$enlace = $_POST["enlace"];

$categoria = $_POST["categ"];
$admin = $_POST["adm"];
$idNov = $_POST["idNovelas"];
$idUsuario = $_POST["idUsuario"];

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



$sql = "SELECT idNovelas FROM `novelas` WHERE idNovelas='$idNov';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
$row_cnt = $resultado->num_rows;


    if($admin!=1){

        if($row_cnt!=0){

        $sql = "SELECT validado FROM `novelas` WHERE idNovelas='$idNov';";
        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
        if (!$resultado) {
            responderError("Error al actualizar la novela " . mysqli_error($conexion), $conexion);
        } 
        else {
            $pru = mysqli_fetch_assoc($resultado);
            $validacion;

            foreach ($pru as $row) {
                $validacion = $row . "<br />";
            }

            if (intval($validacion) != 1){
                //PV NV
        
                $sql="UPDATE `novelas` SET";

                if($foto_name!=""){
                    $f1= fopen($foto_temporal,"rb");		
                    $foto_reconvertida = fread($f1, $foto_size);
                    $foto_reconvertida=addslashes($foto_reconvertida);
                    $sql.=" `foto`='$foto_reconvertida', `formato`= '$extension',";
                }

                if($titulo!="undefined"){
                    $sql.=" `tituloEspanol`='$titulo',";
                }

                if($tituloEn!="undefined"){
                    $sql.=" `tituloIngles`='$tituloEn',";
                }
                if($tituloJp!="undefined"){
                    $sql.=" `tituloJapones`='$tituloJp',";
                }
                if($capLe!="undefined"){
                    $sql.=" `capituloLeido`= 0,";
                }
                if($capEs!="undefined"){
                    $sql.=" `capituloEstrenado`= $capEs,";
                }
                if($enlace!="undefined"){
                    $sql.=" `enlace`= '$enlace',";
                }
                

                if($foto_name!="" ||$titulo!="undefined"|| $tituloEn!="undefined"|| $tituloJp!="undefined" || 
                   $capLe!="undefined" || $capEs!="undefined" || $enlace!="undefined"){

                    $sql.=" `validado`='0' WHERE `idNovelas`= '$idNov';";
                    $resultado = mysqli_query( $conexion, $sql ); //or die(mysqli_error($conexion));
                    if (!$resultado){

                        responderError( "Error al actualizar la novela. \nPosiblemente los nombre de la novela ya esten en la base de datos: \n".mysqli_error($conexion) ,$conexion);

                    }
                    else{
                        $sql="UPDATE `usuario_novelas` SET ";

                        if($foto_name!=""){
                            $f1= fopen($foto_temporal,"rb");		
                            $foto_reconvertida = fread($f1, $foto_size);
                            $foto_reconvertida=addslashes($foto_reconvertida);
                            $sql.="`Foto`='$foto_reconvertida', `formato`= '$extension',";
                        }

                        if($capLe!="undefined"){
                            $sql.=" `capituloLeido`= $capLe,";
                        }
                        if($enlace!="undefined"){
                            $sql.=" `enlace`= '$enlace',";
                        }

                        if($foto_name!=""|| $capLe!="undefined" || $enlace!="undefined"){
                            $sql=substr($sql,0,-1);
                            $sql.=" WHERE `idNovelas`= '$idNov' AND `IdUsuario`= '$idUsuario';";
                            $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));
                        }
        
                        if (!$resultado){
                            responderError( "Error al actualizar la novela: ".mysqli_error($conexion) ,$conexion);
                        }
                        else{
                            responder("Se ha modificado correctamente", $conexion);  
                        }   
                    
                    }
                }
            
                if($categoria!=""){
                    $sql3="DELETE FROM `novelas_categoria` WHERE `idNovelas`= '$idNov'";
                    //se ejecuta
                    $resultado = mysqli_query( $conexion, $sql3 ) or die(mysqli_error($conexion));
                    if (!$resultado){
                        responderError( "Error al actualizar la novela: ".mysqli_error($conexion) ,$conexion);
                    }

                    $categorias = explode(",", $categoria);
                    foreach($categorias as $valor){
                        $sql4="INSERT INTO `novelas_categoria`(`idNovelas`, `idCategoria`) VALUES ('$idNov','$valor');";
                        $resultado = mysqli_query( $conexion, $sql4 ); //or die(mysqli_error($conexion));
                    }
                    if (!$resultado){
                        responderError( "Error al actualizar la novela al parecer una categoria a sido eliminado por el administrador\nPor favor recarge la pagina\n ".mysqli_error($conexion) ,$conexion);
                    }
                }
            }
            else{
                //validado
                //Añadir foto
                $sql2="UPDATE `usuario_novelas` SET ";

                if($foto_name!=""){
                    $f1= fopen($foto_temporal,"rb");		
                    $foto_reconvertida = fread($f1, $foto_size);
                    $foto_reconvertida=addslashes($foto_reconvertida);
                    $sql2.="`Foto`='$foto_reconvertida', `formato`= '$extension',";
                }

                if($enlace!="undefined"){
                    $sql2.=" `enlace`= '$enlace',";
                }
            
                if($capLe!="undefined"){
                    $sql2.=" `capituloLeido`= $capLe,";
                }

                if($foto_name!="" ||$enlace!="undefined"|| $capLe!="undefined"){
                    $sql2=substr($sql2,0,-1);
                    $sql2.=" WHERE `idNovelas`= '$idNov' AND `IdUsuario`= '$idUsuario';";
                    $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
                }

                if (!$resultado){
                    responderError( "Error al actualizar la novela: ".mysqli_error($conexion) ,$conexion);
                }
                else{
                    responder("Se ha modificado correctamente", $conexion);  
                }
            }
        }    
        responder("Se ha modificado correctamente", $conexion);

    }
    else{
        responderError( "No se ha podido modificar. El ususario administrador ya elimino esta novela: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
    }
    }
    else{
        //Funciones ADM
        $idNovela = $_POST["idNovelaADM"];
        $validacion = $_POST["validacion"];

        $sql="UPDATE `novelas` SET";
        $sql.=" `validado`='$validacion' WHERE `idNovelas`= '$idNovela';";

        $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

        if (!$resultado) {
            responderError("Error al validadar la novela " . mysqli_error($conexion), $conexion);
        }
        else{
            responder("Se ha validado correctamente", $conexion);

        }
        
        

    }


?>