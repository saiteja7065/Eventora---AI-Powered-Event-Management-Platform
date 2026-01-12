import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Events Controller
 * Handles CRUD operations for events
 */

/**
 * POST /api/events/upload-image
 * Upload event image
 */
export async function uploadEventImage(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Construct the URL for the uploaded image
        const imageUrl = `/uploads/events/${req.file.filename}`;

        console.log(`✅ Image uploaded: ${req.file.filename}`);

        res.status(200).json({
            success: true,
            data: {
                url: imageUrl,
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });

    } catch (error: any) {
        console.error('❌ Error uploading image:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload image'
        });
    }
}

/**
 * POST /api/events
 * Create a new event
 */
export async function createEvent(req: Request, res: Response) {
    try {
        const userId = (req as any).userId; // From auth middleware

        const {
            title,
            description,
            categories,
            coverImage,
            locationType,
            address,
            city,
            country,
            coordinates,
            virtualLink,
            startTime,
            endTime,
            timezone,
            capacity,
            ticketPrice
        } = req.body;

        // Validation
        if (!title || !description || !city || !country || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: title, description, city, country, startTime, endTime'
            });
        }

        // Create event
        const event = await prisma.event.create({
            data: {
                title,
                description,
                categories: categories || [],
                coverImage: coverImage || { url: '', alt: '' },
                locationType: locationType || 'physical',
                address,
                city,
                country,
                coordinates,
                virtualLink,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                timezone: timezone || 'UTC',
                capacity: capacity ? parseInt(capacity) : null,
                ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
                creatorId: userId,
                status: 'DRAFT'
            }
        });

        console.log(`✅ Event created: ${event.id} - "${event.title}"`);

        res.status(201).json({
            success: true,
            data: event
        });

    } catch (error: any) {
        console.error('❌ Error creating event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create event'
        });
    }
}

/**
 * GET /api/events
 * Get all events with pagination and filtering
 */
export async function getEvents(req: Request, res: Response) {
    try {
        const { page = '1', limit = '10', status, city, category } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const where: any = {};
        if (status) where.status = status;
        if (city) where.city = city;
        if (category) where.categories = { has: category };

        // Get events and total count in parallel
        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { startTime: 'asc' },
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true
                        }
                    }
                }
            }),
            prisma.event.count({ where })
        ]);

        res.json({
            success: true,
            data: events,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });

    } catch (error: any) {
        console.error('❌ Error fetching events:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch events'
        });
    }
}

/**
 * GET /api/events/:id
 * Get a single event by ID
 */
export async function getEventById(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });

    } catch (error: any) {
        console.error('❌ Error fetching event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch event'
        });
    }
}

/**
 * PATCH /api/events/:id
 * Update an event
 */
export async function updateEvent(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        // Check if event exists and user is the creator
        const existingEvent = await prisma.event.findUnique({
            where: { id }
        });

        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        if (existingEvent.creatorId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You are not authorized to update this event'
            });
        }

        // Update event
        const updatedEvent = await prisma.event.update({
            where: { id },
            data: req.body
        });

        console.log(`✅ Event updated: ${id}`);

        res.json({
            success: true,
            data: updatedEvent
        });

    } catch (error: any) {
        console.error('❌ Error updating event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update event'
        });
    }
}

/**
 * DELETE /api/events/:id
 * Delete an event
 */
export async function deleteEvent(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        // Check if event exists and user is the creator
        const existingEvent = await prisma.event.findUnique({
            where: { id }
        });

        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        if (existingEvent.creatorId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You are not authorized to delete this event'
            });
        }

        // Delete event
        await prisma.event.delete({
            where: { id }
        });

        console.log(`✅ Event deleted: ${id}`);

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error: any) {
        console.error('❌ Error deleting event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete event'
        });
    }
}
