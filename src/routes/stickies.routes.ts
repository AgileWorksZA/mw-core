import { Elysia, t } from 'elysia';
import { StickiesService } from '../services/tables/stickies.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { StickiesMany, StickiesOne } from "../moneyworks/responses/Stickies";

// Initialize the stickies service with configuration
const config = loadMoneyWorksConfig();
const stickiesService = new StickiesService(config);

export const stickiesRoutes = new Elysia({ prefix: '/api' })
  .get('/stickies',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await stickiesService.getStickies({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /stickies:', error);
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
        summary: 'Get all sticky notes',
        tags: ['MoneyWorks Data']
      },
      response: StickiesMany
    }
  )
  .get('/stickies/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await stickiesService.getStickyBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /stickies/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get sticky note by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: StickiesOne
    }
  )
  .get('/stickies/for-record/:recordType/:recordId',
    async ({ params }) => {
      try {
        const { recordType, recordId } = params;
        return await stickiesService.getStickiesByRecord(recordType, recordId);
      } catch (error) {
        console.error(`Error in GET /stickies/for-record/${params.recordType}/${params.recordId}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        recordType: t.String(),
        recordId: t.String()
      }),
      detail: {
        summary: 'Get sticky notes for a specific record',
        tags: ['MoneyWorks Data']
      },
      response: StickiesMany
    }
  );
