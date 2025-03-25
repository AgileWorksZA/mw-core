import { Elysia, t } from 'elysia';
import { LoginService } from '../services/login.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';

// Initialize the login service with configuration
const config = loadMoneyWorksConfig();
const loginService = new LoginService(config);

export const loginRoutes = new Elysia({ prefix: '/api' })
  .get('/logins',
    async ({ query }) => {
      const { limit = 50, offset = 0, sort, order, search } = query;

      try {
        return await loginService.getLogins({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /logins:', error);
        throw error;
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
        sort: t.Optional(t.String()),
        order: t.Optional(t.String()),
        search: t.Optional(t.String())
      }),
      detail: {
        summary: 'Get all login entries',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/logins/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await loginService.getLoginBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /logins/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get login entry by sequence number',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/logins/by-user/:username',
    async ({ params }) => {
      try {
        return await loginService.getLoginsByUser(params.username);
      } catch (error) {
        console.error(`Error in GET /logins/by-user/${params.username}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        username: t.String()
      }),
      detail: {
        summary: 'Get login entries by user',
        tags: ['MoneyWorks Data']
      }
    }
  );
