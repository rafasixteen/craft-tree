CREATE OR REPLACE FUNCTION rename_item_after_node_update() RETURNS TRIGGER AS $$
BEGIN
    -- Only update if the row has an associated itemId and the name changed
    IF OLD."itemId" IS NOT NULL AND NEW."name" IS DISTINCT FROM OLD."name" THEN
        UPDATE "Items" SET "name" = NEW."name" WHERE "id" = OLD."itemId";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;