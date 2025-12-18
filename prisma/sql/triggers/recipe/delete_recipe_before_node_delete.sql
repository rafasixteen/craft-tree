DROP TRIGGER IF EXISTS delete_recipe_before_node_delete ON "Nodes";

CREATE TRIGGER delete_recipe_before_node_delete
AFTER DELETE ON "Nodes"
FOR EACH ROW
EXECUTE FUNCTION delete_recipe_before_node_delete();