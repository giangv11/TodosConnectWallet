const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const { protect, authorize } = require('../middleware/auth');
router.get('/', async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort('name');

    res.json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    next(error);
  }
});
router.get('/:id', async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand || !brand.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/brands
// @desc    Create new brand
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    
    res.status(201).json({
      success: true,
      data: brand
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/brands/:id
// @desc    Update brand
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/brands/:id
// @desc    Delete brand
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    await brand.deleteOne();

    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
