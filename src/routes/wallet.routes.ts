import { Router } from 'express';
import { simulationService } from '../services/simulation.service.js';

const router = Router();

router.post('/:id/simulate/start', (req, res) => {
    simulationService.start(req.params.id);
    res.json({ message: 'Simulation started' });
});

router.post('/:id/simulate/stop', (req, res) => {
    simulationService.stop(req.params.id);
    res.json({ message: 'Simulation stopped' });
});

export default router;