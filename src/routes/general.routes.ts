import { Elysia } from 'elysia';
import { GeneralService } from '../services/general.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';

// Initialize the general service with configuration
const config = loadMoneyWorksConfig();
const generalService = new GeneralService(config);

export const generalRoutes = new Elysia({ prefix: '/api' })
  .get('/general',
    async () => {
      try {
        return await generalService.getGeneralSettings();
      } catch (error) {
        console.error('Error in GET /general:', error);
        throw error;
      }
    },
    {
      detail: {
        summary: 'Get general settings',
        tags: ['MoneyWorks Data']
      }
    }
  );
