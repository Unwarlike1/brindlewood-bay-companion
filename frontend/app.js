// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Initialize data (from data.js)
  initializeData();

  // Defensive migration: make sure any existing saved Maven data
  // has every field the current UI expects (inventory, conditions,
  // and the new named-crown arrays), and that brindlewood_currentMaven
  // actually points at a real entry, regardless of what key scheme
  // was used to store it in a previous session.
  ensureMavenDataIntegrity();

  // Load Maven data. Wrapped in a try/catch so that if a browser
  // still has malformed data from an earlier prototype iteration,
  // the app self-heals instead of silently breaking navigation
  // (setupNavigation() must always run, no matter what).
  try {
    loadMaven();
  } catch (err) {
    console.error('Maven data was invalid — resetting to defaults.', err);
    localStorage.removeItem('brindlewood_mavens');
    localStorage.removeItem('brindlewood_currentMaven');
    initializeData();
    ensureMavenDataIntegrity();
    loadMaven();
  }

  // Set up navigation
  setupNavigation();

  // Set up dice roller
  setupDiceRoller();
});

/* ---------------------------------------------------
   CROWN DEFINITIONS
   Official Crown of the Queen (7) and Crown of the Void (5)
   lists. Marked state is stored per-Maven as an array of ids
   (markedQueenCrowns / markedVoidCrowns) rather than a boolean
   array, since crowns are now individually named.
--------------------------------------------------- */
const allCrowns = {
  queen: [
    { id: 'queen_01', name: 'Crown of Hearts' },
    { id: 'queen_02', name: 'Crown of Diamonds' },
    { id: 'queen_03', name: 'Crown of Clubs' },
    { id: 'queen_04', name: 'Crown of Spades' },
    { id: 'queen_05', name: 'Crown of the Sun' },
    { id: 'queen_06', name: 'Crown of the Moon' },
    { id: 'queen_07', name: 'Crown of Stars' }
  ],
  void: [
    { id: 'void_01', name: 'First Layer' },
    { id: 'void_02', name: 'Second Layer' },
    { id: 'void_03', name: 'Third Layer' },
    { id: 'void_04', name: 'Fourth Layer' },
    { id: 'void_05', name: 'Fifth Layer' }
  ]
};

/* ---------------------------------------------------
   DATA INTEGRITY / MIGRATION
--------------------------------------------------- */

// Backfill missing fields on previously-saved Mavens using the
// templates defined in data.js, without altering data.js itself.
//
// Important: data.js stores brindlewood_mavens keyed by template
// name ("librarian", "detective") but stores brindlewood_currentMaven
// as the Maven's internal id ("maven_001"). Those are NOT the same
// string, so this function works off whatever keys actually exist
// in storage (and each entry's own .id field) rather than assuming
// mavenTemplates' outer keys — otherwise a real, already-saved Maven
// can be silently skipped and end up missing fields like
// markedQueenCrowns, which crashes the Crowns tab.
function ensureMavenDataIntegrity() {
  const raw = localStorage.getItem('brindlewood_mavens');
  let mavens = raw ? JSON.parse(raw) : {};
  let changed = false;

  if (!mavens || Object.keys(mavens).length === 0) {
    mavens = {};
    Object.values(mavenTemplates).forEach(template => {
      mavens[template.id] = JSON.parse(JSON.stringify(template));
    });
    changed = true;
  }

  const templateList = Object.values(mavenTemplates);

  Object.keys(mavens).forEach(key => {
    const existing = mavens[key];
    if (!existing) return;

    const template =
      templateList.find(t => t.id === existing.id) || templateList[0];

    if (!Array.isArray(existing.inventory) || existing.inventory.length === 0) {
      existing.inventory = JSON.parse(JSON.stringify(template.inventory));
      changed = true;
    }
    if (!Array.isArray(existing.conditions)) {
      existing.conditions = [];
      changed = true;
    }
    if (!Array.isArray(existing.markedQueenCrowns)) {
      existing.markedQueenCrowns = [];
      changed = true;
    }
    if (!Array.isArray(existing.markedVoidCrowns)) {
      existing.markedVoidCrowns = [];
      changed = true;
    }
  });

  // Make sure brindlewood_currentMaven actually resolves to a real
  // entry, whether storage keys by template name or by internal id.
  const storedCurrent = localStorage.getItem('brindlewood_currentMaven');
  const resolvesDirectly = storedCurrent && mavens[storedCurrent];
  const resolvesById =
    storedCurrent && Object.values(mavens).some(m => m.id === storedCurrent);

  if (!resolvesDirectly && !resolvesById) {
    const firstKey = Object.keys(mavens)[0];
    const fallbackId = mavens[firstKey] ? mavens[firstKey].id || firstKey : 'maven_001';
    localStorage.setItem('brindlewood_currentMaven', fallbackId);
    changed = true;
  }

  if (changed) {
    localStorage.setItem('brindlewood_mavens', JSON.stringify(mavens));
  }
}

/* ---------------------------------------------------
   MAVEN DATA (local storage, synchronous)
--------------------------------------------------- */

// Find the storage key for a given Maven id, whether brindlewood_mavens
// happens to be keyed by that id directly or by a template name whose
// .id field matches it.
function resolveMavenKey(mavens, mavenId) {
  if (mavens[mavenId]) return mavenId;
  return Object.keys(mavens).find(key => mavens[key] && mavens[key].id === mavenId) || null;
}

// Get Maven from localStorage
function getMaven(mavenId) {
  const mavens = JSON.parse(localStorage.getItem('brindlewood_mavens')) || {};
  const key = resolveMavenKey(mavens, mavenId);
  return key ? mavens[key] : undefined;
}

