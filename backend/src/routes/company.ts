import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Companies endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create company' });
});

export default router;
