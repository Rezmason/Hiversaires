'use strict'

class Input {}
setEnumValues(Input, ['left', 'right', 'center', 'forward', 'back', 'action'])

class Chapter {}
setEnumValues(Chapter, ['act1', 'act2', 'act3', 'act4', 'act5', 'credit'])

class Zone {}
setEnumValues(Zone, [
  'antechannel',
  'capsule',
  'circular',
  'entente',
  'forest',
  'metamondst',
  'nataniev',
  'rainre',
  'stones',
  'studio'
])

const SealOrder = Object.freeze([
  Zone.forest,
  Zone.stones,
  Zone.rainre,
  Zone.metamondst,
  Zone.antechannel
])

class MazeAxis {}
setEnumValues(MazeAxis, ['x', 'y'])

class MazeEffect {}
setEnumValues(MazeEffect, ['incr', 'decr', 'exit'])

const ententeIcons = (function () {
  const ententeIcons = new Map()
  ententeIcons.set(-1, 'left')
  ententeIcons.set(0, 'straight')
  ententeIcons.set(1, 'right')
  return Object.freeze(ententeIcons)
})()

const recordsByChapter = (function () {
  const recordsByChapter = new Map()
  recordsByChapter.set(Chapter.act1, 'music_act1')
  recordsByChapter.set(Chapter.act2, 'music_act2')
  recordsByChapter.set(Chapter.act3, 'music_act3')
  recordsByChapter.set(Chapter.act4, 'music_act4')
  recordsByChapter.set(Chapter.act5, 'music_act5')
  recordsByChapter.set(Chapter.credit, 'music_credit')
  return Object.freeze(recordsByChapter)
})()

const ambienceByZone = (function () {
  const ambienceByZone = new Map()
  ambienceByZone.set(Zone.antechannel, 'ambient_antechannel')
  ambienceByZone.set(Zone.capsule, 'ambient_capsule')
  ambienceByZone.set(Zone.circular, 'ambient_circular')
  ambienceByZone.set(Zone.entente, null) // Weird omission, eh?
  ambienceByZone.set(Zone.forest, 'ambient_forest')
  ambienceByZone.set(Zone.metamondst, 'ambient_metamondst')
  ambienceByZone.set(Zone.nataniev, 'ambient_nataniev')
  ambienceByZone.set(Zone.rainre, 'ambient_rainre')
  ambienceByZone.set(Zone.stones, 'ambient_stones')
  ambienceByZone.set(Zone.studio, 'ambient_studio')
  return Object.freeze(ambienceByZone)
})()

class SubjectType {}
setEnumValues(SubjectType, ['node', 'puzzle', 'none'])

class PuzzleType {}
setEnumValues(PuzzleType, ['door', 'terminal'])

class Node {
  constructor (id, zone, subjects) {
    this.id = id
    this.zone = zone
    this.subjects = subjects
    Object.freeze(this)
  }
}

