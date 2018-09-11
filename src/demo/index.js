import { Entity, Component, System } from '..'
import './style.css'

const entities = []
const systems = []

systems.map((system) => system.run())
