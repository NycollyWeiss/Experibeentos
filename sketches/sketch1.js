let tela = 0;
let canvas;
let fundo;
let tamanhoQuadradinhos = 50;
let toco;
let bode;
let corda;
let mato;


let massa = 10;
let raioMetros = 3;
let velocidade = 3;
let escala = 50;


let centroTrajetoriaX = 610;
let centroTrajetoriaY = 310;

// angulo do bode
let angulo = 0;


let sliderInicio = 0;
let sliderFim = 0;

let sliderMassaY = 0;
let sliderRaioY = 0;
let sliderVelocidadeY = 0;

let controleAtivo = "";


const madeiraEscura = [78, 43, 24];
const madeiraClara = [135, 83, 43];
const bege = [255, 238, 199];
const verde = [93, 177, 91];
const verdeEscuro = [48, 105, 52];

function preload() {
  fundo = loadImage('assets/fundobode.jpg');
  toco = loadImage('assets/toco.png');
  bode = loadImage('assets/bode.png');
  mato = loadImage('assets/mato.png');
  corda = loadImage('assets/Rope.png');
}

function setup() {
  canvas = createCanvas(900, 650);
  canvas.parent('canvas-container');

  textFont('Georgia');
  textAlign(LEFT, CENTER);
  textStyle(NORMAL);


  sliderInicio = 45;
  sliderFim = 255;

  sliderMassaY = 565;
  sliderRaioY = 565;
  sliderVelocidadeY = 565;
}

function draw() {
  background(80, 120, 65);

  imageMode(CORNER);
  image(fundo, 0, 0, width, height);

  desenharGrade();

  let raioPixels = raioMetros * escala;
  let omega = velocidade / raioMetros;
  let forcaCentripeta =
    massa * velocidade * velocidade / raioMetros;

  let xBode =
    centroTrajetoriaX + raioPixels * cos(angulo);

  let yBode =
    centroTrajetoriaY + raioPixels * sin(angulo);

  desenharTrajetoria(raioPixels);


  push();
  translate(centroTrajetoriaX, centroTrajetoriaY);
  rotate(angulo);
  imageMode(CORNER);
  image(corda, 0, -4, raioPixels, 8);
  pop();

  
  push();
  imageMode(CENTER);
  image(
    mato,
    centroTrajetoriaX,
    centroTrajetoriaY + 15,
    100,
    80
  );
  pop();


  push();
  imageMode(CENTER);
  image(
    toco,
    centroTrajetoriaX,
    centroTrajetoriaY,
    50,
    50
  );
  pop();

  push();
  imageMode(CENTER);
  image(bode, xBode, yBode, 60, 60);
  pop();

  desenharPainelInformacoes(omega, forcaCentripeta);
  desenharPainelControles();

  // movimento circular uniforme:
  // omega = v / R
  // theta(t + deltaT) = theta(t) + omega * deltaT
  // deltaTime está em milissegundos; dividimos por 1000.
  angulo += omega * deltaTime / 1000;

  if (angulo > TWO_PI) {
    angulo -= TWO_PI;
  }
}

function desenharGrade() {
  stroke(255, 150);
  strokeWeight(1);

  for (let x = 0; x <= width; x += tamanhoQuadradinhos) {
    line(x, 0, x, height);
  }

  for (let y = 0; y <= height; y += tamanhoQuadradinhos) {
    line(0, y, width, y);
  }

  noStroke();
  fill(255, 225);

  textFont('Georgia');
  textSize(9);
  textStyle(NORMAL);

  for (let x = 0; x < width; x += tamanhoQuadradinhos) {
    text(`(${x},0)`, x + 3, 12);
  }
}

function desenharTrajetoria(raioPixels) {
  noFill();
  stroke(255, 235);
  strokeWeight(2);

  for (let a = 0; a < TWO_PI; a += 0.12) {
    let proximo = a + 0.07;

    arc(
      centroTrajetoriaX,
      centroTrajetoriaY,
      raioPixels * 2,
      raioPixels * 2,
      a,
      proximo
    );
  }
}

function desenharPainelInformacoes(omega, forca) {
  let x = 18;
  let y = 24;
  let w = 325;
  let h = 207;

  desenharPlacaMadeira(x, y, w, h);

  noStroke();
  fill(bege);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(21);
  text('BÉÉÉÉÉÉ', x + 18, y + 25);

  textStyle(NORMAL);
  fill(230, 197, 145);
  textSize(11);
  text('SIMULAÇÃO DE BODE BODANDO', x + 19, y + 47);

  stroke(205, 161, 102);
  strokeWeight(1);
  line(x + 15, y + 63, x + w - 15, y + 63);

  let linhas = [
    ['Massa', `${massa.toFixed(1)} kg`],
    ['Raio', `${raioMetros.toFixed(1)} m`],
    ['Velocidade', `${velocidade.toFixed(1)} m/s`],
    ['Velocidade angular', `${omega.toFixed(2)} rad/s`],
    ['Força centrípeta', `${forca.toFixed(2)} N`]
  ];

  for (let i = 0; i < linhas.length; i++) {
    let linhaY = y + 81 + i * 24;

    noStroke();
    fill(bege);
    textStyle(NORMAL);
    textSize(13);
    text(linhas[i][0], x + 18, linhaY);

    textAlign(RIGHT, CENTER);
    textStyle(BOLD);
    fill(255);
    text(linhas[i][1], x + w - 17, linhaY);

    textAlign(LEFT, CENTER);

    if (i < linhas.length - 1) {
      stroke(255, 45);
      strokeWeight(1);
      line(x + 15, linhaY + 12, x + w - 15, linhaY + 12);
    }
  }
}


