import { Entity, Component, System } from '..'
import './style.css'

const entities = []
const systems = []

const PositionComponent = Component('Position')

const Ball1 = Entity({
  id: 'Ball1',
  components: {
    ...PositionComponent({ x: 300, y: 300 }),
  },
})
entities.push(Ball1)

const RenderSystem = System({
  entities,
  selector: (entity) => entity.components.Position != null,
  run: (entities) => {
    entities.map((entity) => {
      const { x, y } = entity.components.Position
      console.log(`${entity.id} is at ${x},${y}.`)
    })
  },
})
systems.push(RenderSystem)

systems.map((system) => system.run())
