CREATE TABLE meal_deal_items (
    id TEXT PRIMARY KEY,
    shop TEXT NOT NULL,
    type VARCHAR(255) NOT NULL,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE meal_deal_votes (
    drink_id TEXT NOT NULL,
    snack_id TEXT NOT NULL,
    main_id TEXT NOT NULL,
    vote_count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (drink_id, snack_id, main_id),
    FOREIGN KEY (drink_id) REFERENCES meal_deal_items(id) ON DELETE CASCADE,
    FOREIGN KEY (snack_id) REFERENCES meal_deal_items(id) ON DELETE CASCADE,
    FOREIGN KEY (main_id) REFERENCES meal_deal_items(id) ON DELETE CASCADE
);

CREATE INDEX vote_count_index ON meal_deal_votes (vote_count DESC);

CREATE TABLE meal_deal_drink_votes (
    id TEXT PRIMARY KEY,
    vote_count INTEGER NOT NULL,
    FOREIGN KEY (id) REFERENCES meal_deal_items(id) ON DELETE CASCADE
);

CREATE INDEX drink_vote_count_index ON meal_deal_drink_votes (vote_count DESC);

CREATE TABLE meal_deal_snack_votes (
    id TEXT PRIMARY KEY,
    vote_count INTEGER NOT NULL,
    FOREIGN KEY (id) REFERENCES meal_deal_items(id) ON DELETE CASCADE
);

CREATE INDEX snack_vote_count_index ON meal_deal_snack_votes (vote_count DESC);

CREATE TABLE meal_deal_main_votes (
    id TEXT PRIMARY KEY,
    vote_count INTEGER NOT NULL,
    FOREIGN KEY (id) REFERENCES meal_deal_items(id) ON DELETE CASCADE
);

CREATE INDEX main_vote_count_index ON meal_deal_main_votes (vote_count DESC);

CREATE TABLE user_votes (
    id TEXT PRIMARY KEY,
    last_vote_time TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_vote_counts() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO meal_deal_drink_votes (id, vote_count) VALUES (NEW.drink_id, 1) ON CONFLICT (id) DO UPDATE SET
        vote_count = meal_deal_drink_votes.vote_count + 1;
    INSERT INTO meal_deal_snack_votes (id, vote_count) VALUES (NEW.snack_id, 1) ON CONFLICT (id) DO UPDATE SET
        vote_count = meal_deal_snack_votes.vote_count + 1;
    INSERT INTO meal_deal_main_votes (id, vote_count) VALUES (NEW.main_id, 1) ON CONFLICT (id) DO UPDATE SET
        vote_count = meal_deal_main_votes.vote_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vote_counts_insert
AFTER INSERT ON meal_deal_votes
FOR EACH ROW
EXECUTE FUNCTION update_vote_counts();

CREATE TRIGGER update_vote_counts_update
AFTER UPDATE ON meal_deal_votes
FOR EACH ROW
EXECUTE FUNCTION update_vote_counts();

CREATE OR REPLACE FUNCTION check_food_items_are_from_same_store_and_type_and_exist(
    drink_id TEXT,
    snack_id TEXT,
    main_id TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    drink_shop TEXT;
    snack_shop TEXT;
    main_shop TEXT;
BEGIN
    SELECT shop INTO drink_shop FROM meal_deal_items WHERE id = drink_id AND type = 'drink';
    IF drink_shop IS NULL THEN
        RETURN FALSE;
    END IF;

    SELECT shop INTO snack_shop FROM meal_deal_items WHERE id = snack_id AND type = 'snack';
    IF snack_shop IS NULL OR snack_shop != drink_shop THEN
        RETURN FALSE;
    END IF;

    SELECT shop INTO main_shop FROM meal_deal_items WHERE id = main_id AND type = 'main';
    IF main_shop IS NULL OR main_shop != drink_shop THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
