export const wowEmojis = [
  ...Array(10).fill("🗡️"),
  ...Array(10).fill("⚔️"),
  ...Array(10).fill("🏹"),
  ...Array(7).fill("🛡️"),
  ...Array(5).fill("⚡"),
  ...Array(5).fill("🔥"),
  ...Array(5).fill("❄️"),
  ...Array(5).fill("💀"),
  ...Array(5).fill("🔮"),
  ...Array(3).fill("🏰"),
  ...Array(3).fill("🐉"),
  ...Array(3).fill("🧙‍♂️"),
  ...Array(3).fill("🧙‍♀️"),
  "👑",
  "🦁",
  "🐺",
  "🦅",
  "🦉",
  "🦊",
  "🐍",
  "🦂",
  "🦇",
  "🪄",
  "⛓️",
  "👾",
];

export const getRandomEmojis = () => {
  // Get a random number of emojis between 5 and 25
  const count = Math.floor(Math.random() * 21) + 5; // Random number between 5 and 25

  // Create an array to store the selected emojis
  const selectedEmojis: string[] = [];

  // Randomly select emojis from the wowEmojis array
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * wowEmojis.length);
    selectedEmojis.push(wowEmojis[randomIndex]);
  }

  return selectedEmojis;
}
