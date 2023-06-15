<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$nombre = $_POST["nombre"];
$apellidos = $_POST["apellidos"];
$usuario = $_POST["usuario"];
$password = $_POST["password"];
$correo = $_POST["correo"];
$foto = $_POST["foto"];
$fechaD = $_POST["fechaD"];
$fechaM = $_POST["fechaM"];
$fechaY = $_POST["fechaY"];

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


$sql="SELECT * FROM `usuario` WHERE correElectronico='$correo' OR nombreUsuario='$usuario';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
$row_cnt = $resultado->num_rows;
    
if($row_cnt==0){ 

    if ($foto_name!="") {
        // Decodificar la imagen desde una cadena codificada en base64
       // echo $image_data;
       $f1= fopen($foto_temporal,"rb");		
       $foto_reconvertida = fread($f1, $foto_size);
       $foto_reconvertida=addslashes($foto_reconvertida);
    
        $fecha=$fechaY."-".$fechaM."-".$fechaD;
    
        $sql="INSERT INTO `usuario`(`foto`,`formato`,`nombre`, `apellidos`, `nombreUsuario`, `password`, `correElectronico`, `Fecha`,`esAdmin`) 
                                  VALUES ('$foto_reconvertida','$extension','$nombre','$apellidos','$usuario','$password','$correo','$fecha',false)";
        $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
        
        // Devolvemos el resultado
        if (!$resultado){
            responderError( "Error al insertar la persona: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
        } else {
            responder("Se ha registrado correctamente", $conexion);
        }
      } 
      else {
    
        $fecha=$fechaY."-".$fechaM."-".$fechaD;
    
        $sql="INSERT INTO `usuario`(`nombre`, `apellidos`, `nombreUsuario`, `password`, `correElectronico`, `Fecha` ,`esAdmin`) 
                                  VALUES ('$nombre','$apellidos','$usuario','$password','$correo','$fecha',false)";
        $resultado = mysqli_query( $conexion, $sql ); // or die(mysqli_error($conexion));
        
        // Devolvemos el resultado
        if (!$resultado){
            responderError( "Error al insertar la persona: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );
        } else {
            responder("Se ha registrado correctamente", $conexion);
        }
      }


}
else{

     responderError( "Error el correo o el usuario ya estan cogidos: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );

}




?>