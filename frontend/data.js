// Static Maven data for Phase 1 prototype
const mavenTemplates = {
  librarian: {
    id: "maven_001",
    mavenName: "The Librarian",
    style: "Scholarly",
    cozyActivity: "Reading",
    stats: { vitality: 3, composure: 4, reason: 5, presence: 2, sensitivity: 3 },
    conditions: [],
    crownQueen: [false, false],
    crownVoid: [false, false],
    inventory: [
      { item: "Flashlight", used: false },
      { item: "Tea Set", used: false },
      { item: "Knitting Needles", used: false }
    ],
    moves: ["Investigate", "Comfort", "Lore"],
    xp: 0
  },
  detective: {
    id: "maven_002",
    mavenName: "The Detective",
    style: "Observant",
    cozyActivity: "Puzzle Solving",
    stats: { vitality: 4, composure: 3, reason: 4, presence: 3, sensitivity: 2 },
    conditions: [],
    crownQueen: [false, false],
    crownVoid: [false, false],
    inventory: [
      { item: "Magnifying Glass", used: false },
      { item: "Notebook", used: false },
      { item: "Coffee", used: false }
    ],
    moves: ["Investigate", "Interrogate", "Deduce"],
    xp: 0
  }
};

// Initialize localStorage with sample data
function initializeData() {
  if (!localStorage.getItem('brindlewood_mavens')) {
    localStorage.setItem('brindlewood_mavens', JSON.stringify(mavenTemplates));
    localStorage.setItem('brindlewood_currentMaven', 'maven_001');
  }
}