import Plant from '../models/plantCalendar.model.js'

export const mockData = async (req, res) => {
  const crops = [
    {
      cropName: 'Chinese Cabbage',
      timeOfPlanting: 'October - December',
      plantPopulation: '41-666',
      maturity: '50 - 60 DAP',
      volumeOfProduction: '20 - 25',
      distanceOfPlanting: { hill: 40, rows: 60 },
    },
    {
      cropName: 'Cantaloupe',
      timeOfPlanting: 'September - February',
      plantPopulation: '20000',
      maturity: '85 - 90 Days After Transplant',
      volumeOfProduction: '5 - 30',
      distanceOfPlanting: { hill: 50, rows: 100 },
    },
    {
      cropName: 'Carrot',
      timeOfPlanting: 'All Season',
      plantPopulation: '333333',
      maturity: '75 - 103 Days After Sowing',
      volumeOfProduction: '4 - 8',
      distanceOfPlanting: { hill: 15, rows: 20 },
    },
    {
      cropName: 'Cauliflower',
      timeOfPlanting: 'September - December',
      plantPopulation: '14619',
      maturity: '45 - 60 Dat',
      volumeOfProduction: '20 Heads',
      distanceOfPlanting: { hill: 35, rows: 60 },
    },
    {
      cropName: 'Celery',
      timeOfPlanting: 'September - January',
      plantPopulation: '250000',
      maturity: '65 - 75 Dap',
      volumeOfProduction: '5 - 6',
      distanceOfPlanting: { hill: 20, rows: 20 },
    },
    {
      cropName: 'Chayote',
      timeOfPlanting: 'September - January',
      plantPopulation: '12500',
      maturity: '6 - 10 Dat',
      volumeOfProduction: '2.5 - 4.0',
      distanceOfPlanting: { hill: 40, rows: 200 },
    },
    {
      cropName: 'Chick Pea',
      timeOfPlanting: 'September - January',
      plantPopulation: '133333',
      maturity: '60 - 90 Dat',
      volumeOfProduction: '2.5 - 3.0',
      distanceOfPlanting: { hill: 15, rows: 50 },
    },
  ]

  await Plant.insertMany(crops)

  res.status(200).json({ message: 'Mock crop data inserted successfully!' })
}

export const getPlants = async (req, res) => {
  const crops = await Plant.find()

  if (crops.length === 0) {
    return res.status(404).json({ message: 'No crops found' })
  }

  res.status(200).json(crops)
}
