const express = require('express');
const router = express.Router();
const Property = require('../models/Property'); // Importa el modelo Property
const User = require('../models/User'); // Importa el modelo User para verificar el propietario
const auth = require('../middleware/auth'); // Importa el middleware de autenticación

// Ruta para crear una nueva propiedad: POST /api/properties
// Requiere autenticación
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, price, type, location, images } = req.body;

    // Buscar el usuario autenticado para asociar la propiedad
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Crear una nueva instancia del modelo Property
    const newProperty = new Property({
      title,
      description,
      price,
      type,
      location, // Debe ser un objeto con { type: 'Point', coordinates: [lng, lat], address: '...' }
      images: images || [], // Si no se envían imágenes, usar array vacío
      owner: user.id // Asignar el ID del usuario autenticado como propietario
    });

    // Guardar la propiedad en la base de datos
    const property = await newProperty.save();

    res.json(property); // Devolver la propiedad creada

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener todas las propiedades: GET /api/properties
// No requiere autenticación
router.get('/', async (req, res) => {
  try {
    // Buscar todas las propiedades en la base de datos
    const properties = await Property.find()
                                    .populate('owner', 'name lastname email') // Popula el campo owner con nombre y email
                                    .sort({ createdAt: -1 }); // Ordenar por fecha de creación, más recientes primero

    res.json(properties); // Devolver la lista de propiedades

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para obtener una propiedad por ID: GET /api/properties/:id
// No requiere autenticación
router.get('/:id', async (req, res) => {
  try {
    // Buscar la propiedad por su ID
    const property = await Property.findById(req.params.id)
                                  .populate('owner', 'name lastname email'); // Popula el propietario

    if (!property) {
        return res.status(404).json({ msg: 'Propiedad no encontrada' });
    }

    res.json(property); // Devolver la propiedad encontrada

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

// Exporta el router
module.exports = router;