function desenharPainelControles() {
  let x = 18;
  let y = 470;
  let w = 864;
  let h = 157;

  desenharPlacaMadeira(x, y, w, h);

  
  noStroke();
  fill(bege);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(19);
  text('Ajuste os parâmetros', x + 20, y + 25);

  textStyle(NORMAL);
  textSize(11);
  fill(230, 197, 145);
  text('Arraste os controles para mudar a simulação', x + 250, y + 25);

  stroke(205, 161, 102);
  strokeWeight(1);
  line(x + 18, y + 44, x + w - 18, y + 44);


  let colunas = [
    {
      x: 34,
      titulo: 'Massa',
      unidade: 'kg',
      valor: massa,
      minimo: 1,
      maximo: 20,
      controle: 'massa',
      y: sliderMassaY
    },
    {
      x: 328,
      titulo: 'Raio',
      unidade: 'm',
      valor: raioMetros,
      minimo: 1,
      maximo: 4,
      controle: 'raio',
      y: sliderRaioY
    },
    {
      x: 600,
      titulo: 'Velocidade',
      unidade: 'm/s',
      valor: velocidade,
      minimo: 1,
      maximo: 10,
      controle: 'velocidade',
      y: sliderVelocidadeY
    }
  ];

  for (let c of colunas) {
    desenharControle(c);
  }
}


function desenharControle(c) {
  let x = c.x;
  let y = 530;
  let w = 270;
  let h = 91;

 
  noStroke();
  fill(65, 37, 22);
  rect(x, y, w, h, 8);

  stroke(174, 119, 68);
  strokeWeight(1);
  noFill();
  rect(x + 2, y + 2, w - 4, h - 4, 7);

  
  noStroke();
  fill(bege);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(14);
  text(c.titulo, x + 12, y + 18);

  
  fill(255);
  textAlign(RIGHT, CENTER);
  textSize(13);
  text(
    `${c.valor.toFixed(1)} ${c.unidade}`,
    x + w - 12,
    y + 18
  );

  
  let inicio = x + 16;
  let fim = x + w - 16;
  let posY = c.y;


  stroke(218, 202, 168);
  strokeWeight(7);
  strokeCap(ROUND);
  line(inicio, posY, fim, posY);


  let proporcao =
    (c.valor - c.minimo) / (c.maximo - c.minimo);

  let posicao = map(proporcao, 0, 1, inicio, fim);

  stroke(verde);
  strokeWeight(7);
  line(inicio, posY, posicao, posY);


  stroke(70, 47, 27);
  strokeWeight(2);
  fill(255, 242, 211);
  circle(posicao, posY, 19);

  noStroke();
  fill(verdeEscuro);
  circle(posicao, posY, 8);

  fill(230, 197, 145);
  textStyle(NORMAL);
  textSize(10);
  textAlign(LEFT, CENTER);
  text(c.minimo, inicio, y + 76);

  textAlign(RIGHT, CENTER);
  text(c.maximo, fim, y + 76);
}

function desenharPlacaMadeira(x, y, w, h) {

  noStroke();
  fill(0, 0, 0, 90);
  rect(x + 5, y + 6, w, h, 12);

 
  fill(madeiraEscura);
  stroke(49, 29, 17);
  strokeWeight(3);
  rect(x, y, w, h, 12);

  noFill();
  stroke(madeiraClara);
  strokeWeight(2);
  rect(x + 6, y + 6, w - 12, h - 12, 9);


  stroke(186, 126, 70, 100);
  strokeWeight(1);
  line(x + 16, y + 9, x + w - 16, y + 9);
  line(x + 16, y + h - 9, x + w - 16, y + h - 9);

  noStroke();
  fill(220, 181, 119);
  circle(x + 13, y + 13, 5);
  circle(x + w - 13, y + 13, 5);
  circle(x + 13, y + h - 13, 5);
  circle(x + w - 13, y + h - 13, 5);
}


function atualizarControle() {
  if (controleAtivo === '') {
    return;
  }

  let inicio;
  let fim;

  if (controleAtivo === 'massa') {
    inicio = 34 + 16;
    fim = 34 + 270 - 16;

    let p = constrain((mouseX - inicio) / (fim - inicio), 0, 1);
    massa = round(map(p, 0, 1, 1, 20));
  }

  if (controleAtivo === 'raio') {
    inicio = 328 + 16;
    fim = 328 + 270 - 16;

    let p = constrain((mouseX - inicio) / (fim - inicio), 0, 1);
    raioMetros = round(map(p, 0, 1, 1, 4) * 10) / 10;
  }

  if (controleAtivo === 'velocidade') {
    inicio = 622 + 16;
    fim = 622 + 270 - 16;

    let p = constrain((mouseX - inicio) / (fim - inicio), 0, 1);
    velocidade = round(map(p, 0, 1, 1, 10) * 2) / 2;
  }
}

function mousePressed() {

  if (mouseY < 530 || mouseY > 588) {
    return;
  }

  if (mouseX >= 34 && mouseX <= 304) {
    controleAtivo = 'massa';
  } else if (mouseX >= 328 && mouseX <= 598) {
    controleAtivo = 'raio';
  } else if (mouseX >= 622 && mouseX <= 892) {
    controleAtivo = 'velocidade';
  }

  atualizarControle();
}


function mouseDragged() {
  atualizarControle();
}


function mouseReleased() {
  controleAtivo = '';
}
