import { Elysia, t } from 'elysia';
import { JobService } from '../services/job.service';
import { loadMoneyWorksConfig } from '../config/moneyworks.config';
import { JobMany, JobOne } from "../moneyworks/responses/Job";

// Initialize the job service with configuration
const config = loadMoneyWorksConfig();
const jobService = new JobService(config);

export const jobRoutes = new Elysia({ prefix: '/api' })
  .get('/jobs',
    async ({ query }) => {
      const { limit = 10, offset = 0, sort, order, search } = query;

      try {
        return await jobService.getJobs({
          limit: Number(limit),
          offset: Number(offset),
          sort,
          order: order as 'asc' | 'desc',
          search
        });
      } catch (error) {
        console.error('Error in GET /jobs:', error);
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
        summary: 'Get all jobs',
        tags: ['MoneyWorks Data']
      },
      response: JobMany
    }
  )
  .get('/jobs/:code',
    async ({ params }) => {
      try {
        const code = params.code;

        // Try to parse as number for sequence number lookup
        if (!isNaN(Number(code)) && !isNaN(parseFloat(code))) {
          return await jobService.getJobBySequenceNumber(Number(code));
        }

        // Otherwise treat as code
        return await jobService.getJobByCode(code);
      } catch (error) {
        console.error(`Error in GET /jobs/${params.code}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        code: t.String()
      }),
      detail: {
        summary: 'Get job by code',
        tags: ['MoneyWorks Data']
      },
      response: JobOne
    }
  )
  .get('/jobs/by-sequence/:sequence',
    async ({ params }) => {
      try {
        const sequence = params.sequence;
        return await jobService.getJobBySequenceNumber(sequence);
      } catch (error) {
        console.error(`Error in GET /jobs/${params.sequence}:`, error);
        throw error;
      }
    },
    {
      params: t.Object({
        sequence: t.Numeric()
      }),
      detail: {
        summary: 'Get job by sequence number',
        tags: ['MoneyWorks Data']
      },
      response: JobOne
    }
  );
