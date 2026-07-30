# Phase 1: Architecture Specification
*Brindlewood Bay Companion App - Prototype*

**Author:** Mistral AI
**Date:** July 29, 2026
**Status:** Approved for Implementation

---

## Data Model

### Maven Object
```javascript
const maven = {
  id: String,          // "maven_001"
  playerName: String,  // "Alice"
  mavenName: String,   // "The Librarian"
  style: String,       // "Scholarly"
  cozyActivity: String,// "Reading"

  stats: {
    vitality: Number,    // 1-5
    composure: Number,   // 1-5
    reason: Number,      // 1-5
    presence: Number,    // 1-5
    sensitivity: Number  // 1-5
  },

  conditions: Array,   // Max 4 strings
  crownQueen: Array,   // [Boolean, Boolean] - max 2
  crownVoid: Array,    // [Boolean, Boolean] - max 2

  inventory: Array,    // [{item: String, used: Boolean}]
  moves: Array,        // [String]
  xp: Number           // Integer
};



localStorage Structure
javascript
Copy

// All Maven data
brindlewood_mavens: JSON { [mavenId]: MavenObject }

// Current Maven ID
brindlewood_currentMaven: String



Component Breakdown

  
    
      File
      Purpose
      Lines of Code (est.)
    
  
  
    
      index.html
      Main structure
      50-100
    
    
      styles.css
      All styling
      100-150
    
    
      app.js
      Main logic
      150-200
    
    
      data.js
      Static data
      50
    
    
      dice.js
      Dice functions
      20
    
  




API Specifications (Future)

getMaven(mavenId) - Retrieve Maven
updateMaven(mavenId, updates) - Update Maven
addCondition(mavenId, condition) - Add condition (enforces Crown rule)
markCrown(mavenId, crownType, index) - Mark Crown as used
rollDice(mod?) - Roll 2d6 with optional modifier
