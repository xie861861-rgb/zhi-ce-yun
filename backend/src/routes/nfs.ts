import { Router } from 'express';

const router = Router();

router.post('/calculate', (req, res) => {
  // NFS-Agent calculation endpoint
  res.json({ 
    message: 'NFS calculation endpoint',
    netFinancingSpace: 0,
    recommendedAssets: []
  });
});

export default router;
