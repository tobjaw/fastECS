import { Entity, Component, System } from '..'
import './style.css'

const WIDTH = 600
const HEIGHT = 480
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const entities = []
const systems = []

const PositionComponent = Component('Position')
const SizeComponent = Component('Size')
const ColorComponent = Component('Color')
const VelocityComponent = Component('Velocity')
const MassComponent = Component('Mass')
const AccelerationComponent = Component('Acceleration')

const Ball1 = Entity({
  id: 'Ball1',
  components: {
    ...AccelerationComponent({ x: 0, y: 0 }),
    ...PositionComponent({ x: 300, y: 300 }),
    ...VelocityComponent({ x: 5.2, y: -4.0 }),
    ...SizeComponent(30),
    ...ColorComponent('#CC9393'),
    ...MassComponent(1 / 15),
  },
})

const Ball2 = Entity({
  id: 'Ball2',
  components: {
    ...AccelerationComponent({ x: 0, y: 0 }),
    ...PositionComponent({ x: 200, y: 100 }),
    ...VelocityComponent({ x: -3.2, y: 3.0 }),
    ...SizeComponent(25),
    ...ColorComponent('#8FB28F'),
    ...MassComponent(1 / 15),
  },
})

const Ball3 = Entity({
  id: 'Ball3',
  components: {
    ...AccelerationComponent({ x: 0, y: 0 }),
    ...PositionComponent({ x: 250, y: 150 }),
    ...VelocityComponent({ x: 0, y: 0 }),
    ...SizeComponent(30),
    ...ColorComponent('#CCCCCC'),
    ...MassComponent(1 / 15),
  },
})

entities.push(Ball1, Ball2, Ball3)

const rand = (min, max) => Math.random() * (max - min) + min
const randColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16)
// https://www.paulirish.com/2009/random-hex-color-code-snippets/

for (let i = 4; i < 100; i++) {
  entities.push(
    Entity({
      id: `Ball${i}`,
      components: {
        ...AccelerationComponent({ x: 0, y: 0 }),
        ...PositionComponent({
          x: rand(50, WIDTH - 50),
          y: rand(50, HEIGHT - 50),
        }),
        ...VelocityComponent({ x: rand(-50, 50), y: rand(-10, 10) }),
        ...SizeComponent(rand(5, 50)),
        ...ColorComponent(randColor()),
        ...MassComponent(1 / rand(100, 1)),
      },
    }),
  )
}

const RenderSystem = System({
  entities,
  selector: (entity) =>
    entity.components.Position != null &&
    entity.components.Size != null &&
    entity.components.Color != null,
  run: (entities) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    entities.map((entity) => {
      const { x, y } = entity.components.Position
      const size = entity.components.Size
      ctx.fillStyle = entity.components.Color
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fill()
    })
  },
})

const MovementSystem = System({
  entities,
  selector: (entity) =>
    entity.components.Position != null &&
    entity.components.Velocity != null &&
    entity.components.Mass == null,
  run: (entities) => {
    entities.map((entity) => {
      const { Position, Velocity } = entity.components

      entity.components.Position = {
        x: Position.x + Velocity.x,
        y: Position.y + Velocity.y,
      }
    })
  },
})

const CollisionSystem = System({
  entities,
  selector: (entity) =>
    entity.components.Position != null && entity.components.Velocity != null,
  run: (entities) => {
    entities.map((entity) => {
      const { Position, Velocity, Size } = entity.components

      if (Position.x - Size / 2 < 0) {
        entity.components.Velocity.x = -1 * Velocity.x
        entity.components.Position.x = Size / 2
      } else if (Position.x + Size / 2 > WIDTH) {
        entity.components.Velocity.x = -1 * Velocity.x
        entity.components.Position.x = WIDTH - Size / 2
      }
      if (Position.y - Size / 2 < 0) {
        entity.components.Velocity.y = -1 * Velocity.y
        entity.components.Position.y = Size / 2
      } else if (Position.y + Size / 2 > HEIGHT) {
        entity.components.Velocity.y = -1 * Velocity.y
        entity.components.Position.y = HEIGHT - Size / 2
      }
    })
  },
})

const GRAVITY = 9.81
const DAMPING = 0.999
const PhysicsSystem = System({
  entities,
  selector: (entity) =>
    entity.components.Acceleration != null &&
    entity.components.Position != null &&
    entity.components.Velocity != null &&
    entity.components.Size != null &&
    entity.components.Mass != null,
  run: (entities) => {
    entities.map((entity) => {
      const { Position, Velocity, Mass, Size } = entity.components

      entity.components.Acceleration.x = 0
      entity.components.Acceleration.y = GRAVITY * Mass

      entity.components.Velocity.x =
        (Velocity.x + entity.components.Acceleration.x) * DAMPING
      entity.components.Velocity.y =
        (Velocity.y + entity.components.Acceleration.y) * DAMPING

      entity.components.Position.x = Position.x + entity.components.Velocity.x
      entity.components.Position.y = Position.y + entity.components.Velocity.y
    })
  },
})

systems.push(PhysicsSystem, MovementSystem, CollisionSystem, RenderSystem)

const main = () => {
  systems.map((system) => system.run())
  requestAnimationFrame(main)
}
main()
