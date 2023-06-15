<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$titulo = $_POST["titulo"];
$tituloEn = $_POST["tituloEN"];
$categoria = $_POST["categ"];
$vista = $_POST["vista"];
$fecha = $_POST["fecha"];
$admin = $_POST["adm"];

$idPel = $_POST["idPelicula"];
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

$sql = "SELECT idPelicula FROM `peliculas` WHERE idPelicula='$idPel';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
$row_cnt = $resultado->num_rows;

    if($admin!=1){

        if($row_cnt!=0){ 

        $sql = "SELECT validado FROM `peliculas` WHERE idPelicula='$idPel';";
        $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));

        if (!$resultado) {
            responderError("Error al actualizar la pelicula " . mysqli_error($conexion), $conexion);
        } 
        else {
            $pru = mysqli_fetch_assoc($resultado);
            $validacion;

            foreach ($pru as $row) {
                $validacion = $row . "<br />";
            }

            if (intval($validacion) != 1){
                //PV NV

                $sql="UPDATE `peliculas` SET";

                if($foto_name!=""){
                    $f1= fopen($foto_temporal,"rb");		
                    $foto_reconvertida = fread($f1, $foto_size);
                    $foto_reconvertida=addslashes($foto_reconvertida);
                    $sql.=" `foto`='$foto_reconvertida', `formato`= '$extension',";
                }

                if($titulo!="undefined"){
                    $sql.=" `titulo`='$titulo',";
                }

                if($tituloEn!="undefined"){
                    $sql.=" `tituloIngles`='$tituloEn',";
                }

                if($fecha!=""){
                    $sql.=" `fechaEstreno`='$fecha',";
                }
    
                if($foto_name!="" ||$titulo!="undefined"|| $tituloEn!="undefined"|| $fecha!=""){

                    $sql.=" `validado`='0' WHERE `idPelicula`= '$idPel';";
                    $resultado = mysqli_query( $conexion, $sql ); //or die(mysqli_error($conexion));
                    if (!$resultado){
                        responderError( "Error al actualizar la pelicula. \nPosiblemente los nombre de la pelicula ya esten en la base de datos: \n".mysqli_error($conexion) ,$conexion);
                    }
                }
                //Añadir foto
                if($vista!="undefined"){
                    if($foto_name!=""){
                        $f1= fopen($foto_temporal,"rb");		
                        $foto_reconvertida = fread($f1, $foto_size);
                        $foto_reconvertida=addslashes($foto_reconvertida);

                        $sql2="UPDATE `usuario_pelicula` SET `Foto`='$foto_reconvertida', `formato`= '$extension',`PeliculaVista`= $vista WHERE `idPelicula`= '$idPel';";
                        $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
                        if (!$resultado){
                            responderError( "Error al actualizar la pelicula: ".mysqli_error($conexion) ,$conexion);
                        }
                    }
                    else{
                        $sql2="UPDATE `usuario_pelicula` SET `PeliculaVista`= $vista WHERE `idPelicula`= '$idPel';";
                        $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
                        if (!$resultado){
                            responderError( "Error al actualizar la pelicula: ".mysqli_error($conexion) ,$conexion);
                        }
                    }
                }

                else{
                    if($foto_name!=""){
                        $f1= fopen($foto_temporal,"rb");		
                        $foto_reconvertida = fread($f1, $foto_size);
                        $foto_reconvertida=addslashes($foto_reconvertida);
                                                                                  //aparece asi `PeliculaVista` = Where... Ha desaparecido $vista
                        $sql2="UPDATE `usuario_pelicula` SET `Foto`='$foto_reconvertida', `formato`= '$extension',`PeliculaVista`= false WHERE `idPelicula`= '$idPel';";
                        $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
                        if (!$resultado){
                            responderError( "Error al actualizar la pelicula: ".mysqli_error($conexion) ,$conexion);
                        }
                    }
                    /*else{
                        $sql2="UPDATE `usuario_pelicula` SET `Foto`='null',`formato`='null',`PeliculaVista`= false WHERE `idPelicula`= '$idPel';";
                        $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
                        if (!$resultado){
                            responderError( "Error al actualizar la pelicula: ".mysqli_error($conexion) ,$conexion);
                        }  
                    }*/
                }

                if($categoria!=""){
                $sql3="DELETE FROM `peliculas_categoria` WHERE `idPelicula`= '$idPel'";
                    //se ejecuta
                    $resultado = mysqli_query( $conexion, $sql3 ) or die(mysqli_error($conexion));
                    if (!$resultado){
                        responderError( "Error al actualizar la pelicula: ".mysqli_error($conexion) ,$conexion);
                    }

                    $categorias = explode(",", $categoria);
                    foreach($categorias as $valor){
                        $sql4="INSERT INTO `peliculas_categoria`(`idpelicula`, `idCategoria`) VALUES ('$idPel','$valor');";
                        $resultado = mysqli_query( $conexion, $sql4 );// or die(mysqli_error($conexion));
                    }
                    if (!$resultado){
                        responderError( "Error al actualizar la pelicula al parecer una categoria a sido eliminado por el administrador:\nPor favor recarge la pagina\n ".mysqli_error($conexion) ,$conexion);
                    }
                }
            }
            else{
                //validado
                //Añadir foto
                if($vista!="undefined"){
                    if($foto_name!=""){
                        $f1= fopen($foto_temporal,"rb");		
                        $foto_reconvertida = fread($f1, $foto_size);
                        $foto_reconvertida=addslashes($foto_reconvertida);

                        $sql2="UPDATE `usuario_pelicula` SET `Foto`='$foto_reconvertida', `formato`= '$extension',`PeliculaVista`= $vista WHERE `idPelicula`= '$idPel' AND `IdUsuario`= '$idUsuario';";
                    }
                    else{
                        $sql2="UPDATE `usuario_pelicula` SET `PeliculaVista`= $vista WHERE `idPelicula`= '$idPel' AND `IdUsuario`= '$idUsuario';";    
                    }
                }
                else{

                    if($foto_name!=""){
                        $f1= fopen($foto_temporal,"rb");		
                        $foto_reconvertida = fread($f1, $foto_size);
                        $foto_reconvertida=addslashes($foto_reconvertida);

                        $sql2="UPDATE `usuario_pelicula` SET `Foto`='$foto_reconvertida', `formato`= '$extension',`PeliculaVista`= false WHERE `idPelicula`= '$idPel' AND `IdUsuario`= '$idUsuario';";    
                    }
                    else{
                        $sql2="UPDATE `usuario_pelicula` SET `PeliculaVista`= false WHERE `idPelicula`= '$idPel' AND `IdUsuario`= '$idUsuario';";    
                    }
                }
                $resultado = mysqli_query( $conexion, $sql2 ) or die(mysqli_error($conexion));
                if (!$resultado){
                    responderError( "Error al actualizar la pelicula: ".mysqli_error($conexion) ,$conexion);
                }
            }
        }    
        responder("Se ha modificado correctamente", $conexion);
    }
    else{
        responderError( "No se ha podido modificar. El ususario administrador ya elimino esta pelicula: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
    }
    }
    else{
        //Funciones ADM
        $idPelicula = $_POST["idPeliculaADM"];
        $validacion = $_POST["validacion"];

        $sql="UPDATE `peliculas` SET";
        $sql.=" `validado`='$validacion' WHERE `idPelicula`= '$idPelicula';";

        $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

        if (!$resultado) {
            responderError("Error al validadar la pelicula " . mysqli_error($conexion), $conexion);
        }
        else{
            responder("Se ha validado correctamente", $conexion);
        } 
    }

?>