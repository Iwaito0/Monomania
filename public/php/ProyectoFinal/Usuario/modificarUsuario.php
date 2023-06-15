<?php
include('../config.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 

// Recuperamos los parámetros de la petición
$idUsuario = $_POST["id"];
$nombre = $_POST["nombre"];
$apellidos = $_POST["apellidos"];
$usuario = $_POST["usuario"];
$correo = $_POST["correo"];
$contr = $_POST["contr"];
$fecha = $_POST["fecha"];

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

$sql="SELECT * FROM `usuario` WHERE nombreUsuario='$usuario' AND idUsuario !='$idUsuario';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
$row_cnt = $resultado->num_rows;
    

$sql="SELECT * FROM `usuario` WHERE correElectronico='$correo'  AND idUsuario !='$idUsuario';";
$resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
$row_cnt2 = $resultado->num_rows;

if($row_cnt==0 && $row_cnt2==0){ 

    $sql="UPDATE `usuario` SET";

    if($foto_name!=""){
        $f1= fopen($foto_temporal,"rb");		
        $foto_reconvertida = fread($f1, $foto_size);
        $foto_reconvertida=addslashes($foto_reconvertida);
        $sql.=" `foto`='$foto_reconvertida', `formato`= '$extension',";

    }
    if($nombre!="undefined"){
        $sql.=" `nombre`='$nombre',";
    }

    if($apellidos!="undefined"){
        $sql.=" `apellidos`='$apellidos',";
    }

    if($usuario!="undefined"){
        $sql.=" `nombreUsuario`='$usuario',";
    }
    if($contr!="undefined"){
        $sql.=" `password`='$contr',";
    }
    if($correo!="undefined" && $correo != ""){
        $sql.=" `correElectronico`='$correo',";
    }
    if($fecha!=""){
        $sql.=" `Fecha`='$fecha',";
    }

    if($foto_name!="" ||$nombre!="undefined"|| $apellidos!="undefined"|| $usuario!="undefined"|| 
    $contr!="undefined" || $fecha!="" || ($correo!="undefined" && $correo != "")){
        $sql=substr($sql,0,-1);
        $sql.="  WHERE `idUsuario`= '$idUsuario';";
        $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));
        if (!$resultado){
            responderError( "Error al actualizar el ususario por favor revisa los datos: ".mysqli_error($conexion) ,$conexion);
        }
        else{
            responder("Se ha modificado correctamente", $conexion);
        }
    }
    else{
        responder("No se ha realizado ningun cambio", $conexion);
    }
}
else{

     responderError( "Error el correo o el usuario ya estan cogidos: ".mysqli_error($conexion)."--".mysqli_errno($conexion), $conexion );

}

   
?>