// Update Maven in localStorage
function updateMaven(mavenId, updates) {
  const mavens = JSON.parse(localStorage.getItem('brindlewood_mavens')) || {};
  const key = resolveMavenKey(mavens, mavenId) || mavenId;
  mavens[key] = { ...mavens[key], ...updates };
  localStorage.setItem('brindlewood_mavens', JSON.stringify(mavens));
}

// Load Maven data into the UI
function loadMaven() {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);

  // Header
  document.getElementById('maven-name').textContent = maven.mavenName;
  document.getElementById('maven-style-value').textContent = maven.style;
  document.getElementById('maven-activity-value').textContent = maven.cozyActivity;

  // Stats
  document.getElementById('stat-vitality').textContent = maven.stats.vitality;
  document.getElementById('stat-composure').textContent = maven.stats.composure;
  document.getElementById('stat-reason').textContent = maven.stats.reason;
  document.getElementById('stat-presence').textContent = maven.stats.presence;
  document.getElementById('stat-sensitivity').textContent = maven.stats.sensitivity;

  updateConditions();
  updateCrowns();
  updateInventory();
}

// Update conditions display
function updateConditions() {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);
  const conditionsList = document.getElementById('conditions-list');
  const warningElement = document.getElementById('condition-warning');

  conditionsList.innerHTML = '';

  maven.conditions.forEach(condition => {
    const conditionElement = document.createElement('span');
    conditionElement.className = 'condition';
    conditionElement.textContent = condition;
    conditionsList.appendChild(conditionElement);
  });

  if (maven.conditions.length >= 3) {
    const remaining = 4 - maven.conditions.length;
    warningElement.textContent = `⚠️ ${remaining} condition(s) left before Crown required!`;
  } else {
    warningElement.textContent = '';
  }
}

/* ---------------------------------------------------
   CROWNS TAB
   - Crown of the Queen: 7 named crowns, always toggleable.
     Marked = medallion "cracks" + name struck through.
   - Crown of the Void: 5 named layers, must be filled in
     order from the top. Only the active layer (the next one
     to mark, or the most recently marked one, which is the
     only one allowed to be unmarked) is clickable.
--------------------------------------------------- */

function updateCrowns() {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);

  renderCrownGroup('crown-queen-list', allCrowns.queen, maven.markedQueenCrowns, 'queen');
  renderCrownGroup('crown-void-list', allCrowns.void, maven.markedVoidCrowns, 'void');
}

function renderCrownGroup(containerId, crownDefs, markedIds, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  // Boolean view of marked state, in definition order — used for
  // the Void ordering rule.
  const checkedFlags = crownDefs.map(def => markedIds.includes(def.id));

  crownDefs.forEach((def, index) => {
    const isChecked = checkedFlags[index];
    const enabled = type === 'queen' ? true : isVoidCheckboxEnabled(checkedFlags, index);

    const wrapper = document.createElement('label');
    wrapper.className = `crown-medallion ${isChecked ? 'checked' : ''} ${!enabled ? 'disabled' : ''}`.trim();
    wrapper.setAttribute('for', `crown-${def.id}`);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'medallion-input';
    input.id = `crown-${def.id}`;
    input.checked = isChecked;
    input.disabled = !enabled;
    input.addEventListener('change', () => {
      handleCrownToggle(type, def.id, input.checked);
    });

    const visual = document.createElement('span');
    visual.className = 'medallion-visual';
    visual.setAttribute('aria-hidden', 'true');

    const name = document.createElement('span');
    name.className = 'medallion-name';
    name.textContent = def.name;

    wrapper.appendChild(input);
    wrapper.appendChild(visual);
    wrapper.appendChild(name);
    container.appendChild(wrapper);
  });
}

// A Void layer can be:
//  - marked, if it's currently unmarked AND every layer above it is marked
//  - unmarked, if it's currently marked AND every layer below it is unmarked
// This enforces "fill top to bottom, undo bottom to top" with only
// one clickable layer at a time.
function isVoidCheckboxEnabled(checkedFlags, index) {
  const isChecked = checkedFlags[index];

  if (!isChecked) {
    for (let i = 0; i < index; i++) {
      if (!checkedFlags[i]) return false;
    }
    return true;
  }

  for (let i = index + 1; i < checkedFlags.length; i++) {
    if (checkedFlags[i]) return false;
  }
  return true;
}

function handleCrownToggle(type, crownId, newChecked) {
  const currentMavenId = localStorage.getItem('brindlewood_currentMaven');
  const maven = getMaven(currentMavenId);

  if (type === 'queen') {
    const marked = new Set(maven.markedQueenCrowns);
    if (newChecked) {
      marked.add(crownId);
    } else {
      marked.delete(crownId);
    }
    maven.markedQueenCrowns = Array.from(marked);
    updateMaven(currentMavenId, { markedQueenCrowns: maven.markedQueenCrowns });
  } else {
    const defs = allCrowns.void;
    const checkedFlags = defs.map(def => maven.markedVoidCrowns.includes(def.id));
    const index = defs.findIndex(def => def.id === crownId);

    // Guard against out-of-order toggles even though disabled
    // checkboxes should already prevent this.
    if (index !== -1 && isVoidCheckboxEnabled(checkedFlags, index)) {
      const marked = new Set(maven.markedVoidCrowns);
      if (newChecked) {
        marked.add(crownId);
      } else {
        marked.delete(crownId);
      }
      maven.markedVoidCrowns = Array.from(marked);
      updateMaven(currentMavenId, { markedVoidCrowns: maven.markedVoidCrowns });
    }
  }

  updateCrowns();
}

/* ---------------------------------------------------
   COZY LITTLE PLACE (Inventory)
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