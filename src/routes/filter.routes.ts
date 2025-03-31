import { Elysia, t } from 'elysia';
import { FilterService } from '../services/tables/filter.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { FilterMany, FilterOne } from "../moneyworks/responses/Filter";

// Initialize the filter service with configuration
const config = loadMoneyWorksConfig();
const filterService = new FilterService(config);

export const filterRoutes = new Elysia({ prefix: '/api' })
  .get('/filters',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await filterService.getFilters({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /filters:', error);
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
        summary: 'Get all saved filters',
        tags: ['MoneyWorks Data']
      },
      response: FilterMany
    }
  )
  .get('/filters/:idOrName',
    async ({ params }) => {
      try {
        const idOrName = params.idOrName;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(idOrName)) && !isNaN(parseFloat(idOrName))) {
          return await filterService.getFilterBySequenceNumber(Number(idOrName));
        }

        // Otherwise treat as name
        return await filterService.getFilterByName(idOrName);
      } catch (error) {
        console.error(`Error in GET /filters/${params.idOrName}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        idOrName: t.String()
      }),
      detail: {
        summary: 'Get filter by name or sequence number',
        tags: ['MoneyWorks Data']
      },
      response: FilterOne
    }
  );
