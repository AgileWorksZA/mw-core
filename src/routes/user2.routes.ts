import { Elysia, t } from 'elysia';
import { User2Service } from '../services/tables/user2.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { User2Many, User2One } from "../moneyworks/responses/User2";

// Initialize the user2 service with configuration
const config = loadMoneyWorksConfig();
const user2Service = new User2Service(config);

export const user2Routes = new Elysia({ prefix: '/api' })
  .get('/user2',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await user2Service.getUser2Records({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /user2:', error);
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
        summary: 'Get all user2 records',
        tags: ['MoneyWorks Data']
      },
      response: User2Many
    }
  )
  .get('/user2/:id',
    async ({ params }) => {
      try {
        const id = params.id;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(id)) && !isNaN(parseFloat(id))) {
          return await user2Service.getUser2BySequenceNumber(Number(id));
        }

        // Otherwise treat as username
        return await user2Service.getUser2ByUsername(id);
      } catch (error) {
        console.error(`Error in GET /user2/${params.id}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Get user2 record by username or sequence number',
        tags: ['MoneyWorks Data']
      },
      response: User2One
    }
  );
