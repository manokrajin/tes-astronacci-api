var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});


router.get('/', async function(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit }),
      prisma.user.count()
    ]);

    const usersResponse = users.map(user => {
      const userResponse = { ...user };
      if (user.image) {
        userResponse.imageBase64 = user.image;
        delete userResponse.image;
      }
      return userResponse;
    });

    res.json({
      users: usersResponse,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', upload.single('image'), async function(req, res, next) {
  try {

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        error: 'Name is a required field'
      });
    }

    const userData = {
      name: name.trim(),
      image: req.file ? req.file.buffer.toString('base64') : null,
    };

    const newUser = await prisma.user.create({ data: userData });

    const userResponse = { ...newUser };
    if (newUser.image) {
      userResponse.imageBase64 = newUser.image;
      delete userResponse.image;
    }

    res.status(201).json(userResponse);
  } catch (err) {
    
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File too large. Maximum size is 5MB'
        });
      }
    }

    res.status(400).json({ error: err.message });
  }
});

/* GET a specific user by ID. */
router.get('/:id', async function(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const userResponse = { ...user };
    if (user.image) {
      userResponse.imageBase64 = user.image;
      delete userResponse.image;
    }
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PUT update a user by ID. */
router.put('/:id', upload.single('image'), async function(req, res, next) {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.buffer.toString('base64');
    }
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
    });
    res.json(user);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    res.status(400).json({ error: err.message });
  }
});

/* DELETE a user by ID. */
router.delete('/:id', async function(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    res.status(500).json({ error: err.message });
  }
});

/* GET user image by ID. */
router.get('/:id/image', async function(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!user || !user.image) return res.status(404).json({ error: 'Image not found' });
    res.set('Content-Type', 'image/jpeg'); 
    res.send(Buffer.from(user.image, 'base64'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* PUT update user image by ID. */
router.put('/:id/image', upload.single('image'), async function(req, res, next) {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { image: req.file.buffer.toString('base64') },
    });
    res.json({ message: 'Image updated successfully', user: { id: user.id, name: user.name } });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
