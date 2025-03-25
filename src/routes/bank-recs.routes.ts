import { Elysia, t } from 'elysia';
import { BankRecsService } from '../services/bank-recs.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';

// Initialize the bank-recs service with configuration
const config = loadMoneyWorksConfig();
const bankRecsService = new BankRecsService(config);

export const bankRecsRoutes = new Elysia({ prefix: '/api' })
  .get('/bank-recs',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await bankRecsService.getBankRecs({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /bank-recs:', error);
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
        summary: 'Get all bank reconciliation entries',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/bank-recs/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await bankRecsService.getBankRecsBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /bank-recs/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get bank reconciliation entry by sequence number',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/bank-recs/for-account/:accountCode',
    async ({ params }) => {
      try {
        return await bankRecsService.getBankRecsByAccount(params.accountCode);
      } catch (error) {
        console.error(`Error in GET /bank-recs/for-account/${params.accountCode}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        accountCode: t.String()
      }),
      detail: {
        summary: 'Get bank reconciliation entries for a specific account',
        tags: ['MoneyWorks Data']
      }
    }
  );
