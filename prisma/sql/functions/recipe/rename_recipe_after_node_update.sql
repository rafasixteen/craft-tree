CREATE OR REPLACE FUNCTION rename_recipe_after_node_update() RETURNS TRIGGER AS $$
BEGIN
    -- Only update if the row has an associated recipeId and the name changed
    IF OLD."recipeId" IS NOT NULL AND NEW."name" IS DISTINCT FROM OLD."name" THEN
        UPDATE "Recipes" SET "name" = NEW."name" WHERE "id" = OLD."recipeId";
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;