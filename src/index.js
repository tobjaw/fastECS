const Entity = ({ id, components = {} }) => ({
  id,
  components,
})

const Component = (id) => (value) => ({ [id]: value })

const System = ({ entities = [], selector = () => true, run = () => {} }) => {
  entities = entities.filter(selector)
  return {
    run: () => run(entities),
  }
}

export { Entity, Component, System }
