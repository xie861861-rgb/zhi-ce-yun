import { Router } from 'express';

const router = Router();

router.post('/register', (req, res) => {
  // TODO: Implement registration
  res.json({ message: 'Register endpoint' });
});

router.post('/login', (req, res) => {
  // TODO: Implement login
  res.json({ message: 'Login endpoint' });
});

export default router;
