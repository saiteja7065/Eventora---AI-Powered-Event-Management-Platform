import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create or update user preferences
 * POST /api/user/preferences
 */
export async function createOrUpdatePreferences(req: Request, res: Response) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const { interests, location, notificationSettings, privacySettings } = req.body;

        // Validation
        if (!interests || !Array.isArray(interests) || interests.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one interest is required'
            });
        }

        // Upsert (create or update) preferences
        const preferences = await prisma.userPreferences.upsert({
            where: { userId },
            update: {
                interests,
                location,
                notificationSettings,
                privacySettings,
                updatedAt: new Date()
            },
            create: {
                userId,
                interests,
                location,
                notificationSettings,
                privacySettings
            }
        });

        console.log(`✅ User preferences saved for user: ${userId}`);

        res.status(200).json({
            success: true,
            data: preferences
        });

    } catch (error: any) {
        console.error('❌ Error saving user preferences:', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'development'
                ? error.message
                : 'Failed to save preferences'
        });
    }
}

/**
 * Get current user's preferences
 * GET /api/user/preferences
 */
export async function getUserPreferences(req: Request, res: Response) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const preferences = await prisma.userPreferences.findUnique({
            where: { userId }
        });

        res.status(200).json({
            success: true,
            data: preferences
        });

    } catch (error: any) {
        console.error('❌ Error fetching user preferences:', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'development'
                ? error.message
                : 'Failed to fetch preferences'
        });
    }
}

/**
 * Delete user preferences
 * DELETE /api/user/preferences
 */
export async function deleteUserPreferences(req: Request, res: Response) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        await prisma.userPreferences.delete({
            where: { userId }
        });

        console.log(`✅ User preferences deleted for user: ${userId}`);

        res.status(200).json({
            success: true,
            message: 'Preferences deleted successfully'
        });

    } catch (error: any) {
        console.error('❌ Error deleting user preferences:', error);
        res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === 'development'
                ? error.message
                : 'Failed to delete preferences'
        });
    }
}
