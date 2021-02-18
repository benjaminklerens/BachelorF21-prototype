const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

// Redirect from root to RoomID(UUID)
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

// Upon entering room, render room with UUID
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

// On socket connect
io.on('connection', socket => {
    // When user joins a room - then broadcast to other users they can connect with each other
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnect')
        })
    })
})

const port = process.env.PORT || 80;
server.listen(port) 