import { foldersTable } from '@/db/schema';

export type Folder = typeof foldersTable.$inferSelect;
