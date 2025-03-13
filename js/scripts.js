// Elementos da interface
const screens = {
  welcome: document.getElementById("welcome-screen"),
  activitySelection: document.getElementById("activity-selection-screen"),
  activityInProgress: document.getElementById("activity-in-progress-screen"),
  summary: document.getElementById("summary-screen"),
  ranking: document.getElementById("ranking-screen"),
  activities: document.getElementById("activities-history-screen"),
  profile: document.getElementById("profile-screen"),
  rewards: document.getElementById("rewards-screen"),
};

const buttons = {
  start: document.getElementById("start-button"),
  startActivity: document.getElementById("start-activity-button"),
  stop: document.getElementById("stop-button"),
  home: document.getElementById("home-button"),
  ranking: document.getElementById("ranking-button"),
};

const backButton = document.querySelector(".back-button");
const navFooter = document.getElementById("nav-footer");
const activityCards = document.querySelectorAll(".activity-card");

// Elementos de progresso
const timeValue = document.getElementById("time-value");
const distanceValue = document.getElementById("distance-value");
const capibasValue = document.getElementById("capibas-value");
const activityTitle = document.getElementById("activity-title");

// Elementos de resumo
const summaryCapibas = document.getElementById("summary-capibas");
const summaryTime = document.getElementById("summary-time");
const summaryDistance = document.getElementById("summary-distance");
const summaryCalories = document.getElementById("summary-calories");

// Variáveis de controle
let selectedActivity = null;
let timerInterval = null;
let seconds = 0;
let distance = 0;
let capibas = 0;
let map = null;
let userMarker = null;
let routePath = null;
let currentPointIndex = 0;
let simulationInterval;

// Coordenadas do Parque da Jaqueira em Recife
const parqueJaqueiraCenter = [-8.036931, -34.904897];

// Coordenadas do centro da rota de estrada
const rotaEstradaCenter = [-8.029193, -34.901038];

// Coordenadas do circuito do Parque da Jaqueira (aproximado)
// Este é um circuito fictício baseado no formato real do parque
const circuitoJaqueira = [
  [-8.036317, -34.904145], // Entrada oeste
  [-8.036696, -34.903788],
  [-8.036927, -34.903667],
  [-8.037031, -34.903625],
  [-8.037198, -34.903621], // Parte leste
  [-8.037345, -34.903637],
  [-8.037484, -34.903796],
  [-8.037828, -34.904002],
  [-8.037983, -34.904153],
  [-8.038098, -34.904579],
  [-8.038095, -34.904716],
  [-8.037963, -34.90485],
  [-8.037822, -34.904873],
  [-8.03774, -34.904847],
  [-8.037405, -34.904511],
  [-8.037299, -34.904464],
  [-8.037162, -34.904477],
  [-8.036609, -34.905047],
  [-8.036617, -34.905227],
  [-8.03699, -34.905575],
  [-8.037013, -34.90568],
  [-8.036971, -34.90575],
  [-8.036712, -34.905937],
  [-8.03648, -34.906058],
  [-8.036415, -34.906066],
  [-8.036364, -34.906034],
  [-8.036218, -34.905831],
  [-8.036044, -34.905582],
  [-8.03588, -34.905351],
  [-8.035651, -34.905027],
  [-8.035619, -34.904879],
  [-8.03566, -34.904758],
  [-8.035768, -34.904631],
  [-8.03606, -34.904377],
  [-8.036317, -34.904145], // Retorno ao início
];

