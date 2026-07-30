// Dice rolling functions
function rollDice(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

function roll2d6() {
  const die1 = rollDice();
  const die2 = rollDice();
  return { die1, die2, total: die1 + die2 };
}

function rollWithMod(mod = 0) {
  const { die1, die2, total } = roll2d6();
  return { die1, die2, total: total + mod };
}