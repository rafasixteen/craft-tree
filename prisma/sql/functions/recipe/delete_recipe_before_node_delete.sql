CREATE OR REPLACE FUNCTION delete_recipe_before_node_delete() RETURNS TRIGGER AS $$
BEGIN
    IF OLD."recipeId" IS NOT NULL THEN
        DELETE FROM "Recipes" WHERE "id" = OLD."recipeId";
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;