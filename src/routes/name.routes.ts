import { Elysia, t } from 'elysia';
import { NameService } from '../services/name.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import {createTransformMiddleware} from "../moneyworks/transformers/xml-transform";
import {Name} from "../moneyworks/types/name";
import nameSchema from "../moneyworks/json-schema/name-schema.json";

// Initialize the name service with configuration
const config = loadMoneyWorksConfig();
const nameService = new NameService(config);

// Create the transformation middleware
const nameTransformMiddleware = createTransformMiddleware<Name>('Name', {
  schema: nameSchema,
  fieldNameCase: 'camel',
  // Define fields that should be converted to Date objects
  dateFields: [
    'lastModifiedTime',
    'dateOfLastSale'
  ]
});

export const nameRoutes = new Elysia({ prefix: '/api' })
  .use(nameTransformMiddleware)
  .get('/names',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await nameService.getNames({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /names:', error);
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
        summary: 'Get all names (customers/suppliers)',
        tags: ['MoneyWorks']
      }
    }
  )
  .get('/names/:id',
    async ({ params }) => {
      try {
        const id = params.id;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(id)) && !isNaN(parseFloat(id))) {
          return await nameService.getNameBySequenceNumber(Number(id));
        }

        // Otherwise treat as code
        return await nameService.getNameByCode(id);
      } catch (error) {
        console.error(`Error in GET /names/${params.id}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        summary: 'Get name by ID or code',
        tags: ['MoneyWorks']
      }
    }
  );
