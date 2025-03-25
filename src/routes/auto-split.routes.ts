import { Elysia, t } from 'elysia';
import { AutoSplitService } from '../services/auto-split.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { AutoSplitMany, AutoSplitOne } from "../moneyworks/responses/AutoSplit";

// Initialize the auto-split service with configuration
const config = loadMoneyWorksConfig();
const autoSplitService = new AutoSplitService(config);

export const autoSplitRoutes = new Elysia({ prefix: '/api' })
  .get('/auto-splits',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await autoSplitService.getAutoSplits({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /auto-splits:', error);
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
        summary: 'Get all auto splits',
        tags: ['MoneyWorks Data']
      },
      response: AutoSplitMany
    }
  )
  .get('/auto-splits/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await autoSplitService.getAutoSplitBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /auto-splits/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get auto split by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: AutoSplitOne
    }
  );
