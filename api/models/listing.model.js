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
      min: [0.01, 'Listing price must be greater or equal then 0.01'],
    },
    discountPrice: {
      type: Number,
      required: [true, 'A listing must have a discount price'],
      min: [0.01, 'Listing discount price must be greater or equal then 0.01'],
      validate: {
        validator: function (val) {
          return val <= this.regularPrice;
        },
        message: 'Discount price ({VALUE}) should be below or equal regular price',
      },
    },
    bathRooms: {
      type: Number,
      required: [true, 'A listing must have a number of bathrooms'],
      min: [1, 'A listing must have at least 1 bathroom'],
    },
    bedRooms: {
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
