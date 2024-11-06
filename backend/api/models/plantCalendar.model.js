import mongoose from 'mongoose'
const cropSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  timeOfPlanting: { type: String, required: true },
  plantPopulation: { type: String, required: true },
  maturity: { type: String, required: true },
  volumeOfProduction: { type: String, required: true },
  distanceOfPlanting: {
    hill: { type: Number, required: true },
    rows: { type: Number, required: true },
  },
})

export default mongoose.model('Crop', cropSchema)