const nodesByID = (function () {
  const nodesByID = new Map()

  const addNode = (id, zone, subject0, subject1, subject2, subject3) => {
    nodesByID.set(
      id,
      Object.freeze(
        new Node(id, zone, [subject0, subject1, subject2, subject3])
      )
    )
  }

  const node = (nodeID, orientation, mapIgnore = false) => {
    return Object.freeze({
      type: SubjectType.node,
      nodeID,
      orientation,
      mapIgnore
    })
  }

  const terminal = puzzleID => {
    return Object.freeze({
      type: SubjectType.puzzle,
      puzzleType: PuzzleType.terminal,
      puzzleID
    })
  }

  const door = (
    puzzleID,
    nodeID,
    orientation,
    secretNodeID,
    secretOrientation
  ) => {
    return Object.freeze({
      type: SubjectType.puzzle,
      puzzleType: PuzzleType.door,
      puzzleID,
      nodeID,
      orientation,
      alternateNodeID: secretNodeID,
      alternateOrientation: secretOrientation
    })
  }

  const secretDoor = (puzzleID, secretNodeID, secretOrientation) => {
    return Object.freeze({
      type: SubjectType.puzzle,
      puzzleType: PuzzleType.door,
      puzzleID,
      alternateNodeID: secretNodeID,
      alternateOrientation: secretOrientation
    })
  }

  const maze = (
    subject,
    puzzleID,
    axis,
    effect,
    amount,
    mazeNodeID,
    mazeOrientation
  ) => {
    return Object.freeze({
      nodeID: subject.nodeID,
      orientation: subject.orientation,
      type: SubjectType.puzzle,
      puzzleType: PuzzleType.door,
      puzzleID,
      axis,
      effect,
      amount,
      alternateNodeID: mazeNodeID,
      alternateOrientation: mazeOrientation
    })
  }

  const none = Object.freeze({ type: SubjectType.none })

  addNode(0, Zone.forest, node(1), none, none, none)
  addNode(1, Zone.forest, node(2), none, door(28, 89), none)
  addNode(2, Zone.forest, node(3), none, node(1), none)
  addNode(3, Zone.forest, node(11), node(10, 2), node(2), node(4, 0))
  addNode(4, Zone.forest, node(5), none, node(3, 1), none)
  addNode(5, Zone.forest, node(6), none, node(4), terminal(4))
  addNode(6, Zone.forest, node(7, 1), none, node(5), none)
  addNode(7, Zone.forest, node(12), node(8, 0), terminal(1), node(6, 2))
  addNode(8, Zone.forest, node(9, 2), none, node(7, 3), none)
  addNode(9, Zone.forest, node(8, 2), none, node(10, 0), none)

  addNode(10, Zone.forest, node(3, 3), none, node(9, 0), none)
  addNode(11, Zone.forest, door(25, 48, 2), none, node(3), none)
  addNode(12, Zone.forest, door(3, 13), none, node(7), node(14, 0))
  addNode(13, Zone.studio, node(17), node(15), door(3, 12), terminal(2))
  addNode(14, Zone.forest, node(18), none, node(12, 1), none)
  addNode(15, Zone.studio, node(16), none, none, node(13))
  addNode(16, Zone.studio, node(21), door(7, 22), node(15), node(17))
  addNode(17, Zone.studio, node(20), node(16), node(13), none)
  addNode(18, Zone.forest, terminal(31), terminal(2), node(14), none)
  addNode(19, Zone.studio, none, node(20), terminal(5), none)

  addNode(20, Zone.studio, secretDoor(6, 116, 1), node(21), node(17), node(19))
  addNode(21, Zone.studio, terminal(35), none, node(16), node(20))
  addNode(22, Zone.circular, none, node(23), none, node(16))
  addNode(23, Zone.circular, node(30), terminal(16), node(24), door(7, 22))
  addNode(24, Zone.circular, node(23), none, node(25), none)
  addNode(25, Zone.circular, node(24), none, node(26), door(8, 31, 2))
  addNode(26, Zone.circular, node(25), none, node(27), none)
  addNode(27, Zone.circular, node(26), none, node(28), door(9, 32, 1))
  addNode(28, Zone.circular, node(27), none, node(29), none)
  addNode(29, Zone.circular, node(28), none, node(30), node(33, 0))

  addNode(30, Zone.circular, node(29), none, node(23), none)
  addNode(31, Zone.circular, node(25, 1), none, node(35), none)
  addNode(32, Zone.metamondst, none, node(52), none, node(27, 1))
  addNode(33, Zone.circular, terminal(14), none, node(29, 1), none)
  addNode(34, Zone.entente, terminal(37), none, none, node(39))
  addNode(35, Zone.stones, door(8, 31, 0), node(38), node(36), none)
  addNode(36, Zone.stones, node(35), node(37), none, none)
  addNode(37, Zone.stones, node(38), node(39), none, node(36))
  addNode(38, Zone.stones, terminal(12), none, node(37), node(35))
  const node39Door = door(11, 45, null, 34)
  addNode(39, Zone.stones, terminal(10), node39Door, node(40), node(37))

  addNode(40, Zone.stones, node(39), none, node(41), none)
  addNode(41, Zone.stones, node(40), none, none, node(42))
  addNode(42, Zone.stones, none, node(41), node(44), node(43))
  addNode(43, Zone.stones, none, node(42), none, terminal(35))
  addNode(44, Zone.stones, node(42), none, node(46), none)
  addNode(45, Zone.rainre, terminal(13), none, terminal(1), node(39))
  addNode(46, Zone.stones, node(44), none, door(15, 85, 2), none)
  addNode(47, Zone.antechannel, none, node(48), node(77), none)
  addNode(48, Zone.antechannel, door(25, 11, 2), none, node(49), node(47))
  addNode(49, Zone.antechannel, node(48), none, terminal(21), node(77))

  addNode(50, Zone.nataniev, door(40, 113), none, terminal(41), none)
  addNode(52, Zone.antechannel, node(54), node(53), none, door(9, 32, 3))
  addNode(53, Zone.antechannel, node(55), node(84), none, node(52))
  addNode(54, Zone.antechannel, node(57), node(55), node(52), none)
  addNode(55, Zone.antechannel, terminal(39), node(56), node(53), node(54))
  addNode(56, Zone.antechannel, node(58), none, node(84), node(55))
  addNode(57, Zone.antechannel, node(59), none, node(54), none)
  addNode(58, Zone.antechannel, node(60), none, node(56), none)
  addNode(59, Zone.antechannel, node(61), none, node(57), none)

  addNode(60, Zone.antechannel, node(62), none, node(56, null, true), none) // Feature, not a bug!
  addNode(61, Zone.antechannel, none, none, node(59), door(19, 72))
  addNode(62, Zone.antechannel, door(26, 77), none, node(60), none)
  addNode(63, Zone.metamondst, node(73), node(69), none, node(67))
  addNode(64, Zone.nataniev, node(63), none, none, none) // TODO: something interesting
  addNode(67, Zone.metamondst, node(74), node(63), none, node(70))
  addNode(69, Zone.metamondst, terminal(18), door(19, 72), none, node(63))

  addNode(70, Zone.metamondst, node(75), node(67), none, none)
  addNode(72, Zone.metamondst, none, node(61), none, node(69))
  addNode(73, Zone.metamondst, node(81), none, node(63), none)
  addNode(74, Zone.metamondst, node(80), none, node(67), none)
  addNode(75, Zone.metamondst, node(76), none, node(70), none)
  addNode(76, Zone.metamondst, none, none, node(75), door(30, 87))
  addNode(77, Zone.antechannel, node(47), node(49), door(26, 62), terminal(27))
  addNode(78, Zone.metamondst, node(83), none, none, node(81))
  addNode(79, Zone.capsule, none, door(33, 112), node(87), none)

  addNode(80, Zone.metamondst, node(85), none, node(74), none)
  addNode(81, Zone.metamondst, node(82), node(78), node(73), none)
  addNode(82, Zone.metamondst, none, node(83), node(81), terminal(20))
  addNode(83, Zone.metamondst, none, none, node(78), node(82))
  addNode(84, Zone.antechannel, node(56), none, terminal(47), node(53))
  addNode(85, Zone.metamondst, door(15, 46, 0), none, node(80), node(86))
  addNode(86, Zone.metamondst, none, node(85), none, terminal(1))
  addNode(87, Zone.capsule, node(79), door(30, 76), none, node(88))
  addNode(88, Zone.capsule, none, node(87), none, node(141))

  const node89Maze = maze(node(103), 42, MazeAxis.x, MazeEffect.decr, 1)
  addNode(89, Zone.entente, node89Maze, none, node(90), none)
  addNode(90, Zone.entente, node(89), none, node(91), none)
  const node91Maze = maze(node(103), 42, MazeAxis.x, MazeEffect.incr, 3, 92)
  addNode(91, Zone.entente, node(90), terminal(23), node91Maze, none)
  addNode(103, Zone.entente, node(91), none, node(89), none)

  addNode(92, Zone.entente, node(91), none, node(93), none)
  addNode(93, Zone.entente, node(92), none, node(94), none)
  addNode(94, Zone.entente, node(93), none, node(95), none)
  addNode(95, Zone.entente, node(94), terminal(24), node(96), none)
  addNode(96, Zone.entente, node(95), none, node(97), none)
  addNode(97, Zone.entente, node(96), none, node(98), none)
  addNode(98, Zone.entente, node(97), node(99), node(65), node(101))
  const node65Maze = maze(node(93), 42, MazeAxis.y, MazeEffect.exit, 0, 107, 3)
  addNode(65, Zone.entente, node(98), none, node65Maze, none)
  addNode(99, Zone.entente, none, node(100), none, node(98))
  const node100Maze = maze(node(95, 2), 42, MazeAxis.y, MazeEffect.decr, 1)
  addNode(100, Zone.entente, none, node100Maze, none, node(99))
  addNode(101, Zone.entente, none, node(98), terminal(38), node(102))
  const node102Maze = maze(node(95, 2), 42, MazeAxis.y, MazeEffect.incr, 4)
  addNode(102, Zone.entente, none, node(101), none, node102Maze)

  addNode(104, Zone.entente, none, node(107), none, node(105))
  addNode(105, Zone.entente, none, node(104), none, node(106))
  addNode(106, Zone.entente, none, node(105), none, node(107))
  addNode(107, Zone.entente, none, node(106), none, node(108))
  addNode(108, Zone.entente, none, node(107), none, node(109))
  addNode(109, Zone.entente, none, node(108), terminal(43), node(110))
  addNode(110, Zone.entente, none, node(109), none, node(111))
  addNode(111, Zone.entente, none, node(110), none, node(1, 0))

  addNode(112, Zone.nataniev, node(115), node(113), none, door(33, 79))
  addNode(113, Zone.nataniev, node(114), terminal(36), door(40, 50), node(112))
  addNode(114, Zone.nataniev, none, none, node(113), node(115))
  addNode(115, Zone.nataniev, none, node(114), node(112), none)
  addNode(116, Zone.entente, none, none, none, node(20, 2))

  addNode(141, Zone.entente, none, node(88), none, node(142))
  addNode(142, Zone.entente, none, node(141), none, door(54, 143, 3))
  addNode(143, Zone.nataniev, none, door(54, 142, 1), none, none)
  return Object.freeze(nodesByID)
})()

