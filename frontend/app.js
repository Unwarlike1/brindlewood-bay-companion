// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Initialize data (from data.js)
  initializeData();

  // Defensive migration: make sure any existing saved Maven data
  // (e.g. from an earlier prototype session) has all the fields
  // the current UI expects. This is what fixes the "Cozy Little
  // Place is empty" bug when localStorage was already populated
  // before inventory/crown data existed.
  ensureMavenDataIntegrity();

  // Load Maven data
  loadMaven();

  // Set up navigation
  setupNavigation();

  // Set up dice roller
  setupDiceRoller();
});

// Backfill missing fields on previously-saved Mavens using the
// templates defined in data.js, without altering data.js itself.
function ensureMavenDataIntegrity() {
  const raw = localStorage.getItem('brindlewood_mavens');
  const mavens = raw ? JSON.parse(raw) : {};
  let changed = false;

  Object.keys(mavenTemplates).forEach(key => {
    const template = mavenTemplates[key];

    if (!mavens[key]) {
      mavens[key] = JSON.parse(JSON.stringify(template));
      changed = true;
      return;
    }

    const existing = mavens[key];

    if (!Array.isArray(existing.inventory) || existing.inventory.length === 0) {
      existing.inventory = JSON.parse(JSON.stringify(template.inventory));
      changed = true;
    }
    if (!Array.isArray(existing.crownQueen) || existing.crownQueen.length === 0) {
      existing.crownQueen = [false, false];
      changed = true;
    }
    if (!Array.isArray(existing.crownVoid) || existing.crownVoid.length === 0) {
      existing.crownVoid = [false, false];
      changed = true;
    }
    if (!Array.isArray(existing.conditions)) {
      existing.conditions = [];
      changed = true;
    }
  });

  if (!localStorage.getItem('brindlewood_currentMaven')) {
    localStorage.setItem('brindlewood_currentMaven', 'maven_001');
    changed = true;
  }

  if (changed) {
    localStorage.setItem('brindlewood_mavens', JSON.stringify(mavens));
  }
}

// Load Maven data into the UI
function loadMaven() {
  // SAFETY CHECK - Initialize if needed
  if (!localStorage.getItem('brindlewood_mavens')) {
    initializeData();  // Make sure data exists
  }

  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  if (!currentMavenId) {
    // Set a default if none exists
    localStorage.setItem('brindlewood_currentMaven', 'maven_001');
  }

  const maven = getMaven(localStorage.getItem('brindlewood_currentMaven'));
  if (!maven) {
    console.error("Maven not found! Using default.");
    // Use a fallback
    document.getElementById('maven-name').textContent = "The Librarian";
    // ... set other defaults
    return;
  }
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);

  // Update header (now two separate lines instead of "Style | Activity")
  document.getElementById('maven-name').textContent = maven.mavenName;
  document.getElementById('maven-style-value').textContent = maven.style;
  document.getElementById('maven-activity-value').textContent = maven.cozyActivity;

  // Update stats
  document.getElementById('stat-vitality').textContent = maven.stats.vitality;
  document.getElementById('stat-composure').textContent = maven.stats.composure;
  document.getElementById('stat-reason').textContent = maven.stats.reason;
  document.getElementById('stat-presence').textContent = maven.stats.presence;
  document.getElementById('stat-sensitivity').textContent = maven.stats.sensitivity;

  // Update conditions
  updateConditions();

  // Update crowns (Crowns tab)
  updateCrowns();

  // Update inventory (Cozy Little Place)
  updateInventory();
}

