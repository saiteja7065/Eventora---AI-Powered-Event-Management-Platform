import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRoutes from './routes/ai.routes';
import eventsRoutes from './routes/events.routes';

// ES module alternative to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env (works from any directory)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increased for AI-generated images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
import fs from 'fs';
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
}
app.use('/uploads', express.static(uploadsDir));

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Eventora API is running' });
});

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/events', eventsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Eventora API Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
    console.log('');
    console.log('📋 Available endpoints:');
    console.log('   GET  /health');
    console.log('   POST /api/ai/generate-event');
    console.log('   POST /api/ai/generate-banner');
    console.log('   GET  /api/events');
    console.log('   POST /api/events');
    console.log('');
});
