import { Elysia, t } from 'elysia';
import { TransactionService } from '../services/tables/transaction.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { TransactionMany, TransactionOne } from "../moneyworks/responses/Transaction";

// Initialize the transaction service with configuration
const config = loadMoneyWorksConfig();
const transactionService = new TransactionService(config);

export const transactionRoutes = new Elysia({ prefix: '/api' })
  .get('/transactions',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await transactionService.getTransactions({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
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
        search: t.Optional(t.String())
      }),
      detail: {
        summary: 'Get all transactions',
        tags: ['MoneyWorks Data']
      },
      response: TransactionMany
    }
  )
  .get('/transactions/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await transactionService.getTransactionBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /transactions/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get transaction by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: TransactionOne
    }
  );
