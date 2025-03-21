import type { GameData, Expansion } from "@/types/game"
import { DEFAULT_IMAGE } from "@/lib/constants"

// This file contains all the game data
export const expansionData: GameData = {
  classic: {
    id: "classic",
    name: "Classic",
    image: `${DEFAULT_IMAGE}?height=400&width=400`,
    description: "The original World of Warcraft experience",
    maps: [
      {
        id: "azeroth",
        name: "Azeroth",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
      {
        id: "kalimdor",
        name: "Kalimdor",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
      {
        id: "eastern-kingdoms",
        name: "Eastern Kingdoms",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
    ],
    instances: [
      {
        id: "dm",
        name: "Deadmines",
        shortName: "DM",
        bossCount: 5,
        completionRate: 40,
        maps: [
          {
            id: "dm1",
            name: "Deadmines 1",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Deadmines+Map+1`,
          },
          {
            id: "dm2",
            name: "Deadmines 2",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Deadmines+Map+2`,
          },
          {
            id: "dm3",
            name: "Deadmines 3",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Deadmines+Map+3`,
          },
        ],
      },
      {
        id: "wc",
        name: "Wailing Caverns",
        shortName: "WC",
        bossCount: 6,
        completionRate: 0,
        maps: [
          {
            id: "wc1",
            name: "Wailing Caverns 1",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Wailing+Caverns+Map+1`,
          },
          {
            id: "wc2",
            name: "Wailing Caverns 2",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Wailing+Caverns+Map+2`,
          },
        ],
      },
      {
        id: "ubrs",
        name: "Upper Blackrock Spire",
        shortName: "UBRS",
        bossCount: 7,
        completionRate: 15,
        maps: [
          {
            id: "ubrs1",
            name: "UBRS 1",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=UBRS+Map+1`,
          },
          {
            id: "ubrs2",
            name: "UBRS 2",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=UBRS+Map+2`,
          },
        ],
      },
      {
        id: "mc",
        name: "Molten Core",
        shortName: "MC",
        bossCount: 10,
        completionRate: 70,
        maps: [
          {
            id: "mc1",
            name: "Molten Core 1",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Molten+Core+Map+1`,
          },
          {
            id: "mc2",
            name: "Molten Core 2",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Molten+Core+Map+2`,
          },
        ],
      },
      {
        id: "bwl",
        name: "Blackwing Lair",
        shortName: "BWL",
        bossCount: 8,
        completionRate: 25,
        maps: [
          {
            id: "bwl1",
            name: "Blackwing Lair 1",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Blackwing+Lair+Map+1`,
          },
          {
            id: "bwl2",
            name: "Blackwing Lair 2",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Blackwing+Lair+Map+2`,
          },
        ],
      },
      {
        id: "aq40",
        name: "Temple of Ahn'Qiraj",
        shortName: "AQ40",
        bossCount: 9,
        completionRate: 55,
        maps: [
          {
            id: "aq1",
            name: "AQ40 1",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=AQ40+Map+1`,
          },
          {
            id: "aq2",
            name: "AQ40 2",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=AQ40+Map+2`,
          },
        ],
      },
      {
        id: "zg",
        name: "Zul'Gurub",
        shortName: "ZG",
        bossCount: 6,
        completionRate: 83,
        maps: [
          {
            id: "zg1",
            name: "Zul'Gurub 1",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Zul'Gurub+Map+1`,
          },
        ],
      },
      {
        id: "ony",
        name: "Onyxia's Lair",
        shortName: "ONY",
        bossCount: 1,
        completionRate: 100,
        maps: [
          {
            id: "ony1",
            name: "Onyxia's Lair",
            image: `${DEFAULT_IMAGE}?height=800&width=1200&text=Onyxia's+Lair+Map`,
          },
        ],
      },
    ],
    bosses: [
      { id: 1, name: "Edwin van Cleef", instance: "Deadmines" },
      { id: 2, name: "Cookie", instance: "Deadmines" },
      { id: 3, name: "Ragnaros", instance: "Molten Core" },
      { id: 4, name: "Onyxia", instance: "Onyxia's Lair" },
      { id: 5, name: "Nefarian", instance: "Blackwing Lair" },
      { id: 6, name: "C'Thun", instance: "Temple of Ahn'Qiraj" },
      { id: 7, name: "Hakkar", instance: "Zul'Gurub" },
      { id: 8, name: "Baron Geddon", instance: "Molten Core" },
      { id: 9, name: "Lucifron", instance: "Molten Core" },
      { id: 10, name: "Magmadar", instance: "Molten Core" },
      { id: 11, name: "Gehennas", instance: "Molten Core" },
      { id: 12, name: "Garr", instance: "Molten Core" },
      { id: 13, name: "Shazzrah", instance: "Molten Core" },
      { id: 14, name: "Sulfuron Harbinger", instance: "Molten Core" },
      { id: 15, name: "Golemagg the Incinerator", instance: "Molten Core" },
      { id: 16, name: "Skeram", instance: "Temple of Ahn'Qiraj" },
      { id: 17, name: "Vem", instance: "Temple of Ahn'Qiraj" },
      { id: 18, name: "Sartura", instance: "Temple of Ahn'Qiraj" },
      { id: 19, name: "Fankriss", instance: "Temple of Ahn'Qiraj" },
      { id: 20, name: "Viscidus", instance: "Temple of Ahn'Qiraj" },
      { id: 21, name: "Huhuran", instance: "Temple of Ahn'Qiraj" },
      { id: 22, name: "Twin Emperors", instance: "Temple of Ahn'Qiraj" },
      { id: 23, name: "Ouro", instance: "Temple of Ahn'Qiraj" },
      { id: 24, name: "Venoxis", instance: "Zul'Gurub" },
      { id: 25, name: "Jeklik", instance: "Zul'Gurub" },
      { id: 26, name: "Marli", instance: "Zul'Gurub" },
      { id: 27, name: "Thekal", instance: "Zul'Gurub" },
      { id: 28, name: "Arlokk", instance: "Zul'Gurub" },
      { id: 29, name: "Razorgore", instance: "Blackwing Lair" },
      { id: 30, name: "Vaelastrasz", instance: "Blackwing Lair" },
      { id: 31, name: "Broodlord", instance: "Blackwing Lair" },
      { id: 32, name: "Firemaw", instance: "Blackwing Lair" },
      { id: 33, name: "Ebonroc", instance: "Blackwing Lair" },
      { id: 34, name: "Flamegor", instance: "Blackwing Lair" },
      { id: 35, name: "Chromaggus", instance: "Blackwing Lair" },
      { id: 36, name: "Mutanus", instance: "Wailing Caverns" },
      { id: 37, name: "Skum", instance: "Wailing Caverns" },
      { id: 38, name: "Lord Serpentis", instance: "Wailing Caverns" },
      { id: 39, name: "Lady Anacondra", instance: "Wailing Caverns" },
      { id: 40, name: "Kresh", instance: "Wailing Caverns" },
      { id: 41, name: "Verdan the Everliving", instance: "Wailing Caverns" },
      { id: 42, name: "Pyroguard Emberseer", instance: "Upper Blackrock Spire" },
      { id: 43, name: "Solakar Flamewreath", instance: "Upper Blackrock Spire" },
      { id: 44, name: "Goraluk Anvilcrack", instance: "Upper Blackrock Spire" },
      { id: 45, name: "Jed Runewatcher", instance: "Upper Blackrock Spire" },
      { id: 46, name: "Warchief Rend Blackhand", instance: "Upper Blackrock Spire" },
      { id: 47, name: "The Beast", instance: "Upper Blackrock Spire" },
      { id: 48, name: "General Drakkisath", instance: "Upper Blackrock Spire" },
    ],
  },
  "burning-crusade": {
    id: "burning-crusade",
    name: "The Burning Crusade",
    image: `${DEFAULT_IMAGE}?height=400&width=400`,
    description: "Journey through the Dark Portal",
    maps: [
      {
        id: "outland",
        name: "Outland",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
    ],
    instances: [],
    bosses: [],
  },
  wrath: {
    id: "wrath",
    name: "Wrath of the Lich King",
    image: `${DEFAULT_IMAGE}?height=400&width=400`,
    description: "Face the terrors of Northrend",
    maps: [
      {
        id: "northrend",
        name: "Northrend",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
    ],
    instances: [],
    bosses: [],
  },
  cataclysm: {
    id: "cataclysm",
    name: "Cataclysm",
    image: `${DEFAULT_IMAGE}?height=400&width=400`,
    description: "Survive the shattering of Azeroth",
    maps: [
      {
        id: "maelstrom",
        name: "The Maelstrom",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
    ],
    instances: [],
    bosses: [],
  },
  pandaria: {
    id: "pandaria",
    name: "Mists of Pandaria",
    image: `${DEFAULT_IMAGE}?height=400&width=400`,
    description: "Explore the mysteries of Pandaria",
    maps: [
      {
        id: "pandaria",
        name: "Pandaria",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
    ],
    instances: [],
    bosses: [],
  },
  warlords: {
    id: "warlords",
    name: "Warlords of Draenor",
    image: `${DEFAULT_IMAGE}?height=400&width=400`,
    description: "Travel to Draenor's past",
    maps: [
      {
        id: "draenor",
        name: "Draenor",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
    ],
    instances: [],
    bosses: [],
  },
  legion: {
    id: "legion",
    name: "Legion",
    image: `${DEFAULT_IMAGE}?height=400&width=400`,
    description: "Defend against the Burning Legion",
    maps: [
      {
        id: "broken-isles",
        name: "Broken Isles",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
    ],
    instances: [],
    bosses: [],
  },
  "war-within": {
    id: "war-within",
    name: "The War Within",
    image: `${DEFAULT_IMAGE}?height=400&width=400`,
    description: "Delve into the depths of Azeroth",
    maps: [
      {
        id: "khaz-algar",
        name: "Khaz Algar",
        image: `${DEFAULT_IMAGE}?height=800&width=1200`,
      },
    ],
    instances: [],
    bosses: [],
  },
}

// Helper function to get all expansions as an array
export function getAllExpansions(): Expansion[] {
  return Object.values(expansionData)
}

