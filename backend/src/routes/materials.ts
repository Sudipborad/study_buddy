import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Material, IMaterial } from '../models/Material';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all materials for the authenticated user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const materials = await Material.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: {
        materials: materials.map(material => ({
          id: material._id,
          title: material.title,
          summary: material.summary,
          flashcards: material.flashcards,
          sourceDocument: material.sourceDocument,
          createdAt: new Date(material.createdAt).toLocaleDateString()
        }))
      }
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching materials'
    });
  }
});

// Get a specific material by ID
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const material = await Material.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!material) {
      res.status(404).json({
        success: false,
        message: 'Material not found'
      });
      return;
    }

    res.json({
      success: true,
      data: {
        material: {
          id: material._id,
          title: material.title,
          summary: material.summary,
          flashcards: material.flashcards,
          sourceDocument: material.sourceDocument,
          createdAt: material.createdAt.toLocaleDateString()
        }
      }
    });
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching material'
    });
  }
});

// Create a new material
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('summary').trim().isLength({ min: 1 }),
  body('flashcards').isArray().optional(),
  body('sourceDocument').optional().isString()
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

    const { title, summary, flashcards = [], sourceDocument } = req.body;

    const material = new Material({
      title,
      summary,
      flashcards,
      sourceDocument,
      userId: req.user._id
    });

    await material.save();

    res.status(201).json({
      success: true,
      message: 'Material created successfully',
      data: {
        materialId: material._id,
        material: {
          id: material._id,
          title: material.title,
          summary: material.summary,
          flashcards: material.flashcards,
          sourceDocument: material.sourceDocument,
          createdAt: material.createdAt.toLocaleDateString()
        }
      }
    });
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating material'
    });
  }
});

// Update a material
router.put('/:id', [
  body('title').trim().isLength({ min: 1, max: 200 }).optional(),
  body('summary').trim().isLength({ min: 1 }).optional(),
  body('flashcards').isArray().optional(),
  body('sourceDocument').optional().isString()
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

    const material = await Material.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!material) {
      res.status(404).json({
        success: false,
        message: 'Material not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Material updated successfully',
      data: {
        material: {
          id: material._id,
          title: material.title,
          summary: material.summary,
          flashcards: material.flashcards,
          sourceDocument: material.sourceDocument,
          createdAt: material.createdAt.toLocaleDateString()
        }
      }
    });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating material'
    });
  }
});

// Delete a material
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const material = await Material.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!material) {
      res.status(404).json({
        success: false,
        message: 'Material not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting material'
    });
  }
});

export default router;