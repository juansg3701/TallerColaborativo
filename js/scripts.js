const facturas = [{"no":"345345","fecha":"2017-07-21","pago":"Crédito","plazo":"30","total":"$234.454"},
                {"no":"872034","fecha":"2020-06-25","pago":"Contado","plazo":"","total":"$7.435.246"},
                {"no":"293658","fecha":"2018-12-04","pago":"Crédito","plazo":"90","total":"$932.937"}];



var abonosFactura= [];
var abonosGeneral=[];
     

      $( () => {



      	$('#tablaDetalle').fadeOut('slow');
         $('#tablaCartera').fadeOut('slow');
        $('#tabla1').DataTable({
                  "data" : facturas,
                  "columns": [
                    {"data": "no"},
                    {"data": "fecha"},
                    {"data": "pago"},
                    {"data":"plazo"},
                    {"data":"total"}
                   ]
                });

        for( f of facturas){
                $('#select1').append( new Option( f.no,f.no));

                document.getElementById("saldo1").value=facturas[0].total;
                document.getElementById("nuevosaldo").value=0;
                
            }

             $("#valorabono").keypress(function(e) {
               valoresIniciales();
                 
                    
            });

            $('select').on('change',()=>{
            	$('#tablaDetalle').fadeOut('slow');
            	$('#tablaCartera').fadeOut('slow');
               	valoresIniciales();

            });

            $('#abonoBoton').click(function(){
            	$('#tablaDetalle').fadeOut('slow');
            	$('#tablaCartera').fadeOut('slow');
                var fact= $('#select1 option:selected').val();
                var valorAbono1 = document.getElementById("valorabono").value;
                var saldoValidar = document.getElementById("nuevosaldo").value;
                var noF=0, fecha="",tipo="",plazoR="",saldo=0;
                var valorAb=quitarPuntosSigno(valorAbono1);
                var saldoF=quitarPuntosSigno(saldoValidar);

                for(f of facturas){
                    if(f.no==fact){
                        noF=f.no;
                        saldo=f.total;
                        fecha=f.fecha;
                        tipo=f.pago;
                        plazoR=f.plazo;

                    }
                }

                if(document.getElementById("observacionesA").value!=""){
                    if(document.getElementById("valorabono").value!=""){
                        if(tipo!="Contado"){
                            if(saldoF>=0){

                       

            
                var saldoS=quitarPuntosSigno(saldo);

                var noAb=1;
                var ident=abonosFactura.length;
                
                for(a of abonosFactura){
                    if(noF==a.noFactura){
                        noAb++;
                        saldoS=a.saldo;
                    }
                }
                var saldoF=parseInt(saldoS)-parseInt(valorAb);
                var fechaGuadar="";

                if(tipo=="Crédito"){
                var fechaNueva = new Date(fecha);
            
                fechaNueva.setDate(fechaNueva.getDate() + parseInt(plazoR));

                fechaGuadar=fechaNueva.toISOString().slice(0,10);
                }else{
                    fechaGuadar=fecha;
                }
                var obser=document.getElementById('observacionesA').value;
       
                abonosFactura.push({"identificador":ident,"observaciones":obser,"noFactura": noF, "noAbono": noAb,"valorAbono":valorAb,"fechaVencimiento":fechaGuadar,"saldo":saldoF});
    

                var ntAbonos=0;
                var valida=false,identAb=0;

                for(a of abonosFactura){
                    if(noF==a.noFactura){
                       ntAbonos=ntAbonos+parseInt(a.valorAbono);
                    }
                }

                 for(a of abonosGeneral){
                    
                    if(noF==a.noFactura){
                       valida=true;
                       identAb=a.identificador;
                    }
                }
                    if(valida==false){
                        abonosGeneral.push({"identificador":abonosGeneral.length,"plazo":plazoR,"noFactura": noF, "noAbono": noAb,"valorAbono":ntAbonos,"fechaVencimiento":fechaGuadar,"saldo":saldoF}); 
                    }else{
                        abonosGeneral[identAb].noAbono=noAb;
                        abonosGeneral[identAb].valorAbono=ntAbonos;
                        abonosGeneral[identAb].fechaVencimiento=fechaGuadar;
                        abonosGeneral[identAb].saldo=saldoF;

                    }

                    	document.getElementById("tableid").innerHTML="";
                    for (a of abonosGeneral) {

                    	var abono=ponerPuntosSigno(a.valorAbono.toString());
                    	var saldo=ponerPuntosSigno(a.saldo.toString());
                        document.getElementById("tableid").innerHTML+="<tr><td>"+a.noFactura+
                        "</td>"+"<td>"+a.noAbono+"</td>"+"<td>"+abono+"</td>"+"<td>"+
                        a.fechaVencimiento+"</td>"+"<td>"+saldo+"</td>"+"<td>"+
                        "<button  value="+a.noFactura+" onclick=\"prueba(this.value);\"> <img src=\"./source/lupa.jpg\" width=\"30\" height=\"30\"></button>"
                        +"</td></tr>";
                    }
                    	
                valoresIniciales();
                            }else{
                    alert("Operación no permitida");
                        }

                        }else{
                    alert("Seleccione una factura de crédito");
                        }

                    } else{
                    alert("Ingrese un valor");
                }  
                }else{
                    alert("Ingrese una observación");
                }

            });

            $('#cancelarBoton').click(function(){
            	$('#tablaDetalle').fadeOut('slow');
            	$('#tablaCartera').fadeOut('slow');
                document.getElementById("observacionesA").value="";
                document.getElementById("nuevosaldo").value=0;
                document.getElementById("valorabono").value="";

	            });

            $('#carteraBoton').click(function(){
            	document.getElementById("tablaCarteraB").innerHTML="";

            	 var fecha = new Date();
                    for (a of abonosGeneral) {
                    	var fechaP = new Date(a.fechaVencimiento);
                    	var resta=Math.round((fecha.getTime()-fechaP.getTime())/ (1000*60*60*24));

                    	if(fechaP<fecha && a.plazo>0 && a.plazo<30){
                    	document.getElementById("tablaCarteraB").innerHTML+="<tr><td>"+"Entre 0 y 29 días"+"</td>"+"<td>"+a.noFactura+
                        "</td>"+"<td>"+a.fechaVencimiento+"</td>"+"<td>"+ponerPuntosSigno(a.saldo.toString())+"</td></tr>";
                    	}
                    	if(fechaP<fecha && a.plazo>=30 && a.plazo<60){
                    		document.getElementById("tablaCarteraB").innerHTML+="<tr><td>"+"Entre 30 y 59 días"+"</td>"+"<td>"+a.noFactura+
                        "</td>"+"<td>"+a.fechaVencimiento+"</td>"+"<td>"+ponerPuntosSigno(a.saldo.toString())+"</td></tr>";
                    	}
                    	if(fechaP<fecha && a.plazo>=60 && a.plazo<=90){
                    		document.getElementById("tablaCarteraB").innerHTML+="<tr><td>"+"Entre 60 y 90 días"+"</td>"+"<td>"+a.noFactura+
                        "</td>"+"<td>"+a.fechaVencimiento+"</td>"+"<td>"+ponerPuntosSigno(a.saldo.toString())+"</td></tr>";
                    	}
                    	
                    }

            	$('#tablaCartera').fadeIn('slow');

	            });

       

        });
     

