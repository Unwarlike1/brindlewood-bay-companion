// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Initialize data
  initializeData();

  // Load Maven data
  loadMaven();

  // Set up navigation
  setupNavigation();

  // Set up dice roller
  setupDiceRoller();

  // Set up crown toggles
  setupCrowns();
});

// Load Maven data into the UI
function loadMaven() {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);

  // Update header
  document.getElementById('maven-name').textContent = maven.mavenName;
  document.getElementById('maven-style').textContent = `${maven.style} | ${maven.cozyActivity}`;

  // Update stats
  document.getElementById('stat-vitality').textContent = maven.stats.vitality;
  document.getElementById('stat-composure').textContent = maven.stats.composure;
  document.getElementById('stat-reason').textContent = maven.stats.reason;
  document.getElementById('stat-presence').textContent = maven.stats.presence;
  document.getElementById('stat-sensitivity').textContent = maven.stats.sensitivity;

  // Update conditions
  updateConditions();

  // Update crowns
  updateCrowns();

  // Update inventory
  updateInventory();
}

// Get Maven from localStorage
function getMaven(mavenId) {
  const mavens = JSON.parse(localStorage.getItem('brindlewood_mavens'));
  return mavens[mavenId];
}

// Update Maven in localStorage
function updateMaven(mavenId, updates) {
  const mavens = JSON.parse(localStorage.getItem('brindlewood_mavens'));
  mavens[mavenId] = { ...mavens[mavenId], ...updates };
  localStorage.setItem('brindlewood_mavens', JSON.stringify(mavens));
}

// Update conditions display
function updateConditions() {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);
  const conditionsList = document.getElementById('conditions-list');
  const warningElement = document.getElementById('condition-warning');

  // Clear current conditions
  conditionsList.innerHTML = '';

  // Add each condition
  maven.conditions.forEach(condition => {
    const conditionElement = document.createElement('span');
    conditionElement.className = 'condition';
    conditionElement.textContent = condition;
    conditionsList.appendChild(conditionElement);
  });

  // Update warning
  if (maven.conditions.length >= 3) {
    const remaining = 4 - maven.conditions.length;
    warningElement.textContent = `⚠️ ${remaining} condition(s) left before Crown required!`;
  } else {
    warningElement.textContent = '';
  }
}

// Update crowns display
function updateCrowns() {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);

  // Update Queen crowns
  document.querySelectorAll('.crown[data-crown="queen"]').forEach((crown, index) => {
    if (maven.crownQueen[index]) {
      crown.classList.add('used');
    } else {
      crown.classList.remove('used');
    }
  });

  // Update Void crowns
  document.querySelectorAll('.crown[data-crown="void"]').forEach((crown, index) => {
    if (maven.crownVoid[index]) {
      crown.classList.add('used');
    } else {
      crown.classList.remove('used');
    }
  });
}

// Update inventory display
function updateInventory() {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);
  const inventoryList = document.getElementById('inventory-list');

  // Clear current inventory
  inventoryList.innerHTML = '';

  // Add each inventory item
  maven.inventory.forEach(item => {
    const li = document.createElement('li');
    li.className = `inventory-item ${item.used ? 'used' : ''}`;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = item.used;
    input.addEventListener('change', () => {
      item.used = input.checked;
      updateMaven(currentMavenId, { inventory: maven.inventory });
      updateInventory();
    });

    const label = document.createElement('label');
    label.textContent = item.item;

    li.appendChild(input);
    li.appendChild(label);
    inventoryList.appendChild(li);
  });
}

// Set up navigation
function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Hide all screens
      document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
      });

      // Remove active class from all nav buttons
      navButtons.forEach(btn => {
        btn.classList.remove('active');
      });

      // Show selected screen
      const screenId = button.dataset.screen;
      document.getElementById(screenId).classList.remove('hidden');

      // Add active class to clicked button
      button.classList.add('active');
    });
  });
}

// Set up dice roller
function setupDiceRoller() {
  const rollBtn = document.getElementById('roll-btn');
  const resultElement = document.getElementById('dice-result');

  rollBtn.addEventListener('click', () => {
    const mod = parseInt(document.getElementById('stat-mod').value) || 0;
    const { die1, die2, total } = rollWithMod(mod);

    resultElement.innerHTML = `
      <p>Rolled: ${die1} + ${die2} + ${mod >= 0 ? '+' + mod : mod} = <strong>${total}</strong></p>
    `;
  });
}

// Set up crown toggles
function setupCrowns() {
  document.querySelectorAll('.crown').forEach(crown => {
    crown.addEventListener('click', () => {
      const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
      const maven = getMaven(currentMavenId);
      const crownType = crown.dataset.crown;
      const index = parseInt(crown.dataset.index);

      // Check if we're adding the 4th condition without a Crown
      if (maven.conditions.length >= 3 && crownType === 'queen') {
        // Allow marking Crown to add 4th condition
        if (!maven.crownQueen[index]) {
          maven.crownQueen[index] = true;
          updateMaven(currentMavenId, { crownQueen: maven.crownQueen });
          updateCrowns();
          // After marking Crown, update conditions warning
          updateConditions();
          return;
        }
      }

      // For Void Crowns, just toggle
      if (crownType === 'void') {
        maven.crownVoid[index] = !maven.crownVoid[index];
        updateMaven(currentMavenId, { crownVoid: maven.crownVoid });
      }

      updateCrowns();
    });
  });
}