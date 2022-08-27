function acc(fila, columna){
  turno=document.getElementById("mon_turno").value;
  movimiento=document.getElementById("mon_movim").value;

  if(movimiento=="origen"){

    //Seleccionando ficha del jugador de turno  => Si la ficha_color no es igual a turno no se hace nada en modo "origen" solo puedo mover fichas propias
    ficha=document.getElementById("f_"+fila+"_"+columna).alt;       //Obtengo los datos de la ficha que estoy agarrando
    ficha_color=ficha.slice(0,1);                                   //Con los datos de la ficha obtengo el color
    ficha_tipo=ficha.slice(2,20);                                   //y el tipo de ficha
    if(ficha_color==turno){                                         //Controlo que el color de la ficha coincida con el color de quien tiene el turno 

      fila_ant=document.getElementById("mon_ori_f").value;
      columna_ant=document.getElementById("mon_ori_c").value;
      
      div_sel=document.getElementById("c_"+fila+"_"+columna);
      div_sel.classList.add("casillero_lleno_turno_sel");
      div_sel.classList.remove("casillero_lleno_turno");

      document.getElementById("mon_ori_ficha").value=ficha_tipo;
      document.getElementById("mon_ori_f").value=fila;
      document.getElementById("mon_ori_c").value=columna;

      //Estilo para celdas identificadas como posibles destinos:
      movimientos=identificarDestinos(ficha_tipo, turno, fila, columna);
      n=movimientos.length;
      for(i=0;i<n;i++){
        document.getElementById("c_"+movimientos[i][0]+"_"+movimientos[i][1]).classList.add("casillero_destino");
      }
      //cambio el movimiento esperado de origen a destino para el siguiente paso
      document.getElementById("mon_movim").value="destino";

    }

  }else if(movimiento=="destino"){
    //seleccionando casilla destino:
    //  Si selecciono la misma casilla....la desmarco y vuelvo al movimiento esperado=origen
    //  Si selecciono otro casilla:
    //        Si está está en los posibles destinos:  se mueve => deja origen vacío y lleva la ficha al destino
    //        Sino:                                   no hace nada
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    fila_ori=document.getElementById("mon_ori_f").value;
    columna_ori=document.getElementById("mon_ori_c").value;
    if(fila==fila_ori&&columna==columna_ori){
    //  Si selecciono la misma casilla....la desmarco y vuelvo al movimiento esperado=origen
      div_desmarcado=document.getElementById("c_"+fila+"_"+columna);
      div_desmarcado.classList.remove("casillero_lleno_turno_sel");
      div_desmarcado.classList.add("casillero_lleno_turno");

      document.getElementById("mon_movim").value="origen";
      document.getElementById("mon_ori_ficha").value="";
      document.getElementById("mon_ori_f").value="";
      document.getElementById("mon_ori_c").value="";
      
      //  Desmarco selección anterior
      divs=document.getElementsByClassName("casillero_destino");
      n=divs.length;
      for(i=0;i<n;i++){                                               //el bucle se recorre n veces según la cantidad de elementos dentro de "divs"
        if(divs[0]){                                                  //pero siempre se quita la clase al elemento 0, porque a medida que se quita la clase
          divs[0].classList.remove("casillero_destino");              //se va reduciendo la cantidad de elementos que quedan dentro de "divs"
        }
      }

    }else{
    //  Si selecciono otro casilla:
    //        Si está está en los posibles destinos:  se mueve => deja origen vacío y lleva la ficha al destino
    //        Sino:                                   no hace nada
      ficha_ori=document.getElementById("mon_ori_ficha").value;
      turno=document.getElementById("mon_turno").value;
      fila_ori=document.getElementById("mon_ori_f").value;
      columna_ori=document.getElementById("mon_ori_c").value;
      movimientos=identificarDestinos(ficha_ori, turno, fila_ori, columna_ori);
      n=movimientos.length;
      for(i=0;i<n;i++){
        if(fila==movimientos[i][0]&&columna==movimientos[i][1]){
          // Se deja casilla de origen vacía
          document.getElementById("f_"+fila_ori+"_"+columna_ori).src="img/empty.png";
          document.getElementById("f_"+fila_ori+"_"+columna_ori).alt="";
          document.getElementById("c_"+fila_ori+"_"+columna_ori).classList.remove("casillero_lleno_turno_sel");
          document.getElementById("c_"+fila_ori+"_"+columna_ori).classList.remove("casillero_lleno_turno");
          document.getElementById("c_"+fila_ori+"_"+columna_ori).classList.add("casillero_vacio");

          // Se llevan los datos de la casilla/ficha origen al destino
          document.getElementById("f_"+fila+"_"+columna).src="img/fch_"+turno+"_"+ficha_ori+".png";
          document.getElementById("f_"+fila+"_"+columna).alt=turno+"_"+ficha_ori;
          document.getElementById("c_"+fila+"_"+columna).classList.remove("casillero_lleno_turno_sel");
          document.getElementById("c_"+fila+"_"+columna).classList.add("casillero_lleno_turno");
          document.getElementById("c_"+fila+"_"+columna).classList.remove("casillero_vacio");
          document.getElementById("c_"+fila+"_"+columna).classList.remove("casillero_lleno_rival");

          //  Desmarco todas las casillas marcadas como posibles destinos
          divs=document.getElementsByClassName("casillero_destino");
          n=divs.length;
          for(i=0;i<n;i++){                                               //el bucle se recorre n veces según la cantidad de elementos dentro de "divs"
            if(divs[0]){                                                  //pero siempre se quita la clase al elemento 0, porque a medida que se quita la clase
              divs[0].classList.remove("casillero_destino");              //se va reduciendo la cantidad de elementos que quedan dentro de "divs"
            }
          }

          // En el monitor desmarco origen/destino y paso el turno:
          document.getElementById("mon_movim").value="origen";
          document.getElementById("mon_ori_ficha").value="";
          document.getElementById("mon_ori_f").value="";
          document.getElementById("mon_ori_c").value="";
          if(turno=="b"){
            document.getElementById("mon_turno").value="n";
          }else{
            document.getElementById("mon_turno").value="b";
          }

          //Se completó el movimiento => se invierten las clases turno propio vs turno rival
          divsI=document.getElementsByClassName("casillero_lleno_turno");        //Armar función que ejecute este procedimiento
          nI=divsI.length;                                                        //Parámetros para la función:
          for(i=0;i<nI;i++){                                                     //  clase a modificar
            if(divsI[0]){                                                        //  nueva clase
              divsI[0].classList.add("temporal");
              divsI[0].classList.remove("casillero_lleno_turno");
            }
          }
          divsF=document.getElementsByClassName("casillero_lleno_rival");
          nF=divsF.length;
          for(i=0;i<nF;i++){
            if(divsF[0]){
              divsF[0].classList.add("casillero_lleno_turno");
              divsF[0].classList.remove("casillero_lleno_rival");
            }
          }
          divsT=document.getElementsByClassName("temporal");
          nT=divsT.length;
          for(i=0;i<nT;i++){
            if(divsT[0]){
              divsT[0].classList.add("casillero_lleno_rival");
              divsT[0].classList.remove("temporal");
            }
          }
        }
      }
    }
  }
}

