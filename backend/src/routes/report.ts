import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Reports endpoint' });
});

router.post('/generate', (req, res) => {
  res.json({ message: 'Generate report' });
});

export default router;
