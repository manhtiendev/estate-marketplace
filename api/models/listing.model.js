import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A listing must have a name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A listing must have a description'],
    },
    address: {
      type: String,
      required: [true, 'A listing must have an address'],
      trim: true,
    },
    regularPrice: {
      type: Number,
      required: [true, 'A listing must have a price'],
      min: [1, 'Listing price must be greater or equal then 1'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Listing discount price must be greater or equal then 1'],
      default: 0,
      validate: {
        validator: function (val) {
          return val <= this.regularPrice;
        },
        message: 'Discount price ({VALUE}) should be below or equal regular price',
      },
    },
    bathrooms: {
      type: Number,
      required: [true, 'A listing must have a number of bathrooms'],
      min: [1, 'A listing must have at least 1 bathroom'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'A listing must have a number of bedrooms'],
      min: [1, 'A listing must have at least 1 bedroom'],
    },
    furnished: {
      type: Boolean,
      required: [true, 'A listing must be furnished'],
    },
    parking: {
      type: Boolean,
      required: [true, 'A listing must have parking'],
    },
    type: {
      type: String,
      required: [true, 'A listing must have a type'],
    },
    offer: {
      type: Boolean,
      required: [true, 'A listing must have an offer'],
    },
    imageUrls: {
      type: Array,
      required: [true, 'A listing must have at least one image'],
    },
    userRef: {
      type: String,
      required: [true, 'A listing must belong to a user'],
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
