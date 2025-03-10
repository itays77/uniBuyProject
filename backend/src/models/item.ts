import mongoose from 'mongoose';

export enum ItemCountry {
  Israel = 'Israel',
  England = 'England',
  Spain = 'Spain',
  Germany = 'Germany',
  Italy = 'Italy',
  Brazil = 'Brazil',
  Argentina = 'Argentina',
  France = 'France',
  Portugal = 'Portugal',
  Netherlands = 'Netherlands',
  Belgium = 'Belgium',
}

export enum KitType {
  Home = 'Home',
  Away = 'Away',
  Third = 'Third',
}

const itemSchema = new mongoose.Schema({
  itemNumber: {
    type: Number,
    unique: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  country: {
    type: String,
    required: true,
    enum: Object.values(ItemCountry),
  },
  kitType: {
    type: String,
    required: true,
    enum: Object.values(KitType),
  },
  season: { type: String, required: true },
});


itemSchema.pre('save', async function (next) {
  const doc = this;
  if (!doc.itemNumber) {
    try {
      // Find the highest existing item number
      const highestItem = await mongoose
        .model('Item')
        .findOne({})
        .sort({ itemNumber: -1 });

      doc.itemNumber = highestItem ? highestItem.itemNumber + 1 : 1;
      next();
    } catch (error) {
      next(error instanceof Error ? error : new Error(String(error)));
    }
  } else {
    next();
  }
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
