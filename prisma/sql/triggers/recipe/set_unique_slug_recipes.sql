DROP TRIGGER IF EXISTS trg_recipes_slug ON "Recipes";

CREATE TRIGGER trg_recipes_slug
BEFORE INSERT OR UPDATE OF name ON "Recipes"
FOR EACH ROW
EXECUTE FUNCTION public.set_unique_slug_recipes();
