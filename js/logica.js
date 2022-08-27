function acc(fila, columna){
  turno=          document.getElementById("mon_turno").value;
  movimiento=     document.getElementById("mon_movim").value;

  if(movimiento=="origen"){                                                           //SELECCIONANDO CASILLA ORIGEN:
    ficha=        document.getElementById("f_"+fila+"_"+columna).alt;                 //      Obtengo los datos de la ficha seleccionada
    ficha_color=  ficha.slice(0,1);                                                   //          obtengo el color
    ficha_tipo=   ficha.slice(2,20);                                                  //          obtengo el tipo de ficha
    if(ficha_color==turno){                                                           //      El color de la ficha tiene que coincidir con el color de quien tiene el turno
      id_div="c_"+fila+"_"+columna;                                                   //
      cambiaClaseId(id_div, "casillero_lleno_turno", "casillero_lleno_turno_sel");    //      Asigna estilo de casilla seleccionada
      movimientos=identificarDestinos(ficha_tipo, turno, fila, columna);              //      Obtiene las celdas que son posibles destinos
      n=movimientos.length;                                                           //
      for(i=0;i<n;i++){                                                               //      Las recorre para actualizar el estilo
        id_posible="c_"+movimientos[i][0]+"_"+movimientos[i][1];                      //
        document.getElementById(id_posible).classList.add("casillero_destino");       //
      }                                                                               //
      CambiaMonitor("destino", ficha_tipo, fila, columna, turno, "");                 //      Actualiza el monitor con la nueva casilla y pasa de movimiento origen a destino
    }                                                                                 //-----------------------------------------------------------------------------------------------------
  }else if(movimiento=="destino"){                                                    //SELECCIONANDO CASILLA DESTINO:
    fila_ori=     document.getElementById("mon_ori_f").value;                         //
    columna_ori=  document.getElementById("mon_ori_c").value;                         //
    if(fila==fila_ori&&columna==columna_ori){                                         // Si selecciono la misma casilla....la desmarco y vuelvo al movimiento esperado=origen
      cambiaClase("casillero_lleno_turno_sel", "casillero_lleno_turno");              //      Desmarco la casilla que estaba seleccionada
      cambiaClase("casillero_destino", " ");                                          //      Desmarco los casilleros de la casilla que estaba seleccinada
      CambiaMonitor("origen", "", "", "", turno, "");                                 //      Vuelvo el monitor al estado anterior
    }else{                                                                            // Si selecciono otro casilla:
      ficha_ori=  document.getElementById("mon_ori_ficha").value;                     //
      turno=      document.getElementById("mon_turno").value;                         //
      fila_ori=   document.getElementById("mon_ori_f").value;                         //
      columna_ori=document.getElementById("mon_ori_c").value;                         //
      movimientos=identificarDestinos(ficha_ori, turno, fila_ori, columna_ori);       //
      n=movimientos.length;                                                           //
      for(i=0;i<n;i++){                                                               //
        intentoMover="";                                                              //
        if(fila==movimientos[i][0]&&columna==movimientos[i][1]){                      //      Si está está en los posibles destinos:  se mueve =>
          moverFicha(fila_ori, columna_ori, fila, columna, turno, ficha_ori);         //              Se deja casilla de origen vacía  y se llevan los datos a la casilla destino
          cambiaClase("casillero_destino", " ");                                      //              Desmarco todas las casillas marcadas como posibles destinos
          CambiaMonitor("origen", "", "", "", turno, "cambiaTurno");                  //   (*1)       Reinicio el monitor y cambio el color para pasar el turno:
          cambiaClase("casillero_lleno_turno", "temporal");                           //              Se completó el movimiento => se invierten las clases turno propio vs turno rival
          cambiaClase("casillero_lleno_rival", "casillero_lleno_turno");              //              Se completó el movimiento => se invierten las clases turno propio vs turno rival
          cambiaClase("temporal", "casillero_lleno_rival");                           //              Se completó el movimiento => se invierten las clases turno propio vs turno rival
          intentoMover="Movio";                                                       //      Si no está entre los posibles destinos no hace nada y sigue el bucle
        }                                                                             //      (puede pasar que termine el bucle y la casilla no coincida con ningún posible destino)
      }                                                                               //-----------------------------------------------------------------------------------------------------
      if(intentoMover=="Movio"){                                                      //CONTROLES PARA PASAR EL TURNO
        finPartida=controlFIN();                                                      // Control de fin
        if(finPartida[0]=="Si"){                                                       //    Si terminó la partida el procedimiento controlFIN ya dejó el tablero bloqueado
        }else{                                                                        //    Si no terminó la partida se deja el turno al jugador que se indicó en (*1)
          controlIA=document.getElementById("usr_"+invertirTurno(turno)+"_IA").value;
          if(controlIA=="S"){
            autoMovimiento(invertirTurno(turno));
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
      if(claseNueva!=" "){
        divsI[0].classList.add(claseNueva);
      }
      divsI[0].classList.remove(claseBuscada);
    }
  }
}

function cambiaClaseId(id, claseBorrar, ClaseNueva){
  div_sel=document.getElementById(id);
  if(ClaseNueva!=" "){
    div_sel.classList.add(ClaseNueva);
  }
  if(claseBorrar!=" "){
    div_sel.classList.remove(claseBorrar);
  }
}

function CambiaMonitor(movimiento, ficha, fila, columna, turno, turnoOpuesto){

  document.getElementById("mon_movim").value=movimiento;
  document.getElementById("mon_ori_ficha").value=ficha;
  document.getElementById("mon_ori_f").value=fila;
  document.getElementById("mon_ori_c").value=columna;

  switch(turnoOpuesto){
    case "cambiaTurno":
      document.getElementById("mon_turno").value=invertirTurno(turno);
      break;
    default:
      document.getElementById("mon_turno").value=turno;
      break;
  }
}

function invertirTurno(turno){
  if(turno=="n"){
    return "b"
  }else{
    return "n";
  }
}

function moverFicha(fila_ori, columna_ori, fila_destino, columna_destino, turno, ficha){
  // Se deja casilla de origen vacía
  document.getElementById("f_"+fila_ori+"_"+columna_ori).src="img/empty.png";
  document.getElementById("f_"+fila_ori+"_"+columna_ori).alt="";
  document.getElementById("c_"+fila_ori+"_"+columna_ori).classList.remove("casillero_lleno_turno_sel");
  document.getElementById("c_"+fila_ori+"_"+columna_ori).classList.remove("casillero_lleno_turno");
  document.getElementById("c_"+fila_ori+"_"+columna_ori).classList.add("casillero_vacio");

  // Se llevan los datos de la casilla/ficha origen al destino
  document.getElementById("f_"+fila_destino+"_"+columna_destino).src="img/fch_"+turno+"_"+ficha+".png";
  document.getElementById("f_"+fila_destino+"_"+columna_destino).alt=turno+"_"+ficha;
  document.getElementById("c_"+fila_destino+"_"+columna_destino).classList.remove("casillero_lleno_turno_sel");
  document.getElementById("c_"+fila_destino+"_"+columna_destino).classList.add("casillero_lleno_turno");
  document.getElementById("c_"+fila_destino+"_"+columna_destino).classList.remove("casillero_vacio");
  document.getElementById("c_"+fila_destino+"_"+columna_destino).classList.remove("casillero_lleno_rival");
}

function controlFIN(){
  continuidad=0;
  finPartida=new Array(3);
  finPartida[0]="No";                                                                         // "Si": finalizó la partida
  finPartida[1]="";                                                                           // Acción de fin: "JAQUE" / "JAQUE MATE" / "TABLAS"
  finPartida[2]="";                                                                           // Ataca: (vacío) Nadie / "b" atacó color blanco / "n" atacó color negro

  turno_rival=document.getElementById("mon_turno").value;                                     // Como este dato se obtiene después de haber completado el movimiento
  turno=invertirTurno(turno_rival);                                                           // Los datos turno y turno_rival se obtienen invertidos
  fichasTablero=obtenerFichas();
  if(turno=="b"){ bloque1=0; bloque2=1;
  }else{          bloque1=1; bloque2=0;}
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // SI DESPUES DE MOVER OCURRE QUE EL REY PROPIO SIGUE EN JAQUE (O SE PUSO SOLO EN JAQUE) =>   Jaque Mate al rey propio  => Gana el color rival
  //
  // Recorro el tablero para obtener fila y columna del rey propio (posición después de haber completado el movimiento, por si moví al rey lo tomo desde su nueva posición)
  ntbl1=fichasTablero[bloque1].length;
  for(itbl1=0; itbl1<ntbl1; itbl1++){
    if(fichasTablero[bloque1][itbl1][0]=="rey"){
      fila_rey_propio=fichasTablero[bloque1][itbl1][1];
      columna_rey_propio=fichasTablero[bloque1][itbl1][2];
    }
  }
  // Obtengo las fichas del rival y en que casillero están
  ntbl2=fichasTablero[bloque2].length;
  for(itbl2=0; itbl2<ntbl2; itbl2++){
    ficha_rival=fichasTablero[bloque2][itbl2][0];
    fila_rival=fichasTablero[bloque2][itbl2][1];
    columna_rival=fichasTablero[bloque2][itbl2][2];

    movimientos=identificarDestinos(ficha_rival, turno_rival, fila_rival, columna_rival);
    mtbl2=movimientos.length;
    for(jtbl2=0;jtbl2<mtbl2;jtbl2++){
      if(movimientos[jtbl2][0]==fila_rey_propio&&movimientos[jtbl2][1]==columna_rey_propio){  //SI EXISTE ALGUN CASO CON CONDICIÓN VERDADERA => JAQUE MATE AL REY PROPIO
        finPartida[0]="Si";                                                                   //  "Si": finalizó la partida
        finPartida[1]="JAQUE MATE";                                                           //  Acción de fin: "JAQUE" / "JAQUE MATE" / "TABLAS"
        finPartida[2]=turno_rival;                                                            //  Ataca: (vacío) Nadie / "b" atacó color blanco / "n" atacó color negro
        continuidad=1;
      }
    }
  }
  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // SI DESPUES DE MOVER OCURRE QUE EL REY RIVAL QUEDA EN JAQUE =>   Jaque al rey rival
  //
  if(continuidad==0){
    // Recorro el tablero para obtener fila y columna del rey rival
    ntbl3=fichasTablero[bloque2].length;
    for(itbl3=0; itbl3<ntbl3; itbl3++){
      if(fichasTablero[bloque2][itbl3][0]=="rey"){
        fila_rey_rival=fichasTablero[bloque2][itbl3][1];
        columna_rey_rival=fichasTablero[bloque2][itbl3][2];
      }
    }

    // Obtengo las fichas propias y en que casillero están...y para cada una analizo los posibles movimientos
    ntbl4=fichasTablero[bloque1].length;
    for(itbl4=0; itbl4<ntbl4; itbl4++){
      ficha_propia=fichasTablero[bloque1][itbl4][0];
      fila_propia=fichasTablero[bloque1][itbl4][1];
      columna_propia=fichasTablero[bloque1][itbl4][2];
      movimientos=identificarDestinos(ficha_propia, turno, fila_propia, columna_propia);
      mtbl4=movimientos.length;
      for(jtbl4=0;jtbl4<mtbl4;jtbl4++){
        if(movimientos[jtbl4][0]==fila_rey_rival&&movimientos[jtbl4][1]==columna_rey_rival){  //SI EXISTE ALGUN CASO CON CONDICIÓN VERDADERA => JAQUE AL REY RIVAL
          finPartida[0]="Ni";                                                                 //  "Si": finalizó la partida
          finPartida[1]="JAQUE";                                                              //  Acción de fin: "JAQUE" / "JAQUE MATE" / "TABLAS"
          finPartida[2]=turno;                                                                //  Ataca: (vacío) Nadie / "b" atacó color blanco / "n" atacó color negro
        }
      }
    }
  }


  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // SI LA CANTIDAD DE MOVIMIENTOS SIN COMER LLEGA A 50 => TABLAS (EMPATE)
  if(continuidad==0){
    turnos_sin_comer = document.getElementById("mon_tablas").value;
    if(turnos_sin_comer>49){
      finPartida[0]="Si";                                                                     //  "Si": finalizó la partida
      finPartida[1]="TABLAS";                                                                 //  Acción de fin: "JAQUE" / "JAQUE MATE" / "TABLAS"
      finPartida[2]="";                                                                       //  Ataca: (vacío) Nadie / "b" atacó color blanco / "n" atacó color negro
    }
  }


  switch(finPartida[0]){
    case "Si":
      for(controlFin_fila=1;controlFin_fila<9;controlFin_fila++){
        for(controlFin_columna=1;controlFin_columna<9;controlFin_columna++){
          document.getElementById("c_"+controlFin_fila+"_"+controlFin_columna).classList.remove("casillero_lleno_turno");
          document.getElementById("c_"+controlFin_fila+"_"+controlFin_columna).classList.remove("casillero_lleno_rival");
          document.getElementById("c_"+controlFin_fila+"_"+controlFin_columna).classList.remove("casillero_lleno_turno_sel");
          document.getElementById("c_"+controlFin_fila+"_"+controlFin_columna).classList.add("casillero_vacio");
        }
      }
      document.getElementById("mon_turno").value="x";
      document.getElementById("mensaje").innerHTML=finPartida[1];
      switch(finPartida[2]){
        case "x":
          document.getElementById("mensajeF").innerHTML="EMPATE";
          break;
        default:
          denJugador=document.getElementById("usr_"+finPartida[2]).value;
          document.getElementById("mensajeF").innerHTML=denJugador+"<br> WIN!!";
          break;
      }
  
      break;

    case "Ni":
      document.getElementById("mensaje").innerHTML=finPartida[1];
      break;

    case "No":
      document.getElementById("mensaje").innerHTML="";
      break;
      
  }

  return finPartida;
}

function obtenerFichasColor(color){
  arrayFichasColor=new Array();                                                 //---------------------------------------------------------------------------------------
  for(f=1;f<9;f++){                                                             // ARRAY CON TODAS LAS FICHAS DE UN COLOR UBICADAS EN EL TABLERO
    for(c=1;c<9;c++){                                                           // 
      control_ficha=        document.getElementById("f_"+f+"_"+c).alt;          //    POSICION[i]:
      control_ficha_color=  control_ficha.slice(0,1);                           //      POSICIÓN[i][0]:FICHA
      control_ficha_tipo=   control_ficha.slice(2,20);                          //      POSICIÓN[i][1]:FILA
      if(control_ficha_color==color){                                           //      POSICIÓN[i][2]:COLUMNA
        n=arrayFichasColor.length;                                              //---------------------------------------------------------------------------------------
        arrayFichasColor.length=n+1;
        arrayFichasColor[n]=new Array(3);
        arrayFichasColor[n][0]=control_ficha_tipo;
        arrayFichasColor[n][1]=f;
        arrayFichasColor[n][2]=c;
      }
    }
  }
  return arrayFichasColor;
}

function obtenerFichas(){
  arrayFichas=new Array(2);                                             // Array que contiene todas las fichas ubicadas en el tablero: ficha, fila, columna
  arrayFichas[0]=new Array();                                           // Posición[0]: array de fichas blancas
  arrayFichas[1]=new Array();                                           // Posición[1]: array de fichas negras

  n_b=0;
  n_c=0;

  for(f=1;f<9;f++){
    for(c=1;c<9;c++){
      control_ficha=        document.getElementById("f_"+f+"_"+c).alt;
      control_ficha_color=  control_ficha.slice(0,1);
      control_ficha_tipo=   control_ficha.slice(2,20);

      if(control_ficha_color=="b"){
        n_b=arrayFichas[0].length;
        arrayFichas[0].length=n_b+1;
        arrayFichas[0][n_b]=new Array(3);
        arrayFichas[0][n_b][0]=control_ficha_tipo;
        arrayFichas[0][n_b][1]=f;
        arrayFichas[0][n_b][2]=c;
      }
      if(control_ficha_color=="n"){
        n_a=arrayFichas[1].length;
        arrayFichas[1].length=n_a+1;
        arrayFichas[1][n_a]=new Array(3);
        arrayFichas[1][n_a][0]=control_ficha_tipo;
        arrayFichas[1][n_a][1]=f;
        arrayFichas[1][n_a][2]=c;
      }
    }
  }
  return arrayFichas;
}
function test(){
//  variable=obtenerFichas();
//  document.getElementById("testVs").innerHTML=JSON.stringify(variable);
    finPartida=controlFIN();
    document.getElementById("testVs").innerHTML=JSON.stringify(finPartida);
}

function iniciarPartida(){
  //Comprueba nombres de jugadores
  usr_b=document.getElementById("usr_b").value;
  usr_n=document.getElementById("usr_n").value;
  if(usr_b!=""&&usr_n!=""){
    //Reinicia el tablero
    CambiaMonitor("origen","","","","b","");
    document.getElementById("mensaje").innerHTML="";
    document.getElementById("mensajeF").innerHTML="";

    //Coloca las fichas en sus casilleros
    document.getElementById("f_1_1").src="img/fch_b_torre.png";
    document.getElementById("f_1_1").alt="b_torre";
    document.getElementById("f_1_2").src="img/fch_b_caballo.png";
    document.getElementById("f_1_2").alt="b_caballo";
    document.getElementById("f_1_3").src="img/fch_b_alfil.png";
    document.getElementById("f_1_3").alt="b_alfil";
    document.getElementById("f_1_4").src="img/fch_b_rey.png";
    document.getElementById("f_1_4").alt="b_rey";
    document.getElementById("f_1_5").src="img/fch_b_reina.png";
    document.getElementById("f_1_5").alt="b_reina";
    document.getElementById("f_1_6").src="img/fch_b_alfil.png";
    document.getElementById("f_1_6").alt="b_alfil";
    document.getElementById("f_1_7").src="img/fch_b_caballo.png";
    document.getElementById("f_1_7").alt="b_caballo";
    document.getElementById("f_1_8").src="img/fch_b_torre.png";
    document.getElementById("f_1_8").alt="b_torre";

    for(i=1;i<9;i++){
      document.getElementById("f_2_"+i).src="img/fch_b_peon.png";
      document.getElementById("f_2_"+i).alt="b_peon";
    }

    for(i=3;i<7;i++){
      for(j=1;j<9;j++){
        document.getElementById("f_"+i+"_"+j).src="img/empty.png";
        document.getElementById("f_"+i+"_"+j).alt="";
      }
    }

    for(i=1;i<9;i++){
      document.getElementById("f_7_"+i).src="img/fch_n_peon.png";
      document.getElementById("f_7_"+i).alt="n_peon";
    }

    document.getElementById("f_8_1").src="img/fch_n_torre.png";
    document.getElementById("f_8_1").alt="n_torre";
    document.getElementById("f_8_2").src="img/fch_n_caballo.png";
    document.getElementById("f_8_2").alt="n_caballo";
    document.getElementById("f_8_3").src="img/fch_n_alfil.png";
    document.getElementById("f_8_3").alt="n_alfil";
    document.getElementById("f_8_4").src="img/fch_n_reina.png";
    document.getElementById("f_8_4").alt="n_reina";
    document.getElementById("f_8_5").src="img/fch_n_rey.png";
    document.getElementById("f_8_5").alt="n_rey";
    document.getElementById("f_8_6").src="img/fch_n_alfil.png";
    document.getElementById("f_8_6").alt="n_alfil";
    document.getElementById("f_8_7").src="img/fch_n_caballo.png";
    document.getElementById("f_8_7").alt="n_caballo";
    document.getElementById("f_8_8").src="img/fch_n_torre.png";
    document.getElementById("f_8_8").alt="n_torre";
    
    //Inicializa las clases en los casilleros
    for(i=1;i<3;i++){
      for(j=1;j<9;j++){
        document.getElementById("c_"+i+"_"+j).classList.remove("casillero_vacio");
        document.getElementById("c_"+i+"_"+j).classList.remove("casillero_lleno_rival");
        document.getElementById("c_"+i+"_"+j).classList.add("casillero_lleno_turno");
      }
    }
    for(i=3;i<7;i++){
      for(j=1;j<9;j++){
        document.getElementById("c_"+i+"_"+j).classList.remove("casillero_lleno_turno");
        document.getElementById("c_"+i+"_"+j).classList.remove("casillero_lleno_rival");
        document.getElementById("c_"+i+"_"+j).classList.add("casillero_vacio");
      }
    }
    for(i=7;i<9;i++){
      for(j=1;j<9;j++){
        document.getElementById("c_"+i+"_"+j).classList.remove("casillero_vacio");
        document.getElementById("c_"+i+"_"+j).classList.remove("casillero_lleno_turno");
        document.getElementById("c_"+i+"_"+j).classList.add("casillero_lleno_rival");
      }
    }

    //Cambio del texto en boton "Inicial" por "Reiniciar"
    document.getElementById("iniP").innerHTML="Reiniciar";

    //Controlar si el primer jugador es CPU para el primer autoMovimiento(turno)
    usb_in_AI=document.getElementById("usr_b_IA").value;
    if(usb_in_AI=="S"){
      autoMovimiento("b");
    }

  }else{
    alert("Completar nombre de jugadores");
  }
}

function selecUserIA(color, tipoUsr){
  switch(tipoUsr){
    case "Us":
      document.getElementById("usr_"+color).disabled=false;
      document.getElementById("usr_"+color).value="";
      document.getElementById("usr_"+color+"_IA").value="N";
      cambiaClaseId("btn_usr_"+color+"_Us","btn-primary","btn-success");
      cambiaClaseId("btn_usr_"+color+"_IA","btn-success","btn-primary");

      break;

    case "IA":
      document.getElementById("usr_"+color).disabled=true;
      document.getElementById("usr_"+color).value="CPU";
      document.getElementById("usr_"+color+"_IA").value="S";
      cambiaClaseId("btn_usr_"+color+"_IA","btn-primary","btn-success");
      cambiaClaseId("btn_usr_"+color+"_Us","btn-success","btn-primary");
      break;
  }
}

function autoMovimiento(turno){
  ArrayAutoMovimientos=new Array();

  //SELECCION DE UNA FICHA A MOVER Y SU DESTINO
  //Primer intento: sin considerar condición de estar en jaque o posibilidad de hacer jaque al rival=> 100% aleatorio
  //Formato para el array de auto movimientos: fila origen,columna origen,fila destino, columna destino
  //Con lenght obtengo el tamaño del array
  //Con Math.floor(Math.random() * tamañoArray) objengo un aleatorio de esas posiciones

  arrayFichas=obtenerFichas();
  switch(turno){
    case "b":
      nro_color=0;
      break;
    case "n":
      nro_color=1;
      break;
    default:
      nro_color=-1;
      break;
  }
  nFch=arrayFichas[nro_color].length;
  for(iFch=0;iFch<nFch;iFch++){
    autoMovFicha=arrayFichas[nro_color][iFch][0];
    autoMovFilaOri=arrayFichas[nro_color][iFch][1];
    autoMovColumnaOri=arrayFichas[nro_color][iFch][2];
   
    //Array destinos contiene en posición[i][0]: fila destino, posición[i][1]: columna destino, posición[i][2]: estado (estados: vacío o ficha_rival)
    arrayDestinosPosibles=identificarDestinos(autoMovFicha, turno, autoMovFilaOri, autoMovColumnaOri);
    nDestPosibles=arrayDestinosPosibles.length
    for(iDestPosibles=0;iDestPosibles<nDestPosibles;iDestPosibles++){
      autoMovFilaDest=arrayDestinosPosibles[iDestPosibles][0];
      autoMovColumnaDest=arrayDestinosPosibles[iDestPosibles][1];
      autoMovColumnaEstado=arrayDestinosPosibles[iDestPosibles][2];
        qAutoM=ArrayAutoMovimientos.length;
        ArrayAutoMovimientos.length=qAutoM+1;
        ArrayAutoMovimientos[qAutoM]=new Array(5);
        ArrayAutoMovimientos[qAutoM][0]=autoMovFilaOri;
        ArrayAutoMovimientos[qAutoM][1]=autoMovColumnaOri;
        ArrayAutoMovimientos[qAutoM][2]=autoMovFilaDest;
        ArrayAutoMovimientos[qAutoM][3]=autoMovColumnaDest;
        ArrayAutoMovimientos[qAutoM][4]=autoMovColumnaDest;
        //Separar en tres array
        //prioridad 1: solo si esta en jaque analizar despues del movimiento sindeja de estarlo
        //prioridad 2: comer
        //prioridad 3: resto
        // luego ver cantidad de cada array antes de paasar al siguiente
    }
  }

  MovObtenidos=ArrayAutoMovimientos.length;
  MovAleatorio=Math.floor(Math.random() * MovObtenidos);
  MovAleatorioFilaOri=ArrayAutoMovimientos[MovAleatorio][0];
  MovAleatorioColumnaOri=ArrayAutoMovimientos[MovAleatorio][1];
  MovAleatorioFilaDest=ArrayAutoMovimientos[MovAleatorio][2];
  MovAleatorioColumnaDest=ArrayAutoMovimientos[MovAleatorio][3];

  setTimeout(function(){
    acc(MovAleatorioFilaOri,MovAleatorioColumnaOri);    // FICHA ORIGEN
    acc(MovAleatorioFilaDest,MovAleatorioColumnaDest);  // CASILLERO DESTINO
  }, 200);
}