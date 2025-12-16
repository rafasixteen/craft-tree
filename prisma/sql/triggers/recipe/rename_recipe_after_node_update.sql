DROP TRIGGER IF EXISTS rename_recipe_after_node_update ON "Nodes";

CREATE TRIGGER rename_recipe_after_node_update
AFTER UPDATE OF name ON "Nodes"
FOR EACH ROW
EXECUTE FUNCTION rename_recipe_after_node_update();
