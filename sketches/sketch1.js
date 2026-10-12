let tela = 0;
let canvas;
let fundo;
let tamanhoQuadradinhos = 50;
let toco;
let bode;
let corda;
let mato;
let fundoMenu, fundoArrasto, iconePena;
let audiosBode = [];
let indiceSom = 0;
let mouseNoTituloAnt = false;
let canvasPrincipal;

let sliderMassa, sliderCoef;
let btnIniciar, btnResetar, btnVoltar, btnModoArrasto;

let simulando = false;
let tempo = 0;
let gravidade = 9.81;

// 0 = arrasto linear, 1 = arrasto quadrático
let modoArrasto = 0;

// valores congelados ao iniciar a simulação
let massaFixa = 1.0;
let coefFixo = 0.1;
let massa = 10;
let raioMetros = 3;
let velocidade = 3;
let escala = 50;


let centroTrajetoriaX = 650;
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
  fundoMenu = loadImage('assets/imagem fundo.png');
  fundoArrasto = loadImage('assets/fundo arrasto.png');
  iconePena = loadImage('assets/pena.png');
  fundo = loadImage('assets/fundobode.png');
  toco = loadImage('assets/Toco.png');
  bode = loadImage('assets/Bode .png');
  mato = loadImage('assets/matinho.png');
  corda = loadImage('assets/Rope.png');

  audiosBode[0] = loadSound('assets/beh1.mp3');
  audiosBode[1] = loadSound('assets/beh2.mp3');
  audiosBode[2] = loadSound('assets/beh3.mp3');
}

function setup() {
  canvasPrincipal = createCanvas(windowWidth, 650);
  canvasPrincipal.parent('canvas-container');
  textFont('Press Start 2P');


  sliderInicio = 45;
  sliderFim = 255;

  sliderMassaY = 565;
  sliderRaioY = 565;
  sliderVelocidadeY = 565;

  criarControles();
  esconderControles();
}

function windowResized() {
  resizeCanvas(windowWidth, 650);
  if (tela === 2) {
    posicionarControlesArrasto();
  }
}

function draw() {
  background(15, 20, 30);

  switch (tela) {
    case 0:
      esconderControles();
      telaInicio();
      break;
    case 1:
      mostrarControlesExp1();
      telaExperimento1();
      break;
    case 2:
      mostrarControlesArrasto();
      telaExperimento2();
      break;
  }
}

// ---------------------------------
// TELA 0: menu principal
// ---------------------------------
function telaInicio() {
  if (fundoMenu) {
    image(fundoMenu, 0, 0, width, height);
  } else {
    background(50, 150, 220);
  }

  push();
  textAlign(CENTER, CENTER);

  let t1 = "Experi";
  let tBe = "béé";
  let t2 = "ntos";

  textSize(46);
  let l1 = textWidth(t1);
  let lBe = textWidth(tBe);
  let l2 = textWidth(t2);
  let larguraTotal = l1 + lBe + l2;

  let startX = width / 2 - larguraTotal / 2;
  let yTitulo = 140;

  let mouseNoTitulo = mouseX > startX && mouseX < startX + larguraTotal && mouseY > yTitulo - 35 && mouseY < yTitulo + 35;

  if (mouseNoTitulo && !mouseNoTituloAnt) {
    if (audiosBode[indiceSom] && typeof audiosBode[indiceSom].play === 'function') {
      audiosBode[indiceSom].play();
    }
    indiceSom = (indiceSom + 1) % audiosBode.length;
  }
  mouseNoTituloAnt = mouseNoTitulo;

  let tremorX = mouseNoTitulo ? sin(frameCount * 0.9) * 5 : 0;
  let tremorY = mouseNoTitulo ? cos(frameCount * 0.7) * 5 : 0;

  // sombra do título
  fill(0);
  text(t1, startX + l1 / 2 + 3, yTitulo + 3);
  text(tBe, startX + l1 + lBe / 2 + tremorX + 3, yTitulo + tremorY + 3);
  text(t2, startX + l1 + lBe + l2 / 2 + 3, yTitulo + 3);

  // texto principal
  fill(255);
  text(t1, startX + l1 / 2, yTitulo);
  fill(255, 80, 80);
  text(tBe, startX + l1 + lBe / 2 + tremorX, yTitulo + tremorY);
  fill(255);
  text(t2, startX + l1 + lBe + l2 / 2, yTitulo);
  pop();

  let btnY = 320;
  let btnW = 240;
  let btnH = 65;
  let btn1X = width / 2 - 150;
  let btn2X = width / 2 + 150;

  let hoverExp1 = mouseX > btn1X - btnW / 2 && mouseX < btn1X + btnW / 2 && mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2;
  let hoverExp2 = mouseX > btn2X - btnW / 2 && mouseX < btn2X + btnW / 2 && mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2;

  if (hoverExp1 || hoverExp2) cursor(HAND);

  push();
  rectMode(CENTER);
  textSize(12);

  stroke(hoverExp1 ? '#ffffff' : '#2E7D32');
  strokeWeight(3);
  fill(hoverExp1 ? color(60, 180, 100) : color(76, 175, 80));
  rect(btn1X, btnY, btnW, btnH, 8);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  text('CENTRÍPETA', btn1X, btnY);

  stroke(hoverExp2 ? '#ffffff' : '#2E7D32');
  strokeWeight(3);
  fill(hoverExp2 ? color(46, 125, 50) : color(76, 175, 80));
  rect(btn2X, btnY, btnW, btnH, 8);
  noStroke();
  fill(255);
  text('ARRASTO', btn2X, btnY);
  pop();
}

