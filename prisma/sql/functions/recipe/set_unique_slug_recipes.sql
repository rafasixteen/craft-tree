CREATE OR REPLACE FUNCTION public.set_unique_slug_recipes() RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    base_slug TEXT;
    new_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Only run if name is set and slug is null
    IF NEW.name IS NOT NULL THEN
        base_slug := slugify(NEW.name);
        new_slug := base_slug;

        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM "Recipes" WHERE slug = new_slug) LOOP
            new_slug := base_slug || '-' || counter;
            counter := counter + 1;
        END LOOP;

        NEW.slug := new_slug;
    END IF;

    RETURN NEW;
END;
$$;