function identificarDestinos(ficha_tipo, ficha_color, pfila, pcolumna){
  fila=parseInt(pfila);
  columna=parseInt(pcolumna);
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //Defino array con los intentos de movimiento según la ficha
    arrayMov=new Array(2);
    arrayMov[0]=ficha_tipo;
    switch(ficha_tipo){
      case "peon":
        arrayMov[1]=new Array(4);                           //tres posibilidades para moverse: avanzar 1 (solo sin comer), avanzar 2(solo sin comer, solo 1er mov), 1 en diagonal (solo comer)
        //dirección 1:
        arrayMov[1][0]=new Array(3);
        arrayMov[1][0][0]=new Array(1);                     //array de destinos posibles para una dirección...
        arrayMov[1][0][0][0]=new Array(2);
        arrayMov[1][0][0][0][0]=1;                          //avance en fila
        arrayMov[1][0][0][0][1]=0;                          //avance en columna
        arrayMov[1][0][1]="SC";                             //SC: sin control
        arrayMov[1][0][2]="R2";                             //R2: restricción 2=>solo destino vacío no puede comer
        //dirección 2:
        arrayMov[1][1]=new Array(3);
        arrayMov[1][1][0]=new Array(2);
        arrayMov[1][1][0][0]=new Array(2);
        arrayMov[1][1][0][0][0]=1;                          //avance en fila
        arrayMov[1][1][0][0][1]=0;                          //avance en columna
        arrayMov[1][1][0][1]=new Array(2);
        arrayMov[1][1][0][1][0]=2;                          //avance en fila
        arrayMov[1][1][0][1][1]=0;                          //avance en columna
        arrayMov[1][1][1]="R";                              //R: restringido solo para el primer movimiento
        arrayMov[1][1][2]="R2";                             //R2: restricción 2=>solo destino vacío no puede comer
        //dirección 3:
        arrayMov[1][2]=new Array(3);
        arrayMov[1][2][0]=new Array(1);
        arrayMov[1][2][0][0]=new Array(2);
        arrayMov[1][2][0][0][0]=1;                          //avance en fila
        arrayMov[1][2][0][0][1]=1;                          //avance en columna
        arrayMov[1][2][1]="SC";                             //SC: sin control
        arrayMov[1][2][2]="R1";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 4:
        arrayMov[1][3]=new Array(3);
        arrayMov[1][3][0]=new Array(1);
        arrayMov[1][3][0][0]=new Array(2);
        arrayMov[1][3][0][0][0]=1;                          //avance en fila
        arrayMov[1][3][0][0][1]=-1;                          //avance en columna
        arrayMov[1][3][1]="SC";                             //SC: sin control
        arrayMov[1][3][2]="R1";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        break;

      case "torre":
        arrayMov[1]=new Array(4);                           //cuatro posibles movimientos: arriba, abajo, derecha, izquierda
        //dirección 1:
        arrayMov[1][0]=new Array(3);
        arrayMov[1][0][0]=new Array(7);
        arrayMov[1][0][0][0]=new Array(2);
        arrayMov[1][0][0][0][0]=1;                          //avance en fila
        arrayMov[1][0][0][0][1]=0;                          //avance en columna
        arrayMov[1][0][0][1]=new Array(2);
        arrayMov[1][0][0][1][0]=2;                          //avance en fila
        arrayMov[1][0][0][1][1]=0;                          //avance en columna
        arrayMov[1][0][0][2]=new Array(2);
        arrayMov[1][0][0][2][0]=3;                          //avance en fila
        arrayMov[1][0][0][2][1]=0;                          //avance en columna
        arrayMov[1][0][0][3]=new Array(2);
        arrayMov[1][0][0][3][0]=4;                          //avance en fila
        arrayMov[1][0][0][3][1]=0;                          //avance en columna
        arrayMov[1][0][0][4]=new Array(2);
        arrayMov[1][0][0][4][0]=5;                          //avance en fila
        arrayMov[1][0][0][4][1]=0;                          //avance en columna
        arrayMov[1][0][0][5]=new Array(2);
        arrayMov[1][0][0][5][0]=6;                          //avance en fila
        arrayMov[1][0][0][5][1]=0;                          //avance en columna
        arrayMov[1][0][0][6]=new Array(2);
        arrayMov[1][0][0][6][0]=7;                          //avance en fila
        arrayMov[1][0][0][6][1]=0;                          //avance en columna
        arrayMov[1][0][1]="SC";                             //SC: sin control
        arrayMov[1][0][2]="SC";                             //SC: sin control
        //dirección 2:
        arrayMov[1][1]=new Array(3);
        arrayMov[1][1][0]=new Array(7);
        arrayMov[1][1][0][0]=new Array(2);
        arrayMov[1][1][0][0][0]=-1;                          //avance en fila
        arrayMov[1][1][0][0][1]=0;                          //avance en columna
        arrayMov[1][1][0][1]=new Array(2);
        arrayMov[1][1][0][1][0]=-2;                          //avance en fila
        arrayMov[1][1][0][1][1]=0;                          //avance en columna
        arrayMov[1][1][0][2]=new Array(2);
        arrayMov[1][1][0][2][0]=-3;                          //avance en fila
        arrayMov[1][1][0][2][1]=0;                          //avance en columna
        arrayMov[1][1][0][3]=new Array(2);
        arrayMov[1][1][0][3][0]=-4;                          //avance en fila
        arrayMov[1][1][0][3][1]=0;                          //avance en columna
        arrayMov[1][1][0][4]=new Array(2);
        arrayMov[1][1][0][4][0]=-5;                          //avance en fila
        arrayMov[1][1][0][4][1]=0;                          //avance en columna
        arrayMov[1][1][0][5]=new Array(2);
        arrayMov[1][1][0][5][0]=-6;                          //avance en fila
        arrayMov[1][1][0][5][1]=0;                          //avance en columna
        arrayMov[1][1][0][6]=new Array(2);
        arrayMov[1][1][0][6][0]=-7;                          //avance en fila
        arrayMov[1][1][0][6][1]=0;                          //avance en columna
        arrayMov[1][1][1]="SC";                             //SC: sin control
        arrayMov[1][1][2]="SC";                             //SC: sin control
        //dirección 3:
        arrayMov[1][2]=new Array(3);
        arrayMov[1][2][0]=new Array(7);
        arrayMov[1][2][0][0]=new Array(2);
        arrayMov[1][2][0][0][0]=0;                          //avance en fila
        arrayMov[1][2][0][0][1]=1;                          //avance en columna
        arrayMov[1][2][0][1]=new Array(2);
        arrayMov[1][2][0][1][0]=0;                          //avance en fila
        arrayMov[1][2][0][1][1]=2;                          //avance en columna
        arrayMov[1][2][0][2]=new Array(2);
        arrayMov[1][2][0][2][0]=0;                          //avance en fila
        arrayMov[1][2][0][2][1]=3;                          //avance en columna
        arrayMov[1][2][0][3]=new Array(2);
        arrayMov[1][2][0][3][0]=0;                          //avance en fila
        arrayMov[1][2][0][3][1]=4;                          //avance en columna
        arrayMov[1][2][0][4]=new Array(2);
        arrayMov[1][2][0][4][0]=0;                          //avance en fila
        arrayMov[1][2][0][4][1]=5;                          //avance en columna
        arrayMov[1][2][0][5]=new Array(2);
        arrayMov[1][2][0][5][0]=0;                          //avance en fila
        arrayMov[1][2][0][5][1]=6;                          //avance en columna
        arrayMov[1][2][0][6]=new Array(2);
        arrayMov[1][2][0][6][0]=0;                          //avance en fila
        arrayMov[1][2][0][6][1]=7;                          //avance en columna
        arrayMov[1][2][1]="SC";                             //SC: sin control
        arrayMov[1][2][2]="SC";                             //SC: sin control
        //dirección 4:
        arrayMov[1][3]=new Array(3);
        arrayMov[1][3][0]=new Array(7);
        arrayMov[1][3][0][0]=new Array(2);
        arrayMov[1][3][0][0][0]=0;                          //avance en fila
        arrayMov[1][3][0][0][1]=-1;                          //avance en columna
        arrayMov[1][3][0][1]=new Array(2);
        arrayMov[1][3][0][1][0]=0;                          //avance en fila
        arrayMov[1][3][0][1][1]=-2;                          //avance en columna
        arrayMov[1][3][0][2]=new Array(2);
        arrayMov[1][3][0][2][0]=0;                          //avance en fila
        arrayMov[1][3][0][2][1]=-3;                          //avance en columna
        arrayMov[1][3][0][3]=new Array(2);
        arrayMov[1][3][0][3][0]=0;                          //avance en fila
        arrayMov[1][3][0][3][1]=-4;                          //avance en columna
        arrayMov[1][3][0][4]=new Array(2);
        arrayMov[1][3][0][4][0]=0;                          //avance en fila
        arrayMov[1][3][0][4][1]=-5;                          //avance en columna
        arrayMov[1][3][0][5]=new Array(2);
        arrayMov[1][3][0][5][0]=0;                          //avance en fila
        arrayMov[1][3][0][5][1]=-6;                          //avance en columna
        arrayMov[1][3][0][6]=new Array(2);
        arrayMov[1][3][0][6][0]=0;                          //avance en fila
        arrayMov[1][3][0][6][1]=-7;                          //avance en columna
        arrayMov[1][3][1]="SC";                             //SC: sin control
        arrayMov[1][3][2]="SC";                             //SC: sin control
        break;

      case "reina":
          arrayMov[1]=new Array(8);                           //ocho  posibilidades para moverse: en cualquier dirección todas las casillas
          //dirección 1:
          arrayMov[1][0]=new Array(3);
          arrayMov[1][0][0]=new Array(7);
          arrayMov[1][0][0][0]=new Array(2);
          arrayMov[1][0][0][0][0]=1;                          //avance en fila
          arrayMov[1][0][0][0][1]=0;                          //avance en columna
          arrayMov[1][0][0][1]=new Array(2);
          arrayMov[1][0][0][1][0]=2;                          //avance en fila
          arrayMov[1][0][0][1][1]=0;                          //avance en columna
          arrayMov[1][0][0][2]=new Array(2);
          arrayMov[1][0][0][2][0]=3;                          //avance en fila
          arrayMov[1][0][0][2][1]=0;                          //avance en columna
          arrayMov[1][0][0][3]=new Array(2);
          arrayMov[1][0][0][3][0]=4;                          //avance en fila
          arrayMov[1][0][0][3][1]=0;                          //avance en columna
          arrayMov[1][0][0][4]=new Array(2);
          arrayMov[1][0][0][4][0]=5;                          //avance en fila
          arrayMov[1][0][0][4][1]=0;                          //avance en columna
          arrayMov[1][0][0][5]=new Array(2);
          arrayMov[1][0][0][5][0]=6;                          //avance en fila
          arrayMov[1][0][0][5][1]=0;                          //avance en columna
          arrayMov[1][0][0][6]=new Array(2);
          arrayMov[1][0][0][6][0]=7;                          //avance en fila
          arrayMov[1][0][0][6][1]=0;                          //avance en columna
          arrayMov[1][0][1]="SC";                             //SC: sin control
          arrayMov[1][0][2]="SC";                             //SC: sin control
          //dirección 2:
          arrayMov[1][1]=new Array(3);
          arrayMov[1][1][0]=new Array(7);
          arrayMov[1][1][0][0]=new Array(2);
          arrayMov[1][1][0][0][0]=-1;                          //avance en fila
          arrayMov[1][1][0][0][1]=0;                          //avance en columna
          arrayMov[1][1][0][1]=new Array(2);
          arrayMov[1][1][0][1][0]=-2;                          //avance en fila
          arrayMov[1][1][0][1][1]=0;                          //avance en columna
          arrayMov[1][1][0][2]=new Array(2);
          arrayMov[1][1][0][2][0]=-3;                          //avance en fila
          arrayMov[1][1][0][2][1]=0;                          //avance en columna
          arrayMov[1][1][0][3]=new Array(2);
          arrayMov[1][1][0][3][0]=-4;                          //avance en fila
          arrayMov[1][1][0][3][1]=0;                          //avance en columna
          arrayMov[1][1][0][4]=new Array(2);
          arrayMov[1][1][0][4][0]=-5;                          //avance en fila
          arrayMov[1][1][0][4][1]=0;                          //avance en columna
          arrayMov[1][1][0][5]=new Array(2);
          arrayMov[1][1][0][5][0]=-6;                          //avance en fila
          arrayMov[1][1][0][5][1]=0;                          //avance en columna
          arrayMov[1][1][0][6]=new Array(2);
          arrayMov[1][1][0][6][0]=-7;                          //avance en fila
          arrayMov[1][1][0][6][1]=0;                          //avance en columna
          arrayMov[1][1][1]="SC";                             //SC: sin control
          arrayMov[1][1][2]="SC";                             //SC: sin control
          //dirección 3:
          arrayMov[1][2]=new Array(3);
          arrayMov[1][2][0]=new Array(7);
          arrayMov[1][2][0][0]=new Array(2);
          arrayMov[1][2][0][0][0]=0;                          //avance en fila
          arrayMov[1][2][0][0][1]=1;                          //avance en columna
          arrayMov[1][2][0][1]=new Array(2);
          arrayMov[1][2][0][1][0]=0;                          //avance en fila
          arrayMov[1][2][0][1][1]=2;                          //avance en columna
          arrayMov[1][2][0][2]=new Array(2);
          arrayMov[1][2][0][2][0]=0;                          //avance en fila
          arrayMov[1][2][0][2][1]=3;                          //avance en columna
          arrayMov[1][2][0][3]=new Array(2);
          arrayMov[1][2][0][3][0]=0;                          //avance en fila
          arrayMov[1][2][0][3][1]=4;                          //avance en columna
          arrayMov[1][2][0][4]=new Array(2);
          arrayMov[1][2][0][4][0]=0;                          //avance en fila
          arrayMov[1][2][0][4][1]=5;                          //avance en columna
          arrayMov[1][2][0][5]=new Array(2);
          arrayMov[1][2][0][5][0]=0;                          //avance en fila
          arrayMov[1][2][0][5][1]=6;                          //avance en columna
          arrayMov[1][2][0][6]=new Array(2);
          arrayMov[1][2][0][6][0]=0;                          //avance en fila
          arrayMov[1][2][0][6][1]=7;                          //avance en columna
          arrayMov[1][2][1]="SC";                             //SC: sin control
          arrayMov[1][2][2]="SC";                             //SC: sin control
          //dirección 4:
          arrayMov[1][3]=new Array(3);
          arrayMov[1][3][0]=new Array(7);
          arrayMov[1][3][0][0]=new Array(2);
          arrayMov[1][3][0][0][0]=0;                          //avance en fila
          arrayMov[1][3][0][0][1]=-1;                          //avance en columna
          arrayMov[1][3][0][1]=new Array(2);
          arrayMov[1][3][0][1][0]=0;                          //avance en fila
          arrayMov[1][3][0][1][1]=-2;                          //avance en columna
          arrayMov[1][3][0][2]=new Array(2);
          arrayMov[1][3][0][2][0]=0;                          //avance en fila
          arrayMov[1][3][0][2][1]=-3;                          //avance en columna
          arrayMov[1][3][0][3]=new Array(2);
          arrayMov[1][3][0][3][0]=0;                          //avance en fila
          arrayMov[1][3][0][3][1]=-4;                          //avance en columna
          arrayMov[1][3][0][4]=new Array(2);
          arrayMov[1][3][0][4][0]=0;                          //avance en fila
          arrayMov[1][3][0][4][1]=-5;                          //avance en columna
          arrayMov[1][3][0][5]=new Array(2);
          arrayMov[1][3][0][5][0]=0;                          //avance en fila
          arrayMov[1][3][0][5][1]=-6;                          //avance en columna
          arrayMov[1][3][0][6]=new Array(2);
          arrayMov[1][3][0][6][0]=0;                          //avance en fila
          arrayMov[1][3][0][6][1]=-7;                          //avance en columna
          arrayMov[1][3][1]="SC";                             //SC: sin control
          arrayMov[1][3][2]="SC";                             //SC: sin control
          //dirección 5:
          arrayMov[1][4]=new Array(3);
          arrayMov[1][4][0]=new Array(7);
          arrayMov[1][4][0][0]=new Array(2);
          arrayMov[1][4][0][0][0]=1;                          //avance en fila
          arrayMov[1][4][0][0][1]=1;                          //avance en columna
          arrayMov[1][4][0][1]=new Array(2);
          arrayMov[1][4][0][1][0]=2;                          //avance en fila
          arrayMov[1][4][0][1][1]=2;                          //avance en columna
          arrayMov[1][4][0][2]=new Array(2);
          arrayMov[1][4][0][2][0]=3;                          //avance en fila
          arrayMov[1][4][0][2][1]=3;                          //avance en columna
          arrayMov[1][4][0][3]=new Array(2);
          arrayMov[1][4][0][3][0]=4;                          //avance en fila
          arrayMov[1][4][0][3][1]=4;                          //avance en columna
          arrayMov[1][4][0][4]=new Array(2);
          arrayMov[1][4][0][4][0]=5;                          //avance en fila
          arrayMov[1][4][0][4][1]=5;                          //avance en columna
          arrayMov[1][4][0][5]=new Array(2);
          arrayMov[1][4][0][5][0]=6;                          //avance en fila
          arrayMov[1][4][0][5][1]=6;                          //avance en columna
          arrayMov[1][4][0][6]=new Array(2);
          arrayMov[1][4][0][6][0]=7;                          //avance en fila
          arrayMov[1][4][0][6][1]=7;                          //avance en columna
          arrayMov[1][4][1]="SC";                             //SC: sin control
          arrayMov[1][4][2]="SC";                             //SC: sin control
          //dirección 6:
          arrayMov[1][5]=new Array(3);
          arrayMov[1][5][0]=new Array(7);
          arrayMov[1][5][0][0]=new Array(2);
          arrayMov[1][5][0][0][0]=-1;                          //avance en fila
          arrayMov[1][5][0][0][1]=-1;                          //avance en columna
          arrayMov[1][5][0][1]=new Array(2);
          arrayMov[1][5][0][1][0]=-2;                          //avance en fila
          arrayMov[1][5][0][1][1]=-2;                          //avance en columna
          arrayMov[1][5][0][2]=new Array(2);
          arrayMov[1][5][0][2][0]=-3;                          //avance en fila
          arrayMov[1][5][0][2][1]=-3;                          //avance en columna
          arrayMov[1][5][0][3]=new Array(2);
          arrayMov[1][5][0][3][0]=-4;                          //avance en fila
          arrayMov[1][5][0][3][1]=-4;                          //avance en columna
          arrayMov[1][5][0][4]=new Array(2);
          arrayMov[1][5][0][4][0]=-5;                          //avance en fila
          arrayMov[1][5][0][4][1]=-5;                          //avance en columna
          arrayMov[1][5][0][5]=new Array(2);
          arrayMov[1][5][0][5][0]=-6;                          //avance en fila
          arrayMov[1][5][0][5][1]=-6;                          //avance en columna
          arrayMov[1][5][0][6]=new Array(2);
          arrayMov[1][5][0][6][0]=-7;                          //avance en fila
          arrayMov[1][5][0][6][1]=-7;                          //avance en columna
          arrayMov[1][5][1]="SC";                             //SC: sin control
          arrayMov[1][5][2]="SC";                             //SC: sin control
          //dirección 7:
          arrayMov[1][6]=new Array(3);
          arrayMov[1][6][0]=new Array(7);
          arrayMov[1][6][0][0]=new Array(2);
          arrayMov[1][6][0][0][0]=-1;                          //avance en fila
          arrayMov[1][6][0][0][1]=1;                          //avance en columna
          arrayMov[1][6][0][1]=new Array(2);
          arrayMov[1][6][0][1][0]=-2;                          //avance en fila
          arrayMov[1][6][0][1][1]=2;                          //avance en columna
          arrayMov[1][6][0][2]=new Array(2);
          arrayMov[1][6][0][2][0]=-3;                          //avance en fila
          arrayMov[1][6][0][2][1]=3;                          //avance en columna
          arrayMov[1][6][0][3]=new Array(2);
          arrayMov[1][6][0][3][0]=-4;                          //avance en fila
          arrayMov[1][6][0][3][1]=4;                          //avance en columna
          arrayMov[1][6][0][4]=new Array(2);
          arrayMov[1][6][0][4][0]=-5;                          //avance en fila
          arrayMov[1][6][0][4][1]=5;                          //avance en columna
          arrayMov[1][6][0][5]=new Array(2);
          arrayMov[1][6][0][5][0]=-6;                          //avance en fila
          arrayMov[1][6][0][5][1]=6;                          //avance en columna
          arrayMov[1][6][0][6]=new Array(2);
          arrayMov[1][6][0][6][0]=-7;                          //avance en fila
          arrayMov[1][6][0][6][1]=7;                          //avance en columna
          arrayMov[1][6][1]="SC";                             //SC: sin control
          arrayMov[1][6][2]="SC";                             //SC: sin control
          //dirección 8:
          arrayMov[1][7]=new Array(3);
          arrayMov[1][7][0]=new Array(7);
          arrayMov[1][7][0][0]=new Array(2);
          arrayMov[1][7][0][0][0]=1;                          //avance en fila
          arrayMov[1][7][0][0][1]=-1;                          //avance en columna
          arrayMov[1][7][0][1]=new Array(2);
          arrayMov[1][7][0][1][0]=2;                          //avance en fila
          arrayMov[1][7][0][1][1]=-2;                          //avance en columna
          arrayMov[1][7][0][2]=new Array(2);
          arrayMov[1][7][0][2][0]=3;                          //avance en fila
          arrayMov[1][7][0][2][1]=-3;                          //avance en columna
          arrayMov[1][7][0][3]=new Array(2);
          arrayMov[1][7][0][3][0]=4;                          //avance en fila
          arrayMov[1][7][0][3][1]=-4;                          //avance en columna
          arrayMov[1][7][0][4]=new Array(2);
          arrayMov[1][7][0][4][0]=5;                          //avance en fila
          arrayMov[1][7][0][4][1]=-5;                          //avance en columna
          arrayMov[1][7][0][5]=new Array(2);
          arrayMov[1][7][0][5][0]=6;                          //avance en fila
          arrayMov[1][7][0][5][1]=-6;                          //avance en columna
          arrayMov[1][7][0][6]=new Array(2);
          arrayMov[1][7][0][6][0]=7;                          //avance en fila
          arrayMov[1][7][0][6][1]=-7;                          //avance en columna
          arrayMov[1][7][1]="SC";                             //SC: sin control
          arrayMov[1][7][2]="SC";                             //SC: sin control
          break;

      case "alfil":
        arrayMov[1]=new Array(4);                           //cuatro diagonales
        //dirección 1:
        arrayMov[1][0]=new Array(3);
        arrayMov[1][0][0]=new Array(7);
        arrayMov[1][0][0][0]=new Array(2);
        arrayMov[1][0][0][0][0]=1;                          //avance en fila
        arrayMov[1][0][0][0][1]=1;                          //avance en columna
        arrayMov[1][0][0][1]=new Array(2);
        arrayMov[1][0][0][1][0]=2;                          //avance en fila
        arrayMov[1][0][0][1][1]=2;                          //avance en columna
        arrayMov[1][0][0][2]=new Array(2);
        arrayMov[1][0][0][2][0]=3;                          //avance en fila
        arrayMov[1][0][0][2][1]=3;                          //avance en columna
        arrayMov[1][0][0][3]=new Array(2);
        arrayMov[1][0][0][3][0]=4;                          //avance en fila
        arrayMov[1][0][0][3][1]=4;                          //avance en columna
        arrayMov[1][0][0][4]=new Array(2);
        arrayMov[1][0][0][4][0]=5;                          //avance en fila
        arrayMov[1][0][0][4][1]=5;                          //avance en columna
        arrayMov[1][0][0][5]=new Array(2);
        arrayMov[1][0][0][5][0]=6;                          //avance en fila
        arrayMov[1][0][0][5][1]=6;                          //avance en columna
        arrayMov[1][0][0][6]=new Array(2);
        arrayMov[1][0][0][6][0]=7;                          //avance en fila
        arrayMov[1][0][0][6][1]=7;                          //avance en columna
        arrayMov[1][0][1]="SC";                             //SC: sin control
        arrayMov[1][0][2]="SC";                             //SC: sin control
        //dirección 2:
        arrayMov[1][1]=new Array(3);
        arrayMov[1][1][0]=new Array(7);
        arrayMov[1][1][0][0]=new Array(2);
        arrayMov[1][1][0][0][0]=-1;                          //avance en fila
        arrayMov[1][1][0][0][1]=-1;                          //avance en columna
        arrayMov[1][1][0][1]=new Array(2);
        arrayMov[1][1][0][1][0]=-2;                          //avance en fila
        arrayMov[1][1][0][1][1]=-2;                          //avance en columna
        arrayMov[1][1][0][2]=new Array(2);
        arrayMov[1][1][0][2][0]=-3;                          //avance en fila
        arrayMov[1][1][0][2][1]=-3;                          //avance en columna
        arrayMov[1][1][0][3]=new Array(2);
        arrayMov[1][1][0][3][0]=-4;                          //avance en fila
        arrayMov[1][1][0][3][1]=-4;                          //avance en columna
        arrayMov[1][1][0][4]=new Array(2);
        arrayMov[1][1][0][4][0]=-5;                          //avance en fila
        arrayMov[1][1][0][4][1]=-5;                          //avance en columna
        arrayMov[1][1][0][5]=new Array(2);
        arrayMov[1][1][0][5][0]=-6;                          //avance en fila
        arrayMov[1][1][0][5][1]=-6;                          //avance en columna
        arrayMov[1][1][0][6]=new Array(2);
        arrayMov[1][1][0][6][0]=-7;                          //avance en fila
        arrayMov[1][1][0][6][1]=-7;                          //avance en columna
        arrayMov[1][1][1]="SC";                             //SC: sin control
        arrayMov[1][1][2]="SC";                             //SC: sin control
        //dirección 3:
        arrayMov[1][2]=new Array(3);
        arrayMov[1][2][0]=new Array(7);
        arrayMov[1][2][0][0]=new Array(2);
        arrayMov[1][2][0][0][0]=-1;                          //avance en fila
        arrayMov[1][2][0][0][1]=1;                          //avance en columna
        arrayMov[1][2][0][1]=new Array(2);
        arrayMov[1][2][0][1][0]=-2;                          //avance en fila
        arrayMov[1][2][0][1][1]=2;                          //avance en columna
        arrayMov[1][2][0][2]=new Array(2);
        arrayMov[1][2][0][2][0]=-3;                          //avance en fila
        arrayMov[1][2][0][2][1]=3;                          //avance en columna
        arrayMov[1][2][0][3]=new Array(2);
        arrayMov[1][2][0][3][0]=-4;                          //avance en fila
        arrayMov[1][2][0][3][1]=4;                          //avance en columna
        arrayMov[1][2][0][4]=new Array(2);
        arrayMov[1][2][0][4][0]=-5;                          //avance en fila
        arrayMov[1][2][0][4][1]=5;                          //avance en columna
        arrayMov[1][2][0][5]=new Array(2);
        arrayMov[1][2][0][5][0]=-6;                          //avance en fila
        arrayMov[1][2][0][5][1]=6;                          //avance en columna
        arrayMov[1][2][0][6]=new Array(2);
        arrayMov[1][2][0][6][0]=-7;                          //avance en fila
        arrayMov[1][2][0][6][1]=7;                          //avance en columna
        arrayMov[1][2][1]="SC";                             //SC: sin control
        arrayMov[1][2][2]="SC";                             //SC: sin control
        //dirección 4:
        arrayMov[1][3]=new Array(3);
        arrayMov[1][3][0]=new Array(7);
        arrayMov[1][3][0][0]=new Array(2);
        arrayMov[1][3][0][0][0]=1;                          //avance en fila
        arrayMov[1][3][0][0][1]=-1;                          //avance en columna
        arrayMov[1][3][0][1]=new Array(2);
        arrayMov[1][3][0][1][0]=2;                          //avance en fila
        arrayMov[1][3][0][1][1]=-2;                          //avance en columna
        arrayMov[1][3][0][2]=new Array(2);
        arrayMov[1][3][0][2][0]=3;                          //avance en fila
        arrayMov[1][3][0][2][1]=-3;                          //avance en columna
        arrayMov[1][3][0][3]=new Array(2);
        arrayMov[1][3][0][3][0]=4;                          //avance en fila
        arrayMov[1][3][0][3][1]=-4;                          //avance en columna
        arrayMov[1][3][0][4]=new Array(2);
        arrayMov[1][3][0][4][0]=5;                          //avance en fila
        arrayMov[1][3][0][4][1]=-5;                          //avance en columna
        arrayMov[1][3][0][5]=new Array(2);
        arrayMov[1][3][0][5][0]=6;                          //avance en fila
        arrayMov[1][3][0][5][1]=-6;                          //avance en columna
        arrayMov[1][3][0][6]=new Array(2);
        arrayMov[1][3][0][6][0]=7;                          //avance en fila
        arrayMov[1][3][0][6][1]=-7;                          //avance en columna
        arrayMov[1][3][1]="SC";                             //SC: sin control
        arrayMov[1][3][2]="SC";                             //SC: sin control
        break;

      case "rey":
        arrayMov[1]=new Array(8);                           //ocho  posibilidades para moverse: en cualquier dirección una casilla
        //dirección 1:
        arrayMov[1][0]=new Array(3);
        arrayMov[1][0][0]=new Array(1);                     //array de destinos posibles para una dirección...
        arrayMov[1][0][0][0]=new Array(2);
        arrayMov[1][0][0][0][0]=1;                          //avance en fila
        arrayMov[1][0][0][0][1]=0;                          //avance en columna
        arrayMov[1][0][1]="SC";                             //SC: sin control
        arrayMov[1][0][2]="SC";                             //R2: restricción 2=>solo destino vacío no puede comer
        //dirección 2:
        arrayMov[1][1]=new Array(3);
        arrayMov[1][1][0]=new Array(1);
        arrayMov[1][1][0][0]=new Array(2);
        arrayMov[1][1][0][0][0]=1;                          //avance en fila
        arrayMov[1][1][0][0][1]=1;                          //avance en columna
        arrayMov[1][1][1]="SC";                              //R: restringido solo para el primer movimiento
        arrayMov[1][1][2]="SC";                             //R2: restricción 2=>solo destino vacío no puede comer
        //dirección 3:
        arrayMov[1][2]=new Array(3);
        arrayMov[1][2][0]=new Array(1);
        arrayMov[1][2][0][0]=new Array(2);
        arrayMov[1][2][0][0][0]=0;                          //avance en fila
        arrayMov[1][2][0][0][1]=1;                          //avance en columna
        arrayMov[1][2][1]="SC";                             //SC: sin control
        arrayMov[1][2][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 4:
        arrayMov[1][3]=new Array(3);
        arrayMov[1][3][0]=new Array(1);
        arrayMov[1][3][0][0]=new Array(2);
        arrayMov[1][3][0][0][0]=-1;                          //avance en fila
        arrayMov[1][3][0][0][1]=1;                          //avance en columna
        arrayMov[1][3][1]="SC";                             //SC: sin control
        arrayMov[1][3][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 5:
        arrayMov[1][4]=new Array(3);
        arrayMov[1][4][0]=new Array(1);
        arrayMov[1][4][0][0]=new Array(2);
        arrayMov[1][4][0][0][0]=-1;                          //avance en fila
        arrayMov[1][4][0][0][1]=0;                          //avance en columna
        arrayMov[1][4][1]="SC";                             //SC: sin control
        arrayMov[1][4][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 6:
        arrayMov[1][5]=new Array(3);
        arrayMov[1][5][0]=new Array(1);
        arrayMov[1][5][0][0]=new Array(2);
        arrayMov[1][5][0][0][0]=-1;                          //avance en fila
        arrayMov[1][5][0][0][1]=-1;                          //avance en columna
        arrayMov[1][5][1]="SC";                             //SC: sin control
        arrayMov[1][5][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 7:
        arrayMov[1][6]=new Array(3);
        arrayMov[1][6][0]=new Array(1);
        arrayMov[1][6][0][0]=new Array(2);
        arrayMov[1][6][0][0][0]=0;                          //avance en fila
        arrayMov[1][6][0][0][1]=-1;                          //avance en columna
        arrayMov[1][6][1]="SC";                             //SC: sin control
        arrayMov[1][6][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 8:
        arrayMov[1][7]=new Array(3);
        arrayMov[1][7][0]=new Array(1);
        arrayMov[1][7][0][0]=new Array(2);
        arrayMov[1][7][0][0][0]=1;                          //avance en fila
        arrayMov[1][7][0][0][1]=-1;                          //avance en columna
        arrayMov[1][7][1]="SC";                             //SC: sin control
        arrayMov[1][7][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        break;

      case "caballo":
        arrayMov[1]=new Array(8);                           //
        //dirección 1:
        arrayMov[1][0]=new Array(3);
        arrayMov[1][0][0]=new Array(1);                     //array de destinos posibles para una dirección...
        arrayMov[1][0][0][0]=new Array(2);
        arrayMov[1][0][0][0][0]=2;                          //avance en fila
        arrayMov[1][0][0][0][1]=-1;                          //avance en columna
        arrayMov[1][0][1]="SC";                             //SC: sin control
        arrayMov[1][0][2]="SC";                             //R2: restricción 2=>solo destino vacío no puede comer
        //dirección 2:
        arrayMov[1][1]=new Array(3);
        arrayMov[1][1][0]=new Array(1);
        arrayMov[1][1][0][0]=new Array(2);
        arrayMov[1][1][0][0][0]=2;                          //avance en fila
        arrayMov[1][1][0][0][1]=1;                          //avance en columna
        arrayMov[1][1][1]="SC";                              //R: restringido solo para el primer movimiento
        arrayMov[1][1][2]="SC";                             //R2: restricción 2=>solo destino vacío no puede comer
        //dirección 3:
        arrayMov[1][2]=new Array(3);
        arrayMov[1][2][0]=new Array(1);
        arrayMov[1][2][0][0]=new Array(2);
        arrayMov[1][2][0][0][0]=1;                          //avance en fila
        arrayMov[1][2][0][0][1]=2;                          //avance en columna
        arrayMov[1][2][1]="SC";                             //SC: sin control
        arrayMov[1][2][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 4:
        arrayMov[1][3]=new Array(3);
        arrayMov[1][3][0]=new Array(1);
        arrayMov[1][3][0][0]=new Array(2);
        arrayMov[1][3][0][0][0]=-1;                          //avance en fila
        arrayMov[1][3][0][0][1]=2;                          //avance en columna
        arrayMov[1][3][1]="SC";                             //SC: sin control
        arrayMov[1][3][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 5:
        arrayMov[1][4]=new Array(3);
        arrayMov[1][4][0]=new Array(1);
        arrayMov[1][4][0][0]=new Array(2);
        arrayMov[1][4][0][0][0]=-2;                          //avance en fila
        arrayMov[1][4][0][0][1]=-1;                          //avance en columna
        arrayMov[1][4][1]="SC";                             //SC: sin control
        arrayMov[1][4][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 6:
        arrayMov[1][5]=new Array(3);
        arrayMov[1][5][0]=new Array(1);
        arrayMov[1][5][0][0]=new Array(2);
        arrayMov[1][5][0][0][0]=-2;                          //avance en fila
        arrayMov[1][5][0][0][1]=1;                          //avance en columna
        arrayMov[1][5][1]="SC";                             //SC: sin control
        arrayMov[1][5][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 7:
        arrayMov[1][6]=new Array(3);
        arrayMov[1][6][0]=new Array(1);
        arrayMov[1][6][0][0]=new Array(2);
        arrayMov[1][6][0][0][0]=-1;                          //avance en fila
        arrayMov[1][6][0][0][1]=-2;                          //avance en columna
        arrayMov[1][6][1]="SC";                             //SC: sin control
        arrayMov[1][6][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        //dirección 8:
        arrayMov[1][7]=new Array(3);
        arrayMov[1][7][0]=new Array(1);
        arrayMov[1][7][0][0]=new Array(2);
        arrayMov[1][7][0][0][0]=1;                          //avance en fila
        arrayMov[1][7][0][0][1]=-2;                          //avance en columna
        arrayMov[1][7][1]="SC";                             //SC: sin control
        arrayMov[1][7][2]="SC";                             //R1: restricción 1=>solo destino rival, sólo puede comer
        break;
  
    }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //Según el color se avanza subiendo o bajando
    if(ficha_color=="b"){
      signo=1;
    }else{
      signo=-1;
    }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //Array con los posibles movimientos:
    destinosPosibles=new Array();

    //bucle para recorrer cada variante de movimiento:
    n1=arrayMov[1].length;
    for(i=0;i<n1;i++){
      //dentro de una variante: bucle para recorrer los posibles movimientos
      n2=arrayMov[1][i][0].length;
      control1=arrayMov[1][i][1];
      posicionIni_paraControl1="No";
      if(ficha_tipo=="peon"&&ficha_color=="b"&&fila==2){
        posicionIni_paraControl1="Si";
      }else if(ficha_tipo=="peon"&&ficha_color=="n"&&fila==7){
        posicionIni_paraControl1="Si";
      }

      control2=arrayMov[1][i][2];

      continuar_variante=true;
      for(j=0;j<n2;j++){
        //Si existió un freno en esta variante de movimiento ya no considerar hasta saltar a la siguiente variante:
        if(continuar_variante){
          fila_destino=((arrayMov[1][i][0][j][0])*signo)+fila;
          columna_destino=(arrayMov[1][i][0][j][1])+columna;
          if(document.getElementById("f_"+fila_destino+"_"+columna_destino)){
            control_destino=document.getElementById("f_"+fila_destino+"_"+columna_destino).alt; // sin el if pincharía cuando la casilla no existe....o sea fila o columna >8
          }else{
            control_destino="";
          }
          ficha_destino_color=control_destino.slice(0,1);
          if(ficha_destino_color == null||ficha_destino_color==""){
            estado_destino="vacío";
          }else if(ficha_destino_color==ficha_color){
            estado_destino="ficha_propia";
          }else{
            estado_destino="ficha_rival";
          }
          if(fila_destino>8||columna_destino>8||fila_destino<1||columna_destino<1){
            //destino fuera del tablero=>  terminar cadena
            continuar_variante=false;
          }else if(estado_destino=="ficha_propia"){
            //destino ocupado con ficha propia => terminar cadena
            continuar_variante=false;
          }else if(estado_destino=="ficha_rival"&&control2=="R2"){
            //destino ocupado con ficha rival y solo se puede mover a fichas vacías => terminar cadena
            continuar_variante=false;
          }else if(estado_destino=="vacío"&&control2=="R1"){
            //destino vacío y solo se puede mover a fichas para comer => terminar cadena
            continuar_variante=false;
          }else if(control1=="R"&&posicionIni_paraControl1=="No"){
            //dirección admitida solo para el primer movimiento, y ya no es el primer movimiento
            continuar_variante=false;
          }else if(estado_destino=="ficha_rival"){
            nAc=destinosPosibles.length;
            destinosPosibles[nAc]=new Array();
            destinosPosibles[nAc][0]=fila_destino;
            destinosPosibles[nAc][1]=columna_destino;
            destinosPosibles[nAc][2]=estado_destino;
            continuar_variante=false;
          }else{
            nAc=destinosPosibles.length;
            destinosPosibles[nAc]=new Array();
            destinosPosibles[nAc][0]=fila_destino;
            destinosPosibles[nAc][1]=columna_destino;
            destinosPosibles[nAc][2]=estado_destino;       
            n=destinosPosibles.length;
          }
        }
      }
    }
  //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  return destinosPosibles;
}

function cambiaClase(claseBuscada, claseNueva){
  divsI=document.getElementsByClassName(claseBuscada);
  nI=divsI.length;
  for(i=0;i<nI;i++){
    if(divsI[0]){
      divsI[0].classList.add(claseNueva);
      divsI[0].classList.remove(claseBuscada);
    }
  }
}

