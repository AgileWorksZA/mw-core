import { Elysia, t } from 'elysia';
import { ProductService } from '../services/product.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';

// Initialize the product service with configuration
const config = loadMoneyWorksConfig();
const productService = new ProductService(config);

export const productRoutes = new Elysia({ prefix: '/api' })
  .get('/products',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await productService.getProducts({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /products:', error);
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
        summary: 'Get all products',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/products/:code',
    async ({ params }) => {
      try {
        const code = params.code;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(code)) && !isNaN(parseFloat(code))) {
          return await productService.getProductBySequenceNumber(Number(code));
        }

        // Otherwise treat as code
        return await productService.getProductByCode(code);
      } catch (error) {
        console.error(`Error in GET /products/${params.code}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        code: t.String()
      }),
      detail: {
        summary: 'Get product by code',
        tags: ['MoneyWorks Data']
      }
    }
  )
  .get('/products/by-sequence/:sequence',
    async ({ params }) => {
      try {
        const sequence = params.sequence;
        return await productService.getProductBySequenceNumber(sequence);
      } catch (error) {
        console.error(`Error in GET /products/${params.sequence}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequence: t.Numeric()
      }),
      detail: {
        summary: 'Get product by sequence number',
        tags: ['MoneyWorks Data']
      }
    }
  );
