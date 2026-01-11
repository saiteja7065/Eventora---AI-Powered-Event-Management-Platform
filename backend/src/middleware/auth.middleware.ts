import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

/**
 * Authentication Middleware
 * Verifies Supabase JWT tokens and adds userId to request
 */

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // Use service key for backend
);

const prisma = new PrismaClient();

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No authorization token provided'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        // Sync user to database if they don't exist
        try {
            const existingUser = await prisma.user.findUnique({
                where: { id: user.id }
            });

            if (!existingUser) {
                // Create user in database
                await prisma.user.create({
                    data: {
                        id: user.id,
                        email: user.email!,
                        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User'
                    }
                });
                console.log(`✅ Created user in database: ${user.email}`);
            }
        } catch (dbError: any) {
            console.error('⚠️ Error syncing user to database:', dbError);
            // Continue even if user sync fails
        }

        // Add userId to request object
        (req as any).userId = user.id;
        (req as any).user = user;

        next();

    } catch (error: any) {
        console.error('❌ Auth middleware error:', error);
        res.status(401).json({
            success: false,
            error: 'Authentication failed'
        });
    }
}

/**
 * Optional authentication middleware
 * Adds user info if token is valid, but doesn't block request
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const { data: { user } } = await supabase.auth.getUser(token);

            if (user) {
                (req as any).userId = user.id;
                (req as any).user = user;
            }
        }

        next();

    } catch (error) {
        // Continue without authentication
        next();
    }
}
