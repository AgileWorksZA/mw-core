import { Elysia, t } from 'elysia';
import { BuildService } from '../services/tables/build.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { BuildMany, BuildOne } from "../moneyworks/responses/Build";

// Initialize the build service with configuration
const config = loadMoneyWorksConfig();
const buildService = new BuildService(config);

export const buildRoutes = new Elysia({ prefix: '/api' })
  .get('/builds',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await buildService.getBuilds({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /builds:', error);
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
        summary: 'Get all builds',
        tags: ['MoneyWorks Data']
      },
      response: BuildMany
    }
  )
  .get('/builds/:sequenceNumber',
    async ({ params }) => {
      try {
        const sequenceNumber = Number(params.sequenceNumber);
        return await buildService.getBuildBySequenceNumber(sequenceNumber);
      } catch (error) {
        console.error(`Error in GET /builds/${params.sequenceNumber}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequenceNumber: t.Numeric()
      }),
      detail: {
        summary: 'Get build by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: BuildOne
    }
  );
