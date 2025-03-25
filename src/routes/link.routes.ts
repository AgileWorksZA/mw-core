import { Elysia, t } from 'elysia';
import { LinkService } from '../services/link.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { LinkMany, LinkOne } from "../moneyworks/responses/Link";

// Initialize the link service with configuration
const config = loadMoneyWorksConfig();
const linkService = new LinkService(config);

export const linkRoutes = new Elysia({ prefix: '/api' })
  .get('/links',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await linkService.getLinks({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /links:', error);
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
        summary: 'Get all links',
        tags: ['MoneyWorks Data']
      },
      response: LinkMany
    }
  )
  .get('/links/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await linkService.getLinkBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /links/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get link by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: LinkOne
    }
  )
  .get('/links/for-record/:recordType/:recordId',
    async ({ params }) => {
      try {
        const { recordType, recordId } = params;
        return await linkService.getLinksByRecord(recordType, recordId);
      } catch (error) {
        console.error(`Error in GET /links/for-record/${params.recordType}/${params.recordId}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        recordType: t.String(),
        recordId: t.String()
      }),
      detail: {
        summary: 'Get links for a specific record',
        tags: ['MoneyWorks Data']
      },
      response: LinkMany
    }
  );
