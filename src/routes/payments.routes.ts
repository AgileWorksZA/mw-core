import { Elysia, t } from 'elysia';
import { PaymentsService } from '../services/payments.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { PaymentsMany, PaymentsOne } from "../moneyworks/responses/Payments";

// Initialize the payments service with configuration
const config = loadMoneyWorksConfig();
const paymentsService = new PaymentsService(config);

export const paymentsRoutes = new Elysia({ prefix: '/api' })
  .get('/payments',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await paymentsService.getPayments({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /payments:', error);
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
        summary: 'Get all payments',
        tags: ['MoneyWorks Data']
      },
      response: PaymentsMany
    }
  )
  .get('/payments/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await paymentsService.getPaymentBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /payments/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get payment by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: PaymentsOne
    }
  )
  .get('/payments/for-name/:nameCode',
    async ({ params }) => {
      try {
        return await paymentsService.getPaymentsByName(params.nameCode);
      } catch (error) {
        console.error(`Error in GET /payments/for-name/${params.nameCode}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        nameCode: t.String()
      }),
      detail: {
        summary: 'Get payments for a specific name',
        tags: ['MoneyWorks Data']
      },
      response: PaymentsMany
    }
  );
