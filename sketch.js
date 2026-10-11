let tela = 0;

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

function preload() {
  fundoMenu = loadImage('assets/imagem fundo.png');
  fundoArrasto = loadImage('assets/fundo arrasto.png');
  iconePena = loadImage('assets/pena.png');

  audiosBode[0] = loadSound('assets/beh1.mp3');
  audiosBode[1] = loadSound('assets/beh2.mp3');
  audiosBode[2] = loadSound('assets/beh3.mp3');
}

function setup() {
  canvasPrincipal = createCanvas(windowWidth, 650);
  canvasPrincipal.parent('canvas-container');
  textFont('Press Start 2P');

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

  let hoverExp1 = mouseX > btn1X - btnW/2 && mouseX < btn1X + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2;
  let hoverExp2 = mouseX > btn2X - btnW/2 && mouseX < btn2X + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2;

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
  background(20, 25, 40);

  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(16);
  text("EXPERIMENTO 1: FORÇA CENTRÍPETA", width / 2, height / 2 - 40);
  textSize(10);
  fill(0, 229, 255);
  text("aqui é com a nycolly e o bode giratório!", width / 2, height / 2);
  pop();
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

    if (mouseX > btn1X - btnW/2 && mouseX < btn1X + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
      esconderControles();
      tela = 1;
      mostrarControlesExp1();
    }
    else if (mouseX > btn2X - btnW/2 && mouseX < btn2X + btnW/2 && mouseY > btnY - btnH/2 && mouseY < btnY + btnH/2) {
      esconderControles();
      tela = 2;
      posicionarControlesArrasto();
      mostrarControlesArrasto();
    }
  }
}