import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Update user profile
router.put('/profile', [
  body('name').trim().isLength({ min: 1, max: 50 }).optional(),
  body('avatar').isURL().optional()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const updates: any = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.avatar) updates.avatar = req.body.avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// Delete user account
router.delete('/account', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // TODO: Also delete related materials and quizzes
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting account'
    });
  }
});

export default router;