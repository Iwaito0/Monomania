<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$nombre = $_POST["nombre"];
$nombreEN = $_POST["nombreEN"];
$nombreJP = $_POST["nombreJP"];
$capLe = $_POST["capLe"];
$capEstre = $_POST["capEstre"];
$enlace = $_POST["enlace"];

$categorias = explode(",", $_POST["categorias"]);
$idUsuario = $_POST["idUsuario"];
$adm = $_POST["adm"];

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


    $sql="SELECT * FROM `novelas` WHERE tituloEspanol='$nombre' OR tituloIngles='$nombreEN' OR tituloJapones='$nombreJP';";
    $resultado = mysqli_query( $conexion, $sql );
    if(mysqli_num_rows($resultado) > 0){
        responderError( "Error al agregar una novela. Existe una novela cuyo nombre es igual por favor revisa nuevamente el listado o espera a que se valide la novela: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
    }
    else{
        if($adm==1){
            if ($foto_name!="") {
                 //echo "adm  foto";

                $f1= fopen($foto_temporal,"rb");		
                $foto_reconvertida = fread($f1, $foto_size);
                $foto_reconvertida=addslashes($foto_reconvertida);
            
                $sql="INSERT INTO `novelas` (`foto`,`formato`, `tituloEspanol`, `tituloIngles`,`tituloJapones`, `capituloLeido`, `capituloEstrenado`, `enlace`, `validado`) VALUES
                                              ('$foto_reconvertida','$extension', '$nombre', '$nombreEN', '$nombreJP',0, '$capEstre','$enlace', 1);";
                $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
                
                $sql="SELECT `idNovelas` FROM `novelas` WHERE tituloEspanol='$nombre' OR tituloIngles='$nombreEN' OR tituloJapones='$nombreJP';";
                $resultado = mysqli_query( $conexion, $sql );
                if (mysqli_num_rows($resultado) > 0) {
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $idNovelas = $fila[0];
                        
                        foreach($categorias as $valor){
                            $sql="INSERT INTO `novelas_categoria`(`idNovelas`, `idCategoria`) VALUES ('$idNovelas','$valor');";
                            $resultado = mysqli_query( $conexion, $sql );
                        }
                        responder("Se ha agregado correctamente", $conexion);
                        
                    }
                }   
            } 
            else {
                //echo "adm  no foto";

                $sql="INSERT INTO `novelas` (`tituloEspanol`, `tituloIngles`,`tituloJapones`, `capituloLeido`, `capituloEstrenado`, `enlace`, `validado`) VALUES
                                              ('$nombre', '$nombreEN', '$nombreJP',0, '$capEstre','$enlace', 1);";
            
                $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
                
                $sql="SELECT `idNovelas` FROM `novelas` WHERE tituloEspanol='$nombre' OR tituloIngles='$nombreEN' OR tituloJapones='$nombreJP';";
                $resultado = mysqli_query( $conexion, $sql );
                if (mysqli_num_rows($resultado) > 0) {
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $idNovelas = $fila[0];

                        foreach($categorias as $valor){
                            $sql="INSERT INTO `novelas_categoria`(`idNovelas`, `idCategoria`) VALUES ('$idNovelas','$valor');";
                            $resultado = mysqli_query( $conexion, $sql );
                        }
                        responder("Se ha agregado correctamente", $conexion);

                    }
                }
            }
        }
        else
        {
            if ($foto_name!="") {
                //echo "no adm  foto";

                $f1= fopen($foto_temporal,"rb");		
                $foto_reconvertida = fread($f1, $foto_size);
                $foto_reconvertida=addslashes($foto_reconvertida);

                $sql="INSERT INTO `novelas` (`foto`,`formato`, `tituloEspanol`, `tituloIngles`,`tituloJapones`, `capituloLeido`, `capituloEstrenado`, `enlace`, `validado`) VALUES
                ('$foto_reconvertida','$extension', '$nombre', '$nombreEN', '$nombreJP',0, '$capEstre','$enlace', 0);";

                $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
                
                $sql="SELECT `idNovelas` FROM `novelas` WHERE tituloEspanol='$nombre' OR tituloIngles='$nombreEN' OR tituloJapones='$nombreJP';";
                $resultado = mysqli_query( $conexion, $sql );
                if (mysqli_num_rows($resultado) > 0) {
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $idNovelas = $fila[0];
                        $sql="INSERT INTO `usuario_novelas`(`idUsuario`, `idNovelas`, `Foto`,`formato`, `enlace`, `capituloLeido`) 
                        VALUES ('$idUsuario','$idNovelas','$foto_reconvertida','$extension','$enlace', $capLe)";
                        $resultado = mysqli_query( $conexion, $sql );

                        foreach($categorias as $valor){
                            $sql="INSERT INTO `novelas_categoria`(`idNovelas`, `idCategoria`) VALUES ('$idNovelas','$valor');";
                            $resultado = mysqli_query( $conexion, $sql );
                        }
                        responder("Se ha agregado correctamente", $conexion);

                    }
                }  
            } 
            else {
                //echo "no adm no foto";

                $sql="INSERT INTO `novelas` (`tituloEspanol`, `tituloIngles`,`tituloJapones`, `capituloLeido`, `capituloEstrenado`, `enlace`, `validado`) VALUES
                                              ('$nombre', '$nombreEN', '$nombreJP',0, '$capEstre','$enlace', 0);";

                $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
                
                $sql="SELECT `idNovelas` FROM `novelas` WHERE tituloEspanol='$nombre' OR tituloIngles='$nombreEN' OR tituloJapones='$nombreJP';";
                $resultado = mysqli_query( $conexion, $sql );
                if (mysqli_num_rows($resultado) > 0) {
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $idNovelas = $fila[0];
                        $sql="INSERT INTO `usuario_novelas`(`idUsuario`, `idNovelas`, `enlace`, `capituloLeido`) 
                        VALUES ('$idUsuario','$idNovelas','$enlace', $capLe)";
                        $resultado = mysqli_query( $conexion, $sql );
                        foreach($categorias as $valor){
                            $sql="INSERT INTO `novelas_categoria`(`idNovelas`, `idCategoria`) VALUES ('$idNovelas','$valor');";
                            $resultado = mysqli_query( $conexion, $sql );
                        }
                        responder("Se ha agregado correctamente", $conexion);

                    }
                }
            }
        }
    }   
?>