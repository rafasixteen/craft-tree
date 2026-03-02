import { productionGraphs } from '@/db/schema';

export type ProductionGraph = typeof productionGraphs.$inferSelect;
