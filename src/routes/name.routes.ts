import { Elysia, t } from 'elysia';
import { NameService } from '../services/name.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { NameMany, NameOne } from "../moneyworks/responses/Name";

// Initialize the name service with configuration
const config = loadMoneyWorksConfig();
const nameService = new NameService(config);

export const nameRoutes = new Elysia({ prefix: '/api' })
  .get('/names',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await nameService.getNames({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /names:', error);
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
        summary: 'Get all names (customers/suppliers)',
        tags: ['MoneyWorks Data']
      },
      response: NameMany
    }
  )
  .get('/names/:code',
    async ({ params }) => {
      try {
        const code = params.code;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(code)) && !isNaN(parseFloat(code))) {
          return await nameService.getNameBySequenceNumber(Number(code));
        }

        // Otherwise treat as code
        return await nameService.getNameByCode(code);
      } catch (error) {
        console.error(`Error in GET /names/${params.code}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        code: t.String()
      }),
      detail: {
        summary: 'Get name by code',
        tags: ['MoneyWorks Data']
      },
      response: NameOne
    }
  )
  .get('/names/by-sequence/:sequence',
    async ({ params }) => {
      try {
        const sequence = params.sequence;

        // Otherwise treat as code
        return await nameService.getNameBySequenceNumber(sequence);
      } catch (error) {
        console.error(`Error in GET /names/${params.sequence}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequence: t.Numeric()
      }),
      detail: {
        summary: 'Get name by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: NameOne
    }
  );
