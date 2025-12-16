DROP TRIGGER IF EXISTS trg_items_slug ON "Items";

CREATE TRIGGER trg_items_slug
BEFORE INSERT OR UPDATE OF name ON "Items"
FOR EACH ROW
EXECUTE FUNCTION public.set_unique_slug_items();