// Get Maven from localStorage
async function getMaven(mavenId) {
  const response = await fetch(
    'https://script.google.com/macros/s/AKfycbyv_A5QzoqRBCBVaNQijSGrKaZaqdDPRLxQr3823P1F5hgLPAD1EpdSlCNX1qhJ7Ssfaw/exec?endpoint=api/mavens&playerId=' + mavenId
  );
  return await response.json();
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

/* ---------------------------------------------------
   CROWNS TAB
   - Crown of the Queen: 2 checkboxes, always toggleable.
     Checked = greyed out + strike-through.
   - Crown of the Void: 2 checkboxes, must be filled in
     order from the top. Only the "active" box (the next
     one to check, or the most recently checked one, which
     is the only one allowed to be unchecked) is clickable.
     Everything else is disabled/greyed out.
--------------------------------------------------- */

function updateCrowns() {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);

  renderCrownGroup('crown-queen-list', maven.crownQueen, 'queen', 'Crown of the Queen');
  renderCrownGroup('crown-void-list', maven.crownVoid, 'void', 'Crown of the Void');
}

function renderCrownGroup(containerId, crownArray, type, labelPrefix) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  crownArray.forEach((checked, index) => {
    const enabled = type === 'queen' ? true : isVoidCheckboxEnabled(crownArray, index);

    const row = document.createElement('div');
    row.className = `crown-checkbox-row ${checked ? 'checked' : ''} ${!enabled ? 'disabled' : ''}`.trim();

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `crown-${type}-${index}`;
    input.checked = checked;
    input.disabled = !enabled;

    input.addEventListener('change', () => {
      handleCrownToggle(type, index, input.checked);
    });

    const label = document.createElement('label');
    label.setAttribute('for', input.id);
    label.textContent = `${labelPrefix} ${index + 1}`;

    row.appendChild(input);
    row.appendChild(label);
    container.appendChild(row);
  });
}

// A Void checkbox can be:
//  - checked, if it's currently unchecked AND every box above it is checked
//  - unchecked, if it's currently checked AND every box below it is unchecked
// This enforces "fill top to bottom, undo bottom to top" with only one
// clickable box at a time.
function isVoidCheckboxEnabled(crownArray, index) {
  const isChecked = crownArray[index];

  if (!isChecked) {
    for (let i = 0; i < index; i++) {
      if (!crownArray[i]) return false;
    }
    return true;
  }

  for (let i = index + 1; i < crownArray.length; i++) {
    if (crownArray[i]) return false;
  }
  return true;
}

function handleCrownToggle(type, index, newChecked) {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);

  if (type === 'queen') {
    maven.crownQueen[index] = newChecked;
    updateMaven(currentMavenId, { crownQueen: maven.crownQueen });
  } else {
    // Guard against out-of-order toggles even though disabled
    // checkboxes should already prevent this.
    if (isVoidCheckboxEnabled(maven.crownVoid, index)) {
      maven.crownVoid[index] = newChecked;
      updateMaven(currentMavenId, { crownVoid: maven.crownVoid });
    }
  }

  updateCrowns();
}

/* ---------------------------------------------------
   COZY LITTLE PLACE (Inventory)
   - Pulls straight from the Maven's inventory (seeded from
     data.js), with free check/uncheck and no ordering rules.
--------------------------------------------------- */

function updateInventory() {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);
  const inventoryList = document.getElementById('inventory-list');

  inventoryList.innerHTML = '';

  maven.inventory.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `inventory-item ${item.used ? 'used' : ''}`.trim();

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `inventory-item-${index}`;
    input.checked = item.used;
    input.addEventListener('change', () => {
      item.used = input.checked;
      updateMaven(currentMavenId, { inventory: maven.inventory });
      updateInventory();
    });

    const label = document.createElement('label');
    label.setAttribute('for', input.id);
    label.textContent = item.item;

    li.appendChild(input);
    li.appendChild(label);
    inventoryList.appendChild(li);
  });
}

/* ---------------------------------------------------
   NAVIGATION
--------------------------------------------------- */

function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const screens = document.querySelectorAll('.screen');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const screenId = button.dataset.screen;
      const targetScreen = document.getElementById(screenId);
      if (!targetScreen) return;

      screens.forEach(screen => screen.classList.add('hidden'));
      navButtons.forEach(btn => btn.classList.remove('active'));

      targetScreen.classList.remove('hidden');
      button.classList.add('active');
    });
  });
}

/* ---------------------------------------------------
   DICE ROLLER
--------------------------------------------------- */

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