function format(input)
{
const abono =$('#valorabono')
        var final = String(abono.val()).replace(/\D/g, "");
        var cantidad = parseInt(abono.val().replace(/[^a-zA-Z0-9]/g, ''))
        const nuevoValor = new Intl.NumberFormat('en-US').format(final)
        abono.val("$"+nuevoValor)
 valoresIniciales();
}

function ponerPuntosSigno(input)
{
 var num = input.replace(/\./g,'');
				num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
				num = num.split('').reverse().join('').replace(/^[\.]/,'');
                var nuevoValor="";
                for (var i = 0; i <num.length; i++) {
                    if(i==0){
                        nuevoValor="$";
                        nuevoValor=nuevoValor+num[i];
                    }else{
                        nuevoValor=nuevoValor+num[i];
                    }
                }
                return nuevoValor;
}

function quitarPuntosSigno(input){
	var valorTotal="";
                for(var i=0; i<input.length;i++){


                    if(input[i]!="$" && input[i]!="." && input[i]!=","){
                        valorTotal=valorTotal+input[i];
                    }
                }
      var valorInt=parseInt(valorTotal); 
            return valorInt;
}



function prueba(id){
	document.getElementById("tablaDetalleB").innerHTML="";
                    for (a of abonosFactura) {
                    	if(id==a.noFactura){
                    	document.getElementById("tablaDetalleB").innerHTML+="<tr><td>"+a.noFactura+
                        "</td>"+"<td>"+a.noAbono+"</td>"+"<td>"+ponerPuntosSigno(a.valorAbono.toString())+"</td>"+"<td>"+a.observaciones+"</td>"+"<td>"+
                        ponerPuntosSigno(a.saldo.toString())+"</td></tr>";
                    	}
                        
                    }

	$('#tablaDetalle').fadeIn('slow');
}

function valoresIniciales(){
	 var fact= $('#select1 option:selected').val();
                var total=0;
                for(f of facturas){
                    if(f.no==fact){
                        total=f.total;
                    }
                }
                var valorSaldo=0;
                for(a of abonosFactura){
                	if(fact==a.noFactura){
                		valorSaldo=a.saldo;
                	}
                }

                if(valorSaldo!=0){	

                var valorSt=valorSaldo.toString();
               var respuesta1 =ponerPuntosSigno(valorSt);
                document.getElementById("saldo1").value=respuesta1;
                }else{
                	document.getElementById("saldo1").value=total;
                }
                	
                var total3=	document.getElementById("saldo1").value;
                var valorTotal=quitarPuntosSigno(total3);
                var abono = document.getElementById("valorabono").value;
                var abonoStr=quitarPuntosSigno(abono);

                var resta=parseInt(valorTotal)-parseInt(abonoStr);
                var restS=resta.toString();
                var respuesta2= ponerPuntosSigno(restS);

                if(restS>0){

                document.getElementById("nuevosaldo").value=respuesta2;
                }else{

                document.getElementById("nuevosaldo").value="Invalido";
                }
}