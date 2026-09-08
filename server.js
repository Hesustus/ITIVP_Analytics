const express = require('express'); 
const app = express();

app.use(express.json());

let events = [
    { id: 1, eventType: "page_view", url: "/home", userId: "user_123" },
    { id: 2, eventType: "click", url: "/products", userId: "user_456" }
];

let nextId = 3;


app.get('/events', (req, res) => {
    res.json(events);
});


app.get('/events/:id', (req, res, next) => { 
    try {
        const id = parseInt(req.params.id);
        const event = events.find(e => e.id === id);
        
        if (!event) {
            return res.status(404).json({ error: 'Событие не найдено' });
        }
        
        res.json(event);
    } catch (err) {
        next(err);
    }
});


app.post('/events', (req, res) => {
    const { eventType, url, userId } = req.body;
    
    if (!eventType || !url || !userId) {
        return res.status(400).json({ error: 'Необходимо указать eventType, url и userId' });
    }
    
    const newEvent = {
        id: nextId++,
        eventType,
        url,
        userId
    };
    
    events.push(newEvent);
    res.status(201).json(newEvent);
});


app.put('/events/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { eventType, url, userId } = req.body;
    const eventIndex = events.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
        return res.status(404).json({ error: 'Событие не найдено' });
    }
    
    if (!eventType || !url || !userId) {
        return res.status(400).json({ error: 'Необходимо указать eventType, url и userId' });
    }
    
    events[eventIndex] = { id, eventType, url, userId };
    res.json(events[eventIndex]);
});


app.delete('/events/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
        return res.status(404).json({ error: 'Событие не найдено' });
    }
    
    events.splice(eventIndex, 1);
    res.status(204).send();
});


app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});


app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});



const port = 5500;
app.listen(port, () => console.log('Server running...'));