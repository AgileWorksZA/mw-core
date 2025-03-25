import { Elysia, t } from 'elysia';
import { ListsService } from '../services/lists.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { ListMany, ListOne } from "../moneyworks/responses/List";

// Initialize the lists service with configuration
const config = loadMoneyWorksConfig();
const listsService = new ListsService(config);

export const listsRoutes = new Elysia({ prefix: '/api' })
  .get('/lists',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await listsService.getLists({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /lists:', error);
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
        summary: 'Get all list entries',
        tags: ['MoneyWorks Data']
      },
      response: ListMany
    }
  )
  .get('/lists/names',
    async () => {
      try {
        return await listsService.getListNames();
      } catch (error) {
        console.error('Error in GET /lists/names:', error);
        throw error;
      }
    },
    {
      detail: {
        summary: 'Get unique list names',
        tags: ['MoneyWorks Data']
      },
      response: t.Object({
        listNames: t.Array(t.String())
      })
    }
  )
  .get('/lists/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await listsService.getListBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /lists/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get list entry by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: ListOne
    }
  )
  .get('/lists/by-name/:listName',
    async ({ params }) => {
      try {
        return await listsService.getListsByName(params.listName);
      } catch (error) {
        console.error(`Error in GET /lists/by-name/${params.listName}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        listName: t.String()
      }),
      detail: {
        summary: 'Get list entries by list name',
        tags: ['MoneyWorks Data']
      },
      response: ListMany
    }
  );
