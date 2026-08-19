const mongoose = require('mongoose');
const Product = require('./product.models.js');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, 'Please provide a review title'],
      maxlength: [100, 'Review title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
    images: [{ public_id: String, url: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Recalculate product ratings after save/remove
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratings: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, { ratings: 0, numReviews: 0 });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.product);
});

reviewSchema.post('remove', function () {
  this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);