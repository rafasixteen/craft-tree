import { productionGraphsTable } from '@/db/schema';

export type ProductionGraph = typeof productionGraphsTable.$inferSelect;
