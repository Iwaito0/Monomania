<?php
include('../config.php');
require('../fpdf/fpdf.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 
/*
$val1= str_split($_GET['n']);

$id=$val1[0];
$adm=$val1[1];
*/

$id=$_GET['n'];
$adm=$_GET['p'];


$sql="";

    if($adm==0){
            $sql="SELECT peliculas.idPelicula, 
                         peliculas.titulo,
                         peliculas.tituloIngles,
                         peliculas.vista,
                         peliculas.fechaEstreno,
                         peliculas.validado,
                         usuario_pelicula.PeliculaVista FROM `peliculas` 
                         INNER JOIN `usuario_pelicula`
                         WHERE usuario_pelicula.idPelicula=peliculas.idPelicula AND usuario_pelicula.idUsuario=$id";
                        
    }
    else{
        $sql="SELECT peliculas.idPelicula, 
                     peliculas.titulo,
                     peliculas.tituloIngles,
                     peliculas.vista,
                     peliculas.fechaEstreno,
                     peliculas.validado
                     FROM `peliculas`";
    }

    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

    if (!$resultado){
        responderError( "Error al recuperar las peliculas: ".mysqli_error($conexion) ,$conexion);
    } 
    else {
        $datos = []; 

        while ($fila = mysqli_fetch_assoc($resultado)) { 
            $datos[] = $fila;
        }

        //print_r($datos);

        $pdf = new FPDF('P','mm','A4');
        $pdf->SetTitle('Listado de peliculas');
        $pdf->AddPage();
        $pdf->SetAutoPageBreak(false);
        $y_axis_initial = 5;
        $pdf->SetFont('Arial','B',12);
        $pdf->SetY($y_axis_initial);
        $pdf->SetFontSize(10);


        foreach ($datos as $fila => $valor) {
            $idPelActu=$valor["idPelicula"];
           
            $pdf->Line(5, 5, 200, 5);
            $pdf->SetFont('Arial','I',10);
            $pdf->Image('../Monomaniat.png',0,0,35,0,'PNG');
            $pdf->SetXY(20, 6);
            $pdf->SetFontSize(35);
            $pdf->Cell(75,22,'Monomania',0,0,'R');
            $pdf->Line(5, 30, 200, 30);
            $pdf->Ln();


            $pdf->SetFillColor(168,208,141);
            $pdf->SetX(15);
            $pdf->SetXY(5, 45);
            $pdf->SetFontSize(10);

          
            $pdf->Cell(25,7.5,'Titulo',1,0,'C');
            $pdf->Cell(170,7.5,utf8_decode($valor["titulo"]),1,0,'C');
            $pdf->Ln();
            $pdf->SetXY(5, 52.5);
            $pdf->Cell(25,7.5,'Titulo ingles',1,0,'C');
            $pdf->Cell(170,7.5,$valor["tituloIngles"],1,0,'C');
            $pdf->Ln();
            $pdf->SetXY(5, 60);
            $pdf->Cell(25,7.5,'Fecha',1,0,'C');
            $pdf->Cell(170,7.5,$valor["fechaEstreno"],1,0,'C');
            $pdf->Ln();
            $pdf->SetXY(5, 67.5);
            $pdf->Cell(25,7.5,'Validado',1,0,'C');

            if($valor["validado"]==0){
                $pdf->Cell(170,7.5,"Pendiente de validar",1,0,'C');
            }
            else if($valor["validado"]==-1){
                $pdf->Cell(170,7.5,"No validado",1,0,'C');
            }
            else if($valor["validado"]==1){
                $pdf->Cell(170,7.5,"Validado",1,0,'C');
            }

            $pdf->Ln();
            $pdf->SetXY(5, 75);
            $pdf->Cell(25,7.5,'Pelicula vista',1,0,'C');

            if($valor["PeliculaVista"]==0){
                $pdf->Cell(170,7.5,"Pelicula no vista",1,0,'C');

            }
            else{
                $pdf->Cell(170,7.5,"Pelicula vista",1,0,'C');
            }
            $pdf->Ln();

            $pdf->SetXY(5, 90);
            $pdf->Cell(25,7.5,'Categorias',1,0,'C');
            //$pdf->Cell(45,7.5,$valor["tituloIngles"],1,0,'C');
            $sql5="SELECT categorias.nombre FROM `peliculas_categoria` INNER JOIN categorias 
                  WHERE peliculas_categoria.idCategoria=categorias.idCategoria AND idpelicula='$idPelActu'";
                $resultado5 = mysqli_query($conexion, $sql5) or die(mysqli_error($conexion));

                if (!$resultado5) {
                    responderError("Error al conseguir la imagen de la pelicula del ususario " . mysqli_error($conexion), $conexion);
                } 
                else{
                    $datosCateg = []; 
                    $categorias="";

                    while ($fila5 = mysqli_fetch_assoc($resultado5)) { 
                        $datosCateg[] = $fila5;
                    }

                   
                    for($i=0; $i<sizeof($datosCateg); $i++){
                        $categorias.=$datosCateg[$i]["nombre"].",";
                    }
                    if($categorias==""){
                        $pdf->Cell(170,7.5, "Ninguna categoria",1,0,'C');
                    }
                    else{
                        $pdf->Cell(170,7.5,utf8_decode( $categorias),1,0,'C');
                    }

                }



            $pdf->Line(5, 100, 200, 100);

            $pdf->Ln();
            $pdf->SetXY(30, 107.5);
            $pdf->Cell(50,7.5,'Foto del usuario',1,0,'C');
            $pdf->Cell(35,7.5,'',0,0,'C');
            $pdf->Cell(50,7.5,'Foto original de la  pelicula',1,0,'C');
            $pdf->Ln();

           
            $sql = "SELECT * FROM `peliculas` WHERE idPelicula='$idPelActu';";

            $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
            if (!$resultado) {
                responderError("Error al conseguir la imagen de la pelicula " . mysqli_error($conexion), $conexion);
            } 
            else{

                $sql2 = "SELECT * FROM `usuario_pelicula` WHERE idPelicula='$idPelActu' AND idUsuario='$id';";                
                $resultado2 = mysqli_query($conexion, $sql2) or die(mysqli_error($conexion));

                if (!$resultado2) {
                    responderError("Error al conseguir la imagen de la pelicula del ususario " . mysqli_error($conexion), $conexion);
                } 
                else{
                    $fila2 = mysqli_fetch_assoc($resultado2);
                    $fila = mysqli_fetch_assoc($resultado);

                    $pdf->SetXY(30, 115);
                    if($fila2['Foto']!=null){

                        if($adm==0){
                            $tipo_foto2=$fila2['formato'];
                            $formato2=substr($tipo_foto2,  6, 9);
                            
                            if($formato2=="webp"){
                                $pdf->Image("../nSuported.png",30,115.5,50,75,"png");
                            }
                            else{
                               $pdf->Image("https://monomania-ivg.000webhostapp.com/php/proyectoFinal/Pelicula/verFotoPelicula.php?n=".$valor["idPelicula"]."&p=".$id,30,115.5,50,75,$formato2);
                            }    

                            
                        }
                        else {
                            $tipo_foto2=$fila2['formato'];
                            $formato2=substr($tipo_foto2,  6, 9);
                            $pdf->Image("../NIMG.png",30,115.5,50,75,"png");
                        }
                    }
                    else{
                        $tipo_foto2=$fila2['formato'];
                        $formato2=substr($tipo_foto2,  6, 9);
                        $pdf->Image("../NIMG.png",30,115.5,50,75,"png");
                    }
                    $pdf->Cell(35,7.5,'',0,0,'C');

                    if($fila['foto']!=null){
                        $tipo_foto=$fila['formato'];
                        $formato=substr($tipo_foto,  6, 9);
                        
                        if($formato=="webp"){
                            $pdf->Image("../nSuported.png",115,115.5,50,75,"png");
                        
                        }
                        else{
                           $pdf->Image("https://monomania-ivg.000webhostapp.com/php/proyectoFinal/Pelicula/verFotoPeliculaBD.php?n=".$valor["idPelicula"],115,115.5,50,75,$formato);
                            
                        }

                    
                    }
                    else{
                        $tipo_foto2=$fila2['formato'];
                        $formato2=substr($tipo_foto2,  6, 9);
                        $pdf->Image("../NIMG.png",115,115.5,50,75,"png");                     
                    }
                }            
            }

            $pdf->Ln();
            $pdf->Ln();
    
            $pdf->Line(5, 275, 200, 275);
            $pdf->SetFont('Arial','I',10);
            $pdf->Image('../Monomaniat.png',5,275,15,0,'PNG');
    
            $pdf->SetXY(20, -20);
            $pdf->Cell(0,10,'Monomania',0,0,'L');
            $pdf->Ln();    
    
            $pdf->SetY(-15);
            $pdf->Cell(0,10,utf8_decode('Página '.$pdf->PageNo()).'/'.count($datos),0,0,'R');






            if($valor != end($datos)){
                $pdf->AddPage();
            }
        }

    } 
    $pdf->Output(); 
 

?>