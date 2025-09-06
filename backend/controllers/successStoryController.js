const SuccessStory = require('../models/SuccessStory');

// @desc    Submit a new success story
// @route   POST /api/success-stories
// @access  Public
exports.submitSuccessStory = async (req, res) => {
  try {
    const {
      name,
      location,
      crop,
      yieldIncrease,
      profitIncrease,
      timeSaved,
      testimonial,
      productsUsed
    } = req.body;

    const successStory = new SuccessStory({
      name,
      location,
      crop,
      yieldIncrease: Number(yieldIncrease),
      profitIncrease: Number(profitIncrease),
      timeSaved: Number(timeSaved),
      testimonial,
      productsUsed
    });

    const savedStory = await successStory.save();

    res.status(201).json({
      success: true,
      message: 'Success story submitted successfully! It will be reviewed by our team.',
      data: savedStory
    });
  } catch (error) {
    console.error('Error submitting success story:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting success story',
      error: error.message
    });
  }
};

// @desc    Get all approved success stories
// @route   GET /api/success-stories
// @access  Public
exports.getApprovedStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ isApproved: true })
      .sort({ approvedAt: -1 })
      .limit(6); // Limit to 6 stories for display

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    console.error('Error fetching approved stories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching success stories',
      error: error.message
    });
  }
};

// @desc    Get all success stories (admin only)
// @route   GET /api/success-stories/admin
// @access  Private/Admin
exports.getAllStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories
    });
  } catch (error) {
    console.error('Error fetching all stories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching success stories',
      error: error.message
    });
  }
};

// @desc    Approve a success story (admin only)
// @route   PUT /api/success-stories/:id/approve
// @access  Private/Admin
exports.approveStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Success story not found'
      });
    }

    story.isApproved = true;
    story.approvedAt = new Date();
    story.approvedBy = req.user._id;

    const updatedStory = await story.save();

    res.status(200).json({
      success: true,
      message: 'Success story approved successfully',
      data: updatedStory
    });
  } catch (error) {
    console.error('Error approving story:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving success story',
      error: error.message
    });
  }
};

// @desc    Reject a success story (admin only)
// @route   PUT /api/success-stories/:id/reject
// @access  Private/Admin
exports.rejectStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Success story not found'
      });
    }

    story.isApproved = false;
    story.approvedAt = null;
    story.approvedBy = null;

    const updatedStory = await story.save();

    res.status(200).json({
      success: true,
      message: 'Success story rejected successfully',
      data: updatedStory
    });
  } catch (error) {
    console.error('Error rejecting story:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting success story',
      error: error.message
    });
  }
};

// @desc    Delete a success story (admin only)
// @route   DELETE /api/success-stories/:id
// @access  Private/Admin
exports.deleteStory = async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Success story not found'
      });
    }

    await SuccessStory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Success story deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting success story',
      error: error.message
    });
  }
}; 