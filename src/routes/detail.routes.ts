import { Elysia, t } from 'elysia';
import { DetailService } from '../services/tables/detail.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { DetailMany, DetailOne } from "../moneyworks/responses/Detail";

// Initialize the detail service with configuration
const config = loadMoneyWorksConfig();
const detailService = new DetailService(config);

export const detailRoutes = new Elysia({ prefix: '/api' })
  .get('/details',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await detailService.getDetails({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /details:', error);
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
        summary: 'Get all transaction details',
        tags: ['MoneyWorks Data']
      },
      response: DetailMany
    }
  )
  .get('/details/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await detailService.getDetailBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /details/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get detail by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: DetailOne
    }
  )
  .get('/details/for-transaction/:transactionId',
    async ({ params }) => {
      try {
        const transactionId = Number(params.transactionId);
        return await detailService.getDetailsByTransaction(transactionId);
      } catch (error) {
        console.error(`Error in GET /details/for-transaction/${params.transactionId}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        transactionId: t.Numeric()
      }),
      detail: {
        summary: 'Get details for a specific transaction',
        tags: ['MoneyWorks Data']
      },
      response: DetailMany
    }
  );
