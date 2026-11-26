export function getDifficulty(recipe) {
  const score = recipe.time / 10 + recipe.ingredients.length;
  if (score <= 8) return "Easy";
  if (score <= 14) return "Medium";
  return "Advanced";
}

export function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function splitSteps(instructions) {
  return instructions
    .split(/(?<=\.)\s+/)
    .map((step) => step.trim())
    .filter(Boolean);
}

export function scaleIngredient(text, factor) {
  if (factor === 1) return text;

  const match = text.match(/^(\d+(?:\.\d+)?)/);
  if (!match) return text;

  const scaled = Number(match[1]) * factor;
  const rounded = Math.round(scaled * 100) / 100;

  return rounded + text.slice(match[1].length);
}