// Adicione abaixo da definição do circuitoJaqueira
const rotaEstrada = [
  [-8.029193, -34.901038], // Ponto inicial (mesmo do circuito do parque)
  [-8.030154, -34.899627], // Saída do parque
  [-8.030785, -34.898823], // Nova coordenada na estrada
  [-8.031506, -34.898064],
  [-8.031867, -34.898277], // Nova coordenada na estrada
  [-8.032964, -34.898307], // Nova coordenada na estrada
  [-8.03382, -34.898368], // Nova coordenada na estrada
  [-8.034556, -34.898428], // Nova coordenada na estrada
  [-8.035593, -34.898489], // Nova coordenada na estrada
  [-8.036615, -34.898944], // Nova coordenada na estrada
  [-8.037321, -34.899688], // Nova coordenada na estrada
  [-8.038057, -34.900492], // Nova coordenada na estrada
  [-8.038763, -34.901812], // Nova coordenada na estrada
  [-8.039409, -34.90122], // Nova coordenada na estrada
  [-8.040686, -34.900189], // Nova coordenada na estrada
  [-8.041196, -34.899771], // Nova coordenada na estrada
  [-8.041908, -34.89917], // Nova coordenada na estrada
  [-8.042556, -34.898666], // Nova coordenada na estrada
  [-8.04382, -34.898322], // Nova coordenada na estrada
  [-8.044383, -34.898215], // Nova coordenada na estrada
  [-8.045158, -34.898365], // Nova coordenada na estrada
  [-8.045481, -34.896976], // Nova coordenada na estrada
  [-8.045834, -34.895462], // Nova coordenada na estrada
  [-8.046209, -34.894374], // Nova coordenada na estrada
  [-8.046356, -34.894405], // Nova coordenada na estrada
  [-8.046712, -34.894614], // Nova coordenada na estrada
  [-8.04727, -34.894952], // Nova coordenada na estrada
  [-8.047625, -34.895135], // Nova coordenada na estrada
  [-8.04805, -34.894233], // Nova coordenada na estrada
  [-8.048422, -34.893439], // Nova coordenada na estrada
  [-8.048894, -34.892492], // Nova coordenada na estrada
  [-8.049301, -34.891599], // Nova coordenada na estrada
  [-8.049558, -34.890853], // Nova coordenada na estrada
  [-8.049676, -34.890203], // Nova coordenada na estrada
  [-8.049767, -34.889629], // Nova coordenada na estrada
  [-8.049585, -34.888794], // Nova coordenada na estrada
  [-8.04971, -34.8881], // Nova coordenada na estrada
  [-8.049852, -34.887566], // Nova coordenada na estrada
  [-8.049767, -34.887453], // Nova coordenada na estrada
  [-8.049933, -34.887221], // Nova coordenada na estrada
  [-8.050024, -34.887339], // Nova coordenada na estrada
  [-8.050344, -34.886838], // Nova coordenada na estrada
  [-8.050639, -34.886442], // Nova coordenada na estrada
  [-8.051007, -34.885929], // Nova coordenada na estrada
  [-8.051336, -34.885486], // Nova coordenada na estrada
  [-8.051696, -34.885011], // Nova coordenada na estrada
  [-8.052085, -34.884488], // Nova coordenada na estrada
  [-8.052486, -34.883981], // Nova coordenada na estrada
  [-8.052664, -34.883765], // Nova coordenada na estrada
  [-8.052578, -34.883705], // Nova coordenada na estrada
  [-8.05277, -34.883405], // Nova coordenada na estrada
  [-8.052903, -34.883183], // Nova coordenada na estrada
  [-8.052728, -34.883055], // Nova coordenada na estrada
];

// Inicializar mapa
function initMap(routeType = "parque") {
  const mapCenter =
    routeType === "estrada" ? rotaEstradaCenter : parqueJaqueiraCenter;
  const zoomLevel = routeType === "estrada" ? 16 : 17; // Zoom menor para ver mais da rota de estrada

  map = L.map("map").setView(mapCenter, zoomLevel);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Escolher a rota com base no tipo
  const routeCoordinates =
    routeType === "estrada" ? rotaEstrada : circuitoJaqueira;

  // Desenhar a rota no mapa
  routePath = L.polyline(routeCoordinates, {
    color: routeType === "estrada" ? "#e74c3c" : "#003d7a", // Cor diferente para estrada
    weight: 5,
    opacity: 0.7,
  }).addTo(map);

  // Adicionar marcador para o usuário
  const userIcon = L.divIcon({
    className: "user-marker",
    iconSize: [20, 20],
  });

  userMarker = L.marker(routeCoordinates[0], {
    icon: userIcon,
  }).addTo(map);

  // Atualizar a variável global para usar a rota atual
  currentRoute = routeCoordinates;
  currentPointIndex = 0;
}

// Função para calcular a distância entre dois pontos em km
function calculateDistance(point1, point2) {
  const lat1 = point1[0];
  const lon1 = point1[1];
  const lat2 = point2[0];
  const lon2 = point2[1];

  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Função para mover o marcador do usuário ao longo do circuito
function moveUserMarker() {
  if (currentPointIndex >= currentRoute.length - 1) {
    currentPointIndex = 0; // Reiniciar o circuito
  }

  const currentPoint = currentRoute[currentPointIndex];
  const nextPoint = currentRoute[currentPointIndex + 1];

  // Mover o marcador para o próximo ponto
  userMarker.setLatLng(nextPoint);

  // Calcular distância percorrida
  const segmentDistance = calculateDistance(currentPoint, nextPoint);
  distance += segmentDistance;
  distanceValue.textContent = distance.toFixed(1);

  // Calcular Capibas com base na distância
  capibas = Math.floor(distance * 50);
  capibasValue.textContent = capibas;

  // Centralizar o mapa no marcador
  map.panTo(nextPoint);

  // Avançar para o próximo ponto
  currentPointIndex++;
}

// Função para mostrar uma tela específica
function showScreen(screenId) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("active");
  });

  screens[screenId].classList.add("active");

  // Mostrar/esconder botão de voltar e navbar conforme a tela
  if (screenId === "welcome") {
    backButton.style.display = "none";
    navFooter.style.display = "none";
  } else {
    backButton.style.display = "block";

    if (screenId === "activityInProgress") {
      navFooter.style.display = "none";
    } else if (screenId !== "welcome") {
      navFooter.style.display = "flex";
    }
  }
}

