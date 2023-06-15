<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$nombre = $_POST["nombre"];
$nombreEN = $_POST["nombreEN"];
$categorias = explode(",", $_POST["categorias"]);
$vista = $_POST["vista"];
$idUsuario = $_POST["idUsuario"];
$adm = $_POST["adm"];
$fechaD = $_POST["fechaD"];
$fechaM = $_POST["fechaM"];
$fechaY = $_POST["fechaY"];
$fecha=$fechaY."-".$fechaM."-".$fechaD;
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


    $sql="SELECT * FROM `peliculas` WHERE titulo='$nombre' OR tituloIngles='$nombreEN';";
    $resultado = mysqli_query( $conexion, $sql );
    if(mysqli_num_rows($resultado) > 0){
        responderError( "Error al agregar una pelicula. Existe una pelicula cuyo nombre es igual por favor revisa nuevamente el listado o espera a que se valide la pelicula: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
    }
    else{
        if($adm==1){
            if ($foto_name!="") {

                $f1= fopen($foto_temporal,"rb");		
                $foto_reconvertida = fread($f1, $foto_size);
                $foto_reconvertida=addslashes($foto_reconvertida);
            
                $sql="INSERT INTO `peliculas` (`foto`,`formato`, `titulo`, `tituloIngles`, `vista`, `fechaEstreno`, `validado`) VALUES
                                              ('$foto_reconvertida','$extension', '$nombre', '$nombreEN', false, '$fecha', 1);";
                $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
                
                $sql="SELECT `idPelicula` FROM `peliculas` WHERE titulo='$nombre' OR tituloIngles='$nombreEN';";
                $resultado = mysqli_query( $conexion, $sql );
                if (mysqli_num_rows($resultado) > 0) {
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $idPelicula = $fila[0];
                        
                        foreach($categorias as $valor){
                            $sql="INSERT INTO `peliculas_categoria`(`idpelicula`, `idCategoria`) VALUES ('$idPelicula','$valor');";
                            $resultado = mysqli_query( $conexion, $sql );
                        }
                        responder("Se ha agregado correctamente", $conexion);
                        
                    }
                }   
            } 
              else {
            
                $sql="INSERT INTO `peliculas` (`titulo`, `tituloIngles`, `vista`, `fechaEstreno`, `validado`) VALUES
                                             ('$nombre', '$nombreEN', false, '$fecha', 1);";
                $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
                
                $sql="SELECT `idPelicula` FROM `peliculas` WHERE titulo='$nombre' OR tituloIngles='$nombreEN';";
                $resultado = mysqli_query( $conexion, $sql );
                if (mysqli_num_rows($resultado) > 0) {
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $idPelicula = $fila[0];

                        foreach($categorias as $valor){
                            $sql="INSERT INTO `peliculas_categoria`(`idpelicula`, `idCategoria`) VALUES ('$idPelicula','$valor');";
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
                
                $f1= fopen($foto_temporal,"rb");		
                $foto_reconvertida = fread($f1, $foto_size);
                $foto_reconvertida=addslashes($foto_reconvertida);
                              
                $sql="INSERT INTO `peliculas` (`foto`,`formato`, `titulo`, `tituloIngles`, `vista`, `fechaEstreno`, `validado`) VALUES
                                              ('$foto_reconvertida','$extension', '$nombre', '$nombreEN', false, '$fecha', 0);";
                $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
                
                $sql="SELECT `idPelicula` FROM `peliculas` WHERE titulo='$nombre' OR tituloIngles='$nombreEN';";
                $resultado = mysqli_query( $conexion, $sql );
                if (mysqli_num_rows($resultado) > 0) {
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $idPelicula = $fila[0];
                        $sql="INSERT INTO `usuario_pelicula`(`idUsuario`, `idPelicula`, `Foto`,`formato`, `PeliculaVista`) 
                        VALUES ('$idUsuario','$idPelicula','$foto_reconvertida','$extension',$vista)";
                        $resultado = mysqli_query( $conexion, $sql );

                        foreach($categorias as $valor){
                            $sql="INSERT INTO `peliculas_categoria`(`idpelicula`, `idCategoria`) VALUES ('$idPelicula','$valor');";
                            $resultado = mysqli_query( $conexion, $sql );
                        }
                        responder("Se ha agregado correctamente", $conexion);

                    }
                }  
            } 
            else {
                //echo "no adm no foto";
                $sql="INSERT INTO `peliculas` (`titulo`, `tituloIngles`, `vista`, `fechaEstreno`, `validado`) VALUES
                                             ('$nombre', '$nombreEN', false, '$fecha', 0);";
                $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
                
                $sql="SELECT `idPelicula` FROM `peliculas` WHERE titulo='$nombre' OR tituloIngles='$nombreEN';";
                $resultado = mysqli_query( $conexion, $sql );
                if (mysqli_num_rows($resultado) > 0) {
                    while ($fila = mysqli_fetch_array($resultado)) {
                        $idPelicula = $fila[0];
                        $sql="INSERT INTO `usuario_pelicula`(`idUsuario`, `idPelicula`, `Foto`,`formato`, `PeliculaVista`) 
                        VALUES ('$idUsuario','$idPelicula',NULL,NULL,$vista)";
                        $resultado = mysqli_query( $conexion, $sql );
                        foreach($categorias as $valor){
                            $sql="INSERT INTO `peliculas_categoria`(`idpelicula`, `idCategoria`) VALUES ('$idPelicula','$valor');";
                            $resultado = mysqli_query( $conexion, $sql );
                        }
                        responder("Se ha agregado correctamente", $conexion);

                    }
                }
            }
        }
    }   
?>