const puzzlesByID = (function () {
  const puzzlesByID = new Map()

  const addPuzzle = puzzle => {
    puzzlesByID.set(puzzle.id, Object.freeze(puzzle))
  }

  const lock = (chapter, seals) => {
    return Object.freeze({ chapter, seals })
  }

  const ententeMazeGoal = Object.freeze(
    new Map([[MazeAxis.x, 2], [MazeAxis.y, 17]])
  )

  const act2Lock = lock(Chapter.act2, [Zone.forest, Zone.rainre])
  const act3Lock = lock(Chapter.act3, [Zone.metamondst, Zone.rainre])
  const act4Lock = lock(Chapter.act4, [Zone.rainre, Zone.antechannel])

  addPuzzle(new ClockTerminal(1))
  addPuzzle(new EnergyTerminal(2))
  addPuzzle(new EnergyDoor(3, [2]))
  addPuzzle(new SealTerminal(4, Zone.forest))
  addPuzzle(new StudioTerminal(5))
  addPuzzle(new SecretDoor(6))
  addPuzzle(new ClockDoor(7, 0))
  addPuzzle(new ClockDoor(8, 2))
  addPuzzle(new ClockDoor(9, 1))
  addPuzzle(new EnergyTerminal(10))
  addPuzzle(new SecretEnergyDoor(11, [10], [31]))
  addPuzzle(new SealTerminal(12, Zone.stones))
  addPuzzle(new SealTerminal(13, Zone.rainre))
  addPuzzle(new KillTerminal(14, 50))
  addPuzzle(new SealDoor(15, [act2Lock, act4Lock], 1))
  addPuzzle(new ProgressTerminal(16))
  // We removed puzzle 17 (the illusion puzzle)
  addPuzzle(new EnergyTerminal(18))
  addPuzzle(new EnergyDoor(19, [18]))
  addPuzzle(new SealTerminal(20, Zone.metamondst))
  addPuzzle(new SealTerminal(21, Zone.antechannel))
  addPuzzle(new EntenteTerminal(23, MazeAxis.x, ententeMazeGoal))
  addPuzzle(new EntenteTerminal(24, MazeAxis.y, ententeMazeGoal))
  addPuzzle(new SealDoor(25, [act3Lock], 1))
  addPuzzle(new EnergyDoor(26, [27]))
  addPuzzle(new EnergyTerminal(27))
  addPuzzle(new StudioDoor(28, 1))
  addPuzzle(new StudioDoor(30))
  addPuzzle(new EnergyTerminal(31, 1))
  addPuzzle(new EnergyDoor(33, [47]))
  addPuzzle(new AudioTerminal(34, 1))
  addPuzzle(new AudioTerminal(35, 1))
  addPuzzle(new EnergyTerminal(36))
  addPuzzle(new SecretTerminal(37))
  addPuzzle(new EnergyTerminal(38, 1)) // Entente Fuse
  addPuzzle(new EnergyTerminal(39, 1))
  addPuzzle(new EndgameDoor(40, [36, 47]))
  addPuzzle(new EndgameCredit(41))
  addPuzzle(new EntenteDoor(42, ententeMazeGoal))
  addPuzzle(new EntenteProgressTerminal(43))
  addPuzzle(new EnergyTerminal(47)) // Spare Fuse
  addPuzzle(new TimeDoor(54, 15, 7))

  return Object.freeze(puzzlesByID)
})()

const createDefaultState = function () {
  const state = {
    seals: new Set(),
    fuses: new Set(),
    clock: 0,
    audio: true,
    studio: false,
    secret: false,
    timeDoor: false
  }
  for (const puzzle of puzzlesByID.values()) {
    if (puzzle instanceof EnergyTerminal && puzzle.filledOnNewGame) {
      state.fuses.add(puzzle.id)
    }
  }
  return state
}
