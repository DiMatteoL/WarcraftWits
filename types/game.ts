/**
 * Core game data types for the WoW Memory Game
 */

/**
 * Represents a World of Warcraft expansion
 */
export interface Expansion {
  id: string
  name: string
  image: string
  description: string
  maps: Map[]
  instances: Instance[]
  bosses: Boss[]
}

/**
 * Represents a world map in an expansion
 */
export interface Map {
  id: string
  name: string
  image: string
}

/**
 * Represents a dungeon or raid instance
 */
export interface Instance {
  id: string
  name: string
  shortName: string
  bossCount: number
  completionRate: number
  maps: InstanceMap[]
}

/**
 * Represents a map within an instance
 */
export interface InstanceMap {
  id: string
  name: string
  image: string
}

/**
 * Represents a boss in an instance
 */
export interface Boss {
  id: number
  name: string
  instance: string
}

/**
 * Extended instance type with calculated completion rate
 */
export interface InstanceWithCompletion extends Instance {
  calculatedCompletionRate: number
}

/**
 * Type for the entire game data structure
 */
export interface GameData {
  [expansionId: string]: Expansion
}