// ---------------------------------
// TELA 1: centrípeta (nycolly)
// ---------------------------------
function telaExperimento1() {
  background(80, 120, 65);

  imageMode(CORNER);
  image(fundo, 0, 0, width, height);

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
    centroTrajetoriaY - 35,
    100,
    100
  );
  pop();

  push();
  imageMode(CENTER);
  image(bode, xBode, yBode, 90, 90);
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

// ---------------------------------
// TELA 2: força de arrasto (jao)
// ---------------------------------
function telaExperimento2() {
  if (fundoArrasto) {
    image(fundoArrasto, 0, 0, width, height);
  } else {
    background(40, 40, 50);
  }

  // película escura p/ contraste
  push();
  fill(0, 0, 0, 110);
  noStroke();
  rect(0, 0, width, height);
  pop();

  desenharPainelHUD();

  let m = simulando ? massaFixa : sliderMassa.value();
  let c = simulando ? coefFixo : sliderCoef.value();

  let yInicial = 80;
  let yChao = 425;

  if (simulando) {
    tempo += deltaTime / 1000;
  }

  let vTerm = 0;
  let tau = 0;
  let yArrasto = yInicial;

  // cálculo da física conforme o modo selecionado (Linear vs Quadrático)
  if (modoArrasto === 0) {
    let b = c;
    vTerm = (m * gravidade) / b;
    tau = m / b;
    yArrasto = yInicial + vTerm * tempo - vTerm * tau * (1 - exp(-tempo / tau));
  } else {
    vTerm = sqrt((m * gravidade) / c);
    let argumentoCosh = (gravidade * tempo) / vTerm;
    yArrasto = yInicial + (sq(vTerm) / gravidade) * log(Math.cosh(argumentoCosh));
  }

  let chegouAoChao = false;
  if (yArrasto >= yChao) {
    yArrasto = yChao;
    chegouAoChao = true;
  }

  // queda Livre pura (sem arrasto)
  let yLivre = yInicial + 0.5 * gravidade * sq(tempo);
  if (yLivre >= yChao) {
    yLivre = yChao;
  }

  if (chegouAoChao && simulando) {
    simulando = false;
  }

  // linha divisória vertical
  push();
  stroke(255, 255, 255, 120);
  strokeWeight(2);
  line(width / 2, 0, width / 2, 475);

  // títulos superiores
  textAlign(CENTER, TOP);
  textSize(13);

  let tituloEsquerda = modoArrasto === 0 ? "COM ARRASTO LINEAR" : "COM ARRASTO QUADRÁTICO";

  fill(0);
  text(tituloEsquerda, width / 4 + 2, 27);
  fill(255);
  text(tituloEsquerda, width / 4, 25);

  fill(0);
  text("SEM ARRASTO (QUEDA LIVRE)", (width / 4) * 3 + 2, 27);
  fill(255);
  text("SEM ARRASTO (QUEDA LIVRE)", (width / 4) * 3, 25);
  pop();

  // renderizar as penas (tamanho 50x50 pixels)
  push();
  imageMode(CENTER);
  let tamanhoPena = 50;

  if (iconePena) {
    image(iconePena, width / 4, yArrasto, tamanhoPena, tamanhoPena);
    image(iconePena, (width / 4) * 3, yLivre, tamanhoPena, tamanhoPena);
  } else {
    fill(200);
    circle(width / 4, yArrasto, 20);
    circle((width / 4) * 3, yLivre, 20);
  }
  pop();

  // telemetria no painel
  fill('#ffffff');
  textSize(7.5);
  textAlign(LEFT, TOP);
  text(`MASSA (m): ${m.toFixed(1)} kg`, width / 2 - 425, 498);
  text(`COEF. (${modoArrasto === 0 ? 'b' : 'c'}): ${c.toFixed(1)}`, width / 2 - 425, 522);
  text(`VEL. TERMINAL: ${vTerm.toFixed(2)} m/s`, width / 2 - 425, 546);
  text(`TEMPO (t): ${tempo.toFixed(2)} s`, width / 2 - 425, 570);

  desenharGrafico(vTerm, tau);
}

