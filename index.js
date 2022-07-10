const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks
app.get('/tasks', async (req, res) => {
  try {
    const taskList = await tasks.findAll({})
    res.status(200).json({ action: 'Listing task', taskList })
  } catch (error) {
    res.status(500).json({ error: error + ". Ups! Something wrong..." })
  }
})

// Create task
app.post('/tasks', async (req, res, next) => {
  const { description, done } = req.body
  const newTask = {
    description,
    done
  }
  try {
    await tasks.create(newTask)

    res.status(201).json({ action: 'Adding new task', newTask })
  } catch (error) {
    res.status(500).json({ error: error + ". Ups! Something wrong..." })
  }
})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  try {
    const infoTask = await tasks.findOne({ where: { id: taskId } })

    if (!infoTask) {
      res.status(422).json({ message: 'This task does not exists!' })
      return
    }

    res.status(200).send({
      action: 'Showing task',
      infoTask
    })
  } catch (error) {
    res.status(500).json({ error: error + ". Ups! Something wrong..." })
  }
})

// Update task --------------------------- FALTA ESTO NADA MAS (UPDATE) ------------------------
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const { description, done } = req.body
  const task = {
    description,
    done
  }
  try {
    const updatedTask = await tasks.update(req.body, { where: { id: taskId }})
    //Esta listo.puedes testar ela alteracion

    if(updatedTask.matchedCount === 0) {
      res.status(422).json({ message: 'This task does not exists!' })
      return
    }

    res.status(200).send({
      action: 'Updating task',
      updatedTask
    })
  } catch (error) {
    res.status(500).json({ error: error + ". Ups! Something wrong..." })
  }
  res.send({ action: 'Updating task', taskId: taskId })
})

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  try {
    const taskToDelete = await tasks.destroy({ where: { id: taskId } })

    if (!taskToDelete) {
      res.status(422).json({ message: 'This task does not exists!' })
      return
    }

    res.status(200).send({
      action: 'Deleting task',
      deletedTaskId: taskId
    })
  } catch (error) {
    res.status(500).json({ error: error + ". Ups! Something wrong..." })
  }
})

app.listen(3000, () => {
  console.log('Iniciado o ExpressJS na porta 3000')
})
