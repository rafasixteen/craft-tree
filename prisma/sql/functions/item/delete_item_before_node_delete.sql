CREATE OR REPLACE FUNCTION delete_item_before_node_delete() RETURNS TRIGGER AS $$
BEGIN
    IF OLD."itemId" IS NOT NULL THEN
        DELETE FROM "Items" WHERE "id" = OLD."itemId";
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;