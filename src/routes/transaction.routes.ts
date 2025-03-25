import { Elysia, t } from 'elysia';
import { TransactionService } from '../services/transaction.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';

// Initialize the transaction service with configuration
const config = loadMoneyWorksConfig();
const transactionService = new TransactionService(config);

export const transactionRoutes = new Elysia({ prefix: '/api' })
  .get('/transactions',
    async ({ query }) => {
      const { 
        limit = 10, 
        offset = 0, 
        sort, 
        order, 
        search,
        fromDate,
        toDate,
        type
      } = query;

      try {
        return await transactionService.getTransactions({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search,
          fromDate: fromDate ? new Date(fromDate) : undefined,
          toDate: toDate ? new Date(toDate) : undefined,
          type
        });
      } catch (error) {
        console.error('Error in GET /transactions:', error);
        throw error;
      }
    },
    {
      query: t.Object({
        limit: t.Optional(t.Numeric()),
        offset: t.Optional(t.Numeric()),
        sort: t.Optional(t.String()),
        order: t.Optional(t.String()),
        search: t.Optional(t.String()),
        fromDate: t.Optional(t.String()),
        toDate: t.Optional(t.String()),
        type: t.Optional(t.String())
      }),
      detail: {
        summary: 'Get all transactions',
        tags: ['MoneyWorks']
      }
    }
  )
  .get('/transactions/:id',
    async ({ params }) => {
      try {
        const id = params.id;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(id)) && !isNaN(parseFloat(id))) {
          return await transactionService.getTransactionBySequenceNumber(Number(id));
        }

        // Otherwise treat as reference
        return await transactionService.getTransactionByReference(id);
      } catch (error) {
        console.error(`Error in GET /transactions/${params.id}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Get transaction by sequence number or reference',
        tags: ['MoneyWorks']
      }
    }
  );