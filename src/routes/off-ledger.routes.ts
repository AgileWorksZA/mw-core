import { Elysia, t } from 'elysia';
import { OffLedgerService } from '../services/off-ledger.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';

// Initialize the off-ledger service with configuration
const config = loadMoneyWorksConfig();
const offLedgerService = new OffLedgerService(config);

export const offLedgerRoutes = new Elysia({ prefix: '/api' })
  .get('/off-ledger',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await offLedgerService.getOffLedgerEntries({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /off-ledger:', error);
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
        summary: 'Get all off-ledger entries',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/off-ledger/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await offLedgerService.getOffLedgerEntryBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /off-ledger/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get off-ledger entry by sequence number',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/off-ledger/for-account/:accountCode',
    async ({ params }) => {
      try {
        return await offLedgerService.getOffLedgerEntriesByAccount(params.accountCode);
      } catch (error) {
        console.error(`Error in GET /off-ledger/for-account/${params.accountCode}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        accountCode: t.String()
      }),
      detail: {
        summary: 'Get off-ledger entries for a specific account',
        tags: ['MoneyWorks Data']
      }
    }
  );
