import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/events/:id/register
 * Register for an event (RSVP)
 */
export async function registerForEvent(req: Request, res: Response) {
    try {
        const { id: eventId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Check if event exists and is published
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                _count: {
                    select: { registrations: { where: { status: 'CONFIRMED' } } }
                }
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        if (event.status !== 'PUBLISHED') {
            return res.status(400).json({
                success: false,
                error: 'Event is not published'
            });
        }

        // Check if user is the organizer
        if (event.creatorId === userId) {
            return res.status(400).json({
                success: false,
                error: 'You cannot register for your own event'
            });
        }

        // Check capacity
        if (event.capacity) {
            const confirmedCount = event._count.registrations;
            if (confirmedCount >= event.capacity) {
                return res.status(400).json({
                    success: false,
                    error: 'Event is full'
                });
            }
        }

        // Check for existing registration
        const existingRegistration = await prisma.registration.findUnique({
            where: {
                eventId_userId: {
                    eventId,
                    userId
                }
            }
        });

        if (existingRegistration) {
            if (existingRegistration.status === 'CONFIRMED') {
                return res.status(400).json({
                    success: false,
                    error: 'You are already registered for this event'
                });
            }
            // If previously cancelled, reactivate
            const updatedRegistration = await prisma.registration.update({
                where: { id: existingRegistration.id },
                data: { status: 'CONFIRMED' }
            });

            console.log(`✅ Reactivated registration for user ${userId} to event ${eventId}`);

            return res.status(200).json({
                success: true,
                data: updatedRegistration,
                message: 'Successfully registered for event'
            });
        }

        // Create new registration
        const registration = await prisma.registration.create({
            data: {
                eventId,
                userId,
                status: 'CONFIRMED'
            }
        });

        console.log(`✅ User ${userId} registered for event ${eventId}`);

        res.status(201).json({
            success: true,
            data: registration,
            message: 'Successfully registered for event'
        });

    } catch (error: any) {
        console.error('❌ Error registering for event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to register for event'
        });
    }
}

/**
 * DELETE /api/events/:id/register
 * Cancel event registration
 */
export async function cancelRegistration(req: Request, res: Response) {
    try {
        const { id: eventId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Find registration
        const registration = await prisma.registration.findUnique({
            where: {
                eventId_userId: {
                    eventId,
                    userId
                }
            }
        });

        if (!registration || registration.status === 'CANCELLED') {
            return res.status(404).json({
                success: false,
                error: 'Registration not found'
            });
        }

        // Update status to cancelled
        await prisma.registration.update({
            where: { id: registration.id },
            data: { status: 'CANCELLED' }
        });

        console.log(`✅ User ${userId} cancelled registration for event ${eventId}`);

        res.status(200).json({
            success: true,
            message: 'Registration cancelled successfully'
        });

    } catch (error: any) {
        console.error('❌ Error cancelling registration:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to cancel registration'
        });
    }
}

/**
 * GET /api/events/:id/attendees
 * Get event attendees (organizer only)
 */
export async function getEventAttendees(req: Request, res: Response) {
    try {
        const { id: eventId } = req.params;
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Check if user is the event organizer
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        if (event.creatorId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Only the event organizer can view attendees'
            });
        }

        // Fetch attendees
        const registrations = await prisma.registration.findMany({
            where: {
                eventId,
                status: 'CONFIRMED'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                registeredAt: 'asc'
            }
        });

        console.log(`✅ Fetched ${registrations.length} attendees for event ${eventId}`);

        res.status(200).json({
            success: true,
            data: registrations
        });

    } catch (error: any) {
        console.error('❌ Error fetching attendees:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch attendees'
        });
    }
}

/**
 * GET /api/events/my-registrations
 * Get user's registered events
 */
export async function getMyRegistrations(req: Request, res: Response) {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Fetch registrations with event details
        const registrations = await prisma.registration.findMany({
            where: {
                userId,
                status: 'CONFIRMED'
            },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        coverImage: true,
                        categories: true,
                        city: true,
                        country: true,
                        address: true,
                        startTime: true,
                        endTime: true,
                        timezone: true,
                        ticketPrice: true,
                        capacity: true,
                        locationType: true,
                        status: true,
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                registeredAt: 'desc'
            }
        });

        // Filter out any registrations where event might be null
        const validRegistrations = registrations.filter(reg => {
            if (!reg.event) {
                console.warn(`⚠️ Registration ${reg.id} has no event (orphaned)`);
                return false;
            }
            return true;
        });

        console.log(`✅ Fetched ${validRegistrations.length} valid registrations for user ${userId}`);

        res.status(200).json({
            success: true,
            data: validRegistrations
        });

    } catch (error: any) {
        console.error('❌ Error fetching registrations:', error);
        console.error('Error details:', error.message, error.stack);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch registrations'
        });
    }
}

/**
 * GET /api/events/:id/registration-status
 * Check if user is registered for an event
 */
export async function getRegistrationStatus(req: Request, res: Response) {
    try {
        const { id: eventId } = req.params;
        const userId = (req as any).user?.id;

        // Get event with registration count
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: {
                _count: {
                    select: { registrations: { where: { status: 'CONFIRMED' } } }
                }
            }
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        const confirmedCount = event._count.registrations;
        const isFull = event.capacity ? confirmedCount >= event.capacity : false;

        let userRegistration = null;
        if (userId) {
            userRegistration = await prisma.registration.findUnique({
                where: {
                    eventId_userId: {
                        eventId,
                        userId
                    }
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                isRegistered: userRegistration?.status === 'CONFIRMED',
                isFull,
                confirmedCount,
                capacity: event.capacity,
                availableSpots: event.capacity ? event.capacity - confirmedCount : null
            }
        });

    } catch (error: any) {
        console.error('❌ Error fetching registration status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch registration status'
        });
    }
}
