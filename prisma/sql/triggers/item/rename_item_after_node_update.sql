DROP TRIGGER IF EXISTS rename_item_after_node_update ON "Nodes";

CREATE TRIGGER rename_item_after_node_update
AFTER UPDATE OF name ON "Nodes"
FOR EACH ROW
EXECUTE FUNCTION rename_item_after_node_update();
