<?php
/*
Este fichero hay que incluirlo en cada script del proyecto.
De esta manera:
 - podrás usar la información que aparece aquí en cualquier parte
 - sólo necesitas actualizar este fichero para reflejar cualquier
   cambio en toda la aplicación
*/

/* Array asociativo con la configuración de conexión a la base de datos */
$basedatos = array(
	"basedatos" => "id20854953_monomania",
	"usuario" => "id20854953_monomania",
	"password" => "Usuario12345*",
	"servidor" => "localhost",
	"puerto" => 3306
);



/* ERROR REPORTING */
//Indica que sólo se mostrarán errores, no Warnings ni otros errores. 
//Valores posibles: E_ERROR | E_WARNING | E_PARSE | E_NOTICE
error_reporting(E_ERROR);

// Reporte de errores para mysql
mysqli_report(MYSQLI_REPORT_OFF);


/* FUNCIONES COMUNES */

function conectarBaseDatos( ){
	global $basedatos; //recuperamos el array con la conexión

    $conexion = mysqli_connect($basedatos["servidor"], $basedatos["usuario"], $basedatos["password"], $basedatos["basedatos"], $basedatos["puerto"]) or die(mysqli_error($conexion));
	//$conexion = new mysqli($basedatos["servidor"], $basedatos["usuario"], $basedatos["password"], $basedatos["basedatos"], $basedatos["puerto"]) ;
	
	if ($conexion -> connect_errno) {
		responderError( "Error al conectar a la base de datos. \nCompruebe los parámetros de la conexión: " . 
		$conexion -> connect_error." Código de error: ".$conexion -> connect_errno, $conexion );
	}

	mysqli_set_charset($conexion,"utf8");
	//Si no se produjo un error devolvemos el objeto de la conexión
	return $conexion;
}


function responderError( $datos , $conexion){
    $respuesta["error"] = true;
    $respuesta["datos"] = $datos;

	//mandamos la respuesta
	echo json_encode($respuesta);

	// Cerramos la conexión
	mysqli_close($conexion);
	
	// Finalizar el proceso el servidor con indicador de error
	exit(1);
}

function responder( $datos , $conexion){
    $respuesta["error"] = false;
    $respuesta["datos"] = $datos;

	//mandamos la respuesta
	echo json_encode($respuesta);

	// Cerramos la conexión
	mysqli_close($conexion);

	// Finalizar el proceso el servidor con indicador de éxito
	exit(0);
}


?>