// Formatar tempo (MM:SS)
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Iniciar timer da atividade
function startTimer() {
  // Reinicializar o mapa com a rota correta
  if (map) {
    map.remove();
    map = null;
  }

  const routeType = selectedActivity.includes("estrada") ? "estrada" : "parque";
  initMap(routeType);

  timerInterval = setInterval(() => {
    seconds = seconds + 17;
    timeValue.textContent = formatTime(seconds);
  }, 1000);

  // Iniciar movimento no mapa
  simulationInterval = setInterval(moveUserMarker, 1000);
}
// Parar timer
function stopTimer() {
  clearInterval(timerInterval);
  clearInterval(simulationInterval);

  // Resetar posição do marcador
  if (userMarker) {
    currentPointIndex = 0;
    userMarker.setLatLng(circuitoJaqueira[0]);
  }
}

// Configuração de eventos
buttons.start.addEventListener("click", () => {
  showScreen("activitySelection");
});

activityCards.forEach((card) => {
  card.addEventListener("click", () => {
    // Remover seleção anterior
    activityCards.forEach((c) => c.classList.remove("selected"));

    // Marcar o selecionado
    card.classList.add("selected");
    selectedActivity = card.getAttribute("data-activity");

    // Habilitar o botão de iniciar
    buttons.startActivity.removeAttribute("disabled");
  });
});

buttons.startActivity.addEventListener("click", () => {
  showScreen("activityInProgress");

  // Atualizar título conforme a atividade selecionada
  const activityNames = {
    caminhada: "Caminhada",
    corrida: "Corrida",
    bicicleta: "Pedalada",
    "bicicleta-estrada": "Pedalada na Estrada",
    "patinete-estrada": "Patinete na Estrada",
  };

  activityTitle.textContent = `${activityNames[selectedActivity]} em andamento`;

  // Iniciar timer e simulação
  startTimer();
});

buttons.stop.addEventListener("click", () => {
  stopTimer();

  // Atualizar tela de resumo
  summaryCapibas.textContent = capibas;
  summaryTime.textContent = formatTime(seconds);
  summaryDistance.textContent = distance.toFixed(1);

  // Calcular calorias fictícias
  const calorieFactors = {
    caminhada: 4.5,
    corrida: 8.5,
    bicicleta: 6.5,
    "bicicleta-estrada": 7,
    "patinete-estrada": 2.5,
  };

  const factor = calorieFactors[selectedActivity] || 5;
  const calories = Math.floor(distance * factor * 10);
  summaryCalories.textContent = calories;

  showScreen("summary");
});

buttons.home.addEventListener("click", () => {
  // Resetar valores
  seconds = 0;
  distance = 0;
  capibas = 0;
  timeValue.textContent = "00:00";
  distanceValue.textContent = "0.0";
  capibasValue.textContent = "0";

  if (map) {
    currentPointIndex = 0;
    userMarker.setLatLng(circuitoJaqueira[0]);
    map.panTo(circuitoJaqueira[0]);
  }

  showScreen("welcome");
});

buttons.ranking.addEventListener("click", () => {
  showScreen("ranking");
});

backButton.addEventListener("click", () => {
  if (screens.activitySelection.classList.contains("active")) {
    showScreen("welcome");
  } else if (screens.activityInProgress.classList.contains("active")) {
    stopTimer();
    showScreen("activitySelection");
  } else if (screens.summary.classList.contains("active")) {
    showScreen("welcome");
  } else if (screens.ranking.classList.contains("active")) {
    showScreen("summary");
  }
});

// Navegação de rodapé
const navItems = document.querySelectorAll(".nav-item");
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remover classe ativa de todos os itens
    navItems.forEach((i) => i.classList.remove("active"));

    // Adicionar classe ativa ao item clicado
    item.classList.add("active");

    // Mostrar tela correspondente
    const screen = item.getAttribute("data-screen");
    if (screen === "home") {
      showScreen("welcome");
    } else if (screen === "activities") {
      showScreen("activities");
    } else if (screen === "profile") {
      showScreen("profile");
    } else if (screen === "rewards") {
      showScreen("ranking");
    }
  });
});

// Abas da tela de recompensas
const rewardTabs = document.querySelectorAll(".reward-tab");
rewardTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    rewardTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    // Aqui poderia carregar recompensas diferentes para cada categoria
  });
});

// Abas de ranking
const rankingTabs = document.querySelectorAll(".ranking-tab");
rankingTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    rankingTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    // Aqui poderia carregar dados diferentes para cada período
  });
});
