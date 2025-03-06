import mongoose from 'mongoose';

export enum ItemCountry {
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
  Israel = 'Israel',
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


itemSchema.pre('save', function (next) {
  const doc = this;
  if (!doc.itemNumber) {
    mongoose
      .model('Item')
      .countDocuments()
      .then((count) => {
        doc.itemNumber = count + 1;
        next();
      })
      .catch((error) => {
        next(new Error(`Failed to generate itemNumber: ${error.message}`));
      });
  } else {
    next();
  }
});

const Item = mongoose.model('Item', itemSchema);
export default Item;
