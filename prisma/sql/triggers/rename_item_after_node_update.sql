CREATE TRIGGER IF NOT EXISTS rename_item_after_node_update
AFTER UPDATE OF name ON Nodes
FOR EACH ROW
WHEN OLD.itemId IS NOT NULL
     AND NEW.name IS NOT OLD.name
BEGIN
    UPDATE Items
    SET name = NEW.name
    WHERE id = OLD.itemId;
END;
