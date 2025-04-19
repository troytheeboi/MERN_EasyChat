import express from 'express';
import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    connectDB();
    console.log('Server is running on port 3000');
});