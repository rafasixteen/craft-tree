CREATE TRIGGER IF NOT EXISTS delete_recipe_after_node_delete
AFTER DELETE ON Nodes
FOR EACH ROW
WHEN OLD.recipeId IS NOT NULL
BEGIN
    DELETE FROM Recipes WHERE id = OLD.recipeId;
END;
