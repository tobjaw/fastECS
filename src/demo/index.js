import { Entity, Component, System } from '..'
import './style.css'

const WIDTH = 600
const HEIGHT = 480
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

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
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    entities.map((entity) => {
      const { x, y } = entity.components.Position
      const size = 20
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fill()
    })
  },
})

systems.push(RenderSystem)

const main = () => {
  systems.map((system) => system.run())
  requestAnimationFrame(main)
}
main()