function desenharGrafico(vTerm, tau) {
  let gx = width / 2 + 110;
  let gy = 485;
  let gw = 310;
  let gh = 130;

  push();
  fill(10, 15, 25, 240);
  stroke(51, 65, 85);
  strokeWeight(1.5);
  rect(gx, gy, gw, gh, 6);

  noStroke();
  fill(255, 220, 0);
  textSize(7);
  textAlign(CENTER, TOP);
  text("GRÁFICO: VELOCIDADE x TEMPO (V(t))", gx + gw / 2, gy + 8);

  let origemX = gx + 35;
  let origemY = gy + gh - 22;
  stroke(150);
  strokeWeight(1);
  line(origemX, origemY, origemX + 245, origemY);
  line(origemX, origemY, origemX, gy + 22);

  // curva de velocidade v(t) no gráfico
  noFill();
  stroke(0, 255, 150);
  strokeWeight(2);
  beginShape();
  for (let px = 0; px < 240; px++) {
    let tEval = px * 0.05;
    let vEval = 0;
    if (modoArrasto === 0) {
      let b = sliderCoef.value();
      let m = sliderMassa.value();
      let localTau = m / b;
      vEval = vTerm * (1 - exp(-tEval / localTau));
    } else {
      vEval = vTerm * Math.tanh((gravidade * tEval) / vTerm);
    }
    let py = map(vEval, 0, vTerm * 1.3, 0, gh - 35);
    vertex(origemX + px, origemY - py);
  }
  endShape();

  // linha da Velocidade Terminal Teórica
  stroke(255, 100, 100);
  strokeWeight(1);
  let yTermMapped = map(vTerm, 0, vTerm * 1.3, 0, gh - 35);
  line(origemX, origemY - yTermMapped, origemX + 245, origemY - yTermMapped);

  noStroke();
  fill(255);
  textSize(6);
  textAlign(LEFT, BOTTOM);
  text(`v_term = ${vTerm.toFixed(1)} m/s`, origemX + 5, origemY - yTermMapped - 2);
  pop();
}

// ---------------------------------
// painel e botões
// ---------------------------------
function desenharPainelHUD() {
  push();
  stroke(51, 65, 85);
  strokeWeight(2);
  fill(10, 15, 25, 230);
  rect(width / 2 - 450, 475, 900, 148, 8);
  pop();
}

