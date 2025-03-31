import { Elysia, t } from 'elysia';
import { UserService } from '../services/tables/user.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { UserMany, UserOne } from "../moneyworks/responses/User";

// Initialize the user service with configuration
const config = loadMoneyWorksConfig();
const userService = new UserService(config);

export const userRoutes = new Elysia({ prefix: '/api' })
  .get('/users',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await userService.getUsers({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /users:', error);
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
        summary: 'Get all users',
        tags: ['MoneyWorks Data']
      },
      response: UserMany
    }
  )
  .get('/users/:id',
    async ({ params }) => {
      try {
        const id = params.id;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(id)) && !isNaN(parseFloat(id))) {
          return await userService.getUserBySequenceNumber(Number(id));
        }

        // Otherwise treat as username
        return await userService.getUserByUsername(id);
      } catch (error) {
        console.error(`Error in GET /users/${params.id}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Get user by username or sequence number',
        tags: ['MoneyWorks Data']
      },
      response: UserOne
    }
  )
  .get('/users/by-sequence/:sequence',
    async ({ params }) => {
      try {
        const sequence = params.sequence;
        return await userService.getUserBySequenceNumber(sequence);
      } catch (error) {
        console.error(`Error in GET /users/${params.sequence}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequence: t.Numeric()
      }),
      detail: {
        summary: 'Get user by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: UserOne
    }
  );
