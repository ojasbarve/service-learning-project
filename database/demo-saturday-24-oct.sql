-- Reset the live demo window to Saturday, 24 October 2026, 09:00–14:00.
-- Run only when preparing the presentation database.
START TRANSACTION;

DELETE FROM route_stops
WHERE listing_id IN (
  SELECT id FROM surplus_listings
  WHERE status IN ('Available', 'Assigned', 'Picked Up')
);

UPDATE volunteers
SET status = 'Available', last_update = 'Ready for Saturday demo'
WHERE status IN ('En Route', 'Distributing');

UPDATE surplus_listings
SET listed_at = '2026-10-24 09:00:00',
    deadline = CASE id
      WHEN 'l1' THEN '2026-10-24 10:00:00'
      WHEN 'l2' THEN '2026-10-24 10:30:00'
      WHEN 'l5' THEN '2026-10-24 11:00:00'
      WHEN 'l6' THEN '2026-10-24 11:30:00'
      WHEN 'l7' THEN '2026-10-24 12:00:00'
      WHEN 'l8' THEN '2026-10-24 12:15:00'
      WHEN 'l9' THEN '2026-10-24 12:30:00'
      WHEN 'l10' THEN '2026-10-24 13:00:00'
      WHEN 'l11' THEN '2026-10-24 13:30:00'
      ELSE '2026-10-24 14:00:00'
    END,
    status = 'Available',
    volunteer_id = NULL
WHERE status IN ('Available', 'Assigned', 'Picked Up');

COMMIT;
