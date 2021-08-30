const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 500;
var posJogador = 125;
var dir = 0;
var vel = 5;
var jogadorTamanho = 50;
var perdeu = false;
var jogarDenovo = false;

//6 colunas com até 5 obstaculos
var obstaculo = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];
var posBolaX = 150;
var posBolaY = 100;
var dirX = 0;
var dirY = 0;
function gerarObstaculos(){
    for(let coluna = 0; coluna < 6; coluna++){
        for(let linha = 0; linha <5; linha++){
            if((Math.random()*10)>5) obstaculo[coluna][linha] = 3;
            else obstaculo[coluna][linha] = 0;
        }
    }
    console.log(obstaculo);
}

function drawPlayer(){
    posJogador += dir * vel;
    if(posJogador < 0 || posJogador > (300 - jogadorTamanho)) posJogador += (dir * vel)*(-1);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(posJogador, 140, jogadorTamanho, 5);
}

function drawObstaculos(){
    for(let coluna = 0; coluna < 6; coluna++){
        for(let linha = 0; linha < 5; linha++ ){
            if((obstaculo[coluna][linha])!=0){
                if((obstaculo[coluna][linha])==3)ctx.fillStyle = 'rgb(85, 107, 47)';
                if((obstaculo[coluna][linha])==2)ctx.fillStyle = 'rgb(243, 255, 8)';
                if((obstaculo[coluna][linha])==1)ctx.fillStyle = 'rgb(232, 0, 0)';
                ctx.fillRect((coluna*50), linha*5, jogadorTamanho, 5);
            }
        }
    }
}

function drawBola(){
    ctx.beginPath();
  
    //se colidir com jogador
    if((posBolaY > 140) && ( posBolaX > posJogador) && ( posBolaX < (posJogador + jogadorTamanho))){
            dirX = ((posBolaX-posJogador)-(jogadorTamanho/2))/10;
            if((Math.abs(dirX)<1) && (dirX != 0)){
                if(dirX>0) dirX = 1;
                else dirX = -1;
            }
            dirY *= (-1);   
    }
    //se colidir com parede
    if(((posBolaX+2)>300) || (posBolaX < 0)){
        posBolaX += (dirX * vel)*(-1);
        dirX *= (-1);
    }
    //se colidir com teto
    if(posBolaY<0){
        dirY *= (-1);
    }
    //se colidir com chao
    if(posBolaY > 145){
        perdeu = true;
        console.log("Jogo acabou "+perdeu);
    }

    //se colidir com osbtaculos
    if(posBolaY < 25){
       //primeiro tipo de colição
       let posLinha = (posBolaY - (posBolaY%5))/5;
       let posColuna = (posBolaX - (posBolaX%50))/50;

       
    //colidiu com base do osbtaculo
    if(
        (obstaculo[posColuna][posLinha]>0) && (posBolaY > (posLinha*5)) && (posBolaY < ((posLinha+1)*5)) 
    ){
        console.log("colidiu base");
        dirY *= (-1);
        posBolaY += dirY * Math.floor(vel/3);
        obstaculo[posColuna][posLinha] -= 1;
    }
    
//console.log("posLinha com mult: "+((posLinha)*5));
    if(
        (obstaculo[posColuna][posLinha]>0) && (posBolaY < ((posLinha+1)*5)) && (posBolaY > ((posLinha)*5)) 
    ){
        console.log("colidiu topo");
        dirY *= (-1);
        obstaculo[posColuna][posLinha] -= 1;
    }


  
    }
    if(dirY!=0)posBolaY += dirY * Math.floor(vel/3);
    if(dirX!=0)posBolaX += Math.floor(dirX * vel/3);
 
    ctx.arc(posBolaX, posBolaY, 2, 0, 2 * Math.PI,true);
    ctx.fillStyle = "#000"; // cor do preenchimento
    ctx.fill();
    ctx.stroke();
}
function anima(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    if(!perdeu){
        drawPlayer();
        drawObstaculos();
        drawBola();
    }else{
        renicia();
    }
        
    requestAnimationFrame(anima);
}
function renicia(){
    
    ctx.font = '48px serif';
    ctx.fillText('Perdeu', 50, 50);
    ctx.font = '20px serif';
    ctx.fillText('Pressione enter para reiniciar', 10, 100);
    if(jogarDenovo){
        gerarObstaculos();
        dirX = 0;
        dirY = 1;
        perdeu = false;
        posBolaX = 150;
        posBolaY = 100;
        jogarDenovo = false;
    }
}
function teclaDown(){
    let tecla = event.keyCode;
    //37 - esquerda
    //39 - direita
    //13 - enter
    switch(tecla){
        case 37:
            //console.log("esquerda");
            dir = -1;
            break;
        case 39:
            //console.log("direita");
            dir = 1;
            break;
        case 13:
            if(perdeu)jogarDenovo = true;
    }
}

function teclaUp(){
    let tecla = event.keyCode;
    switch(tecla){
        case 37:
            //console.log("esquerda");
            dir = 0;
            break;
        case 39:
            //console.log("direita");
            dir = 0;
            break;
        case 13:
            //console.log("enter");
    }
}
function inicia(){
    window.addEventListener('keydown',teclaDown);
    window.addEventListener('keyup',teclaUp);
    gerarObstaculos();
    dirX = 0;
    dirY = 1;
    anima();

}

window.addEventListener('load',inicia);