function criarControles() {
  sliderMassa = createSlider(0.1, 5, 1, 0.1);
  sliderCoef = createSlider(0.1, 5, 1, 0.1);

  btnVoltar = createButton('< VOLTAR');
  btnVoltar.size(95, 30);
  estilizarBotao(btnVoltar);
  btnVoltar.mousePressed(() => {
    esconderControles();
    tela = 0;
    simulando = false;
    tempo = 0;
    sliderMassa.removeAttribute('disabled');
    sliderCoef.removeAttribute('disabled');
  });

  btnModoArrasto = createButton('MODO: LIN');
  btnModoArrasto.size(95, 26);
  estilizarBotao(btnModoArrasto);
  btnModoArrasto.mousePressed(() => {
    if (!simulando) {
      modoArrasto = (modoArrasto + 1) % 2;
      btnModoArrasto.html(modoArrasto === 0 ? 'MODO: LIN' : 'MODO: QUAD');
    }
  });

  btnIniciar = createButton('INICIAR');
  btnIniciar.size(95, 26);
  estilizarBotao(btnIniciar);
  btnIniciar.mousePressed(() => {
    userStartAudio();
    if (!simulando) {
      massaFixa = sliderMassa.value();
      coefFixo = sliderCoef.value();
      simulando = true;
      sliderMassa.attribute('disabled', '');
      sliderCoef.attribute('disabled', '');
      btnModoArrasto.attribute('disabled', '');
    }
  });

  btnResetar = createButton('RESET');
  btnResetar.size(95, 26);
  estilizarBotao(btnResetar);
  btnResetar.mousePressed(() => {
    simulando = false;
    tempo = 0;
    sliderMassa.removeAttribute('disabled');
    sliderCoef.removeAttribute('disabled');
    btnModoArrasto.removeAttribute('disabled');
  });
}

function estilizarBotao(btn) {
  btn.style('background-color', '#1E293B');
  btn.style('color', '#FFFFFF');
  btn.style('font-family', '"Press Start 2P", monospace');
  btn.style('font-size', '8px');
  btn.style('border', '2px solid #475569');
  btn.style('border-radius', '6px');
  btn.style('cursor', 'pointer');

  btn.mouseOver(() => {
    btn.style('background-color', '#334155');
  });
  btn.mouseOut(() => {
    btn.style('background-color', '#1E293B');
  });
}

function posicionarControlesArrasto() {
  let cx = canvasPrincipal.position().x;
  let cy = canvasPrincipal.position().y;
  let centroX = width / 2;

  btnVoltar.position(25, 25);
  sliderMassa.position(centroX - 220, cy + 505);
  sliderCoef.position(centroX - 220, cy + 555);

  btnModoArrasto.position(centroX - 45, cy + 488);
  btnIniciar.position(centroX - 45, cy + 520);
  btnResetar.position(centroX - 45, cy + 552);
}

function mostrarControlesArrasto() {
  btnVoltar.show();
  sliderMassa.show();
  sliderCoef.show();
  btnModoArrasto.show();
  btnIniciar.show();
  btnResetar.show();
}

function mostrarControlesExp1() {
  let cx = canvasPrincipal.position().x;
  let cy = canvasPrincipal.position().y;
  btnVoltar.position(25, 25);
  btnVoltar.show();
}

function esconderControles() {
  if (btnVoltar) btnVoltar.hide();
  if (sliderMassa) sliderMassa.hide();
  if (sliderCoef) sliderCoef.hide();
  if (btnModoArrasto) btnModoArrasto.hide();
  if (btnIniciar) btnIniciar.hide();
  if (btnResetar) btnResetar.hide();
}

function mousePressed() {
  userStartAudio();

  // menu Inicial (cliques nos botões do canvas)
  if (tela === 0) {
    let btnY = 320;
    let btnW = 240;
    let btnH = 65;
    let btn1X = width / 2 - 150;
    let btn2X = width / 2 + 150;

    if (mouseX > btn1X - btnW / 2 && mouseX < btn1X + btnW / 2 && mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2) {
      esconderControles();
      tela = 1;
      mostrarControlesExp1();
    }
    else if (mouseX > btn2X - btnW / 2 && mouseX < btn2X + btnW / 2 && mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2) {
      esconderControles();
      tela = 2;
      posicionarControlesArrasto();
      mostrarControlesArrasto();
    }
  }
  if (tela == 1) {
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
  let y = 94;
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
    ['Velocidade tangencial', `${velocidade.toFixed(1)} m/s`],
    ['Velocidade angular', `${omega.toFixed(2)} rad/s`],
    ['Força centrípeta', `${forca.toFixed(2)} N`]
  ];

  for (let i = 0; i < linhas.length; i++) {
    let linhaY = y + 81 + i * 24;

    noStroke();
    fill(bege);
    textStyle(NORMAL);
    textSize(10);
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
  textSize(10);
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

function mouseDragged() {
  atualizarControle();
}


function mouseReleased() {
  controleAtivo = '';
}
