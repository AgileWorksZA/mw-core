import { Elysia, t } from 'elysia';
import { TaxRateService } from '../services/tables/tax-rate.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { TaxRateMany, TaxRateOne } from "../moneyworks/responses/TaxRate";

// Initialize the tax rate service with configuration
const config = loadMoneyWorksConfig();
const taxRateService = new TaxRateService(config);

export const taxRateRoutes = new Elysia({ prefix: '/api' })
  .get('/tax-rates',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await taxRateService.getTaxRates({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /tax-rates:', error);
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
        summary: 'Get all tax rates',
        tags: ['MoneyWorks Data']
      },
      response: TaxRateMany
    }
  )
  .get('/tax-rates/:code',
    async ({ params }) => {
      try {
        const code = params.code;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(code)) && !isNaN(parseFloat(code))) {
          return await taxRateService.getTaxRateBySequenceNumber(Number(code));
        }

        // Otherwise treat as code
        return await taxRateService.getTaxRateByCode(code);
      } catch (error) {
        console.error(`Error in GET /tax-rates/${params.code}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        code: t.String()
      }),
      detail: {
        summary: 'Get tax rate by code',
        tags: ['MoneyWorks Data']
      },
      response: TaxRateOne
    }
  )
  .get('/tax-rates/by-sequence/:sequence',
    async ({ params }) => {
      try {
        const sequence = params.sequence;
        return await taxRateService.getTaxRateBySequenceNumber(sequence);
      } catch (error) {
        console.error(`Error in GET /tax-rates/${params.sequence}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequence: t.Numeric()
      }),
      detail: {
        summary: 'Get tax rate by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: TaxRateOne
    }
  );
