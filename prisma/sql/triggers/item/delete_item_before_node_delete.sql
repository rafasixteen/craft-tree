DROP TRIGGER IF EXISTS delete_item_before_node_delete ON "Nodes";

CREATE TRIGGER delete_item_before_node_delete
AFTER DELETE ON "Nodes"
FOR EACH ROW
EXECUTE FUNCTION delete_item_before_node_delete();