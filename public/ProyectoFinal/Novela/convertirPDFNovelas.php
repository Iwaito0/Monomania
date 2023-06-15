<?php
include('../config.php');
require('../fpdf/fpdf.php');


// Creamos la conexión al servidor
$conexion = conectarBaseDatos(); 
/*
$val1= str_split($_GET['n']);
print_r( $val1);
$id=$val1[0];
$adm=$val1[1];*/
$id=$_GET['n'];
$adm=$_GET['p'];


$sql="";

    if($adm==0){
            $sql="SELECT novelas.idNovelas, 
                         novelas.tituloEspanol,
                         novelas.tituloIngles,
                         novelas.tituloJapones,
                         novelas.capituloLeido,
                         novelas.capituloEstrenado,
                         novelas.enlace AS enlaceNov,
                         novelas.validado,
                         usuario_novelas.enlace,
                         usuario_novelas.capituloLeido
                         FROM `novelas` 
                         INNER JOIN `usuario_novelas`
                         WHERE usuario_novelas.idNovelas=novelas.idNovelas AND usuario_novelas.idUsuario=$id"; 
                        
    }
    else{
        $sql="SELECT novelas.idNovelas, 
                     novelas.tituloEspanol,
                     novelas.tituloIngles,
                     novelas.tituloJapones,
                     novelas.capituloLeido,
                     novelas.capituloEstrenado,
                     novelas.enlace AS enlaceNov,
                     novelas.validado
                     FROM `novelas`";                                
    }

    $resultado = mysqli_query( $conexion, $sql ) or die(mysqli_error($conexion));

    if (!$resultado){
        responderError( "Error al recuperar las novelas: ".mysqli_error($conexion) ,$conexion);
    } 
    else {
        $datos = []; 

        while ($fila = mysqli_fetch_assoc($resultado)) { 
            $datos[] = $fila;
        }

        //print_r($datos);

        $pdf = new FPDF('P','mm','A4');
        $pdf->SetTitle('Listado de novelas');
        $pdf->AddPage();
        $pdf->SetAutoPageBreak(false);
        $y_axis_initial = 5;
        $pdf->SetFont('Arial','B',12);
        $pdf->SetY($y_axis_initial);
        $pdf->SetFontSize(10);



        foreach ($datos as $fila => $valor) {
            $idNovActu=$valor["idNovelas"];

            $pdf->Line(5, 5, 200, 5);
            $pdf->SetFont('Arial','',10);
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

            $pdf->Cell(35, 7.5, utf8_decode("Título en español"), 1, 0, 'C');           
            $pdf->Cell(160,7.5,utf8_decode($valor["tituloEspanol"]),1,0,'C');
            $pdf->Ln();
            $pdf->SetXY(5, 52.5);
            $pdf->Cell(35,7.5,'Titulo ingles',1,0,'C');
            $pdf->Cell(160,7.5,$valor["tituloIngles"],1,0,'C');
            $pdf->Ln();
            $pdf->SetXY(5, 60);
            $pdf->Cell(35,7.5,'Titulo japones',1,0,'C');
            $pdf->Cell(160,7.5,$valor["tituloJapones"],1,0,'C');
            $pdf->Ln();
            $pdf->SetXY(5, 67.5);
            $pdf->Cell(35,7.5,'Capitulo leido',1,0,'C');
            $pdf->Cell(160,7.5,$valor["capituloLeido"],1,0,'C');
            $pdf->SetXY(5, 75);
            $pdf->Cell(35,7.5,'Capitulo estrenado',1,0,'C');
            $pdf->Cell(160,7.5,$valor["capituloEstrenado"],1,0,'C');
            $pdf->Ln();
            $pdf->SetXY(5, 82.5);
            $pdf->Cell(35,7.5,'Enlace ',1,0,'C');
            
            if($valor["enlace"] == NULL){
                $pdf->Cell(160,7.5,$valor["enlaceNov"],1,0,'C');
            }
            else{
                $pdf->Cell(160,7.5,$valor["enlace"],1,0,'C');
            }
            $pdf->Ln();
            $pdf->SetXY(5, 90);
            $pdf->Cell(35,7.5,'Validado',1,0,'C');

            if($valor["validado"]==0){
                $pdf->Cell(160,7.5,"Pendiente de validar",1,0,'C');
            }
            else if($valor["validado"]==-1){
                $pdf->Cell(160,7.5,"No validado",1,0,'C');
            }
            else if($valor["validado"]==1){
                $pdf->Cell(160,7.5,"Validado",1,0,'C');
            }
            $pdf->Ln();

            $pdf->SetXY(5, 105);
            $pdf->Cell(35,7.5,'Categorias',1,0,'C');
            //$pdf->Cell(45,7.5,$valor["tituloIngles"],1,0,'C');
            $sql5="SELECT categorias.nombre FROM `novelas_categoria` INNER JOIN categorias 
                  WHERE novelas_categoria.idCategoria=categorias.idCategoria AND idNovelas='$idNovActu'";
                $resultado5 = mysqli_query($conexion, $sql5) or die(mysqli_error($conexion));

                if (!$resultado5) {
                    responderError("Error al conseguir la imagen de la novela del ususario " . mysqli_error($conexion), $conexion);
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
                        $pdf->Cell(160,7.5, "Ninguna categoria",1,0,'C');
                    }
                    else{
                        $pdf->Cell(160,7.5, utf8_decode($categorias),1,0,'C');
                    }


                }



            $pdf->Line(5, 115, 200, 115);


            $pdf->Ln();
            $pdf->SetXY(30, 123);
            $pdf->Cell(50,7.5,'Foto del usuario',1,0,'C');
            $pdf->Cell(35,7.5,'',0,0,'C');
            $pdf->Cell(50,7.5,'Foto original de la novela',1,0,'C');
            $pdf->Ln();

            $sql = "SELECT * FROM `novelas` WHERE idNovelas='$idNovActu';";

            $resultado = mysqli_query($conexion, $sql) or die(mysqli_error($conexion));
            if (!$resultado){
                responderError("Error al conseguir la imagen de la novela " . mysqli_error($conexion), $conexion);
            } 
            else{

                $sql2 = "SELECT * FROM `usuario_novelas` WHERE idNovelas='$idNovActu' AND idUsuario='$id';";
                $resultado2 = mysqli_query($conexion, $sql2) or die(mysqli_error($conexion));

                if (!$resultado2) {
                    responderError("Error al conseguir la imagen de la novela del ususario " . mysqli_error($conexion), $conexion);
                } 
                else{
                    $fila2 = mysqli_fetch_assoc($resultado2);
                    $fila = mysqli_fetch_assoc($resultado);

                    $pdf->SetXY(30, 123);
                    if($fila2['Foto']!=null){
                        if($adm==0){
                        $tipo_foto2=$fila2['formato'];
                        $formato2=substr($tipo_foto2,  6, 9);
                        
                        if($formato2=="webp"){
                            $pdf->Image("../nSuported.png",30,132,50,75,"png");
                        
                        }
                        else{
                            $pdf->Image("http://localhost/proyectoFinal/Novela/verFotoNovela.php?n=".$valor["idNovelas"]."&p=".$id,30,132,50,75,$formato2);
                        }
                        }
                        else {
                            $tipo_foto2=$fila2['formato'];
                            $formato2=substr($tipo_foto2,  6, 9);
                            $pdf->Image("../NIMG.png",30,130,50,75,"png");
                        }
                    }
                    else {
                        $tipo_foto2=$fila2['formato'];
                        $formato2=substr($tipo_foto2,  6, 9);
                        $pdf->Image("../NIMG.png",30,132,50,75,"png");
                     
                    }
                    $pdf->Cell(30,7.5,'',0,0,'C');
                    if($fila['foto']!=null){
                        $tipo_foto=$fila['formato'];
                        $formato=substr($tipo_foto,  6, 9);
                        
                        if($formato=="webp"){
                            $pdf->Image("../nSuported.png",115,130,50,75,"png");
                        
                        }
                        else{
                             $pdf->Image("http://localhost/proyectoFinal/Novela/verFotoNovelaBD.php?n=".$valor["idNovelas"] ,115,130,50,75,$formato);
                        }
                      }
                    else{
                        $tipo_foto2=$fila2['formato'];
                        $formato2=substr($tipo_foto2,  6, 9);
                        $pdf->Image("../NIMG.png",115,130,50,75,"png");                     
                    }                    
                }
            }      

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