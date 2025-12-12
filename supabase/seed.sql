-- BreadFindr Seed Data
-- Run this after schema.sql to populate initial bakeries

INSERT INTO bakeries (name, type, description, address, city, state, zip, latitude, longitude, phone, website, instagram, hours, image_url, specialties, rating, review_count, verified, featured, approved) VALUES

-- San Francisco (6 bakeries)
('Tartine Bakery', 'bakery', 'Iconic San Francisco bakery known for their country bread and morning buns.', '600 Guerrero St', 'San Francisco', 'CA', '94110', 37.7617, -122.4241, '(415) 487-2600', 'https://tartinebakery.com', '@tartinebakery', 'Mon-Sun 7:30am-7pm', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', ARRAY['Country Bread', 'Croissants', 'Morning Buns', 'Sourdough'], 4.8, 2847, true, true, true),

('Ferry Plaza Farmers Market', 'farmers_market', 'Premier farmers market featuring multiple artisan bread vendors every Saturday.', '1 Ferry Building', 'San Francisco', 'CA', '94111', 37.7955, -122.3937, NULL, 'https://cuesa.org/markets/ferry-plaza-farmers-market', NULL, 'Sat 8am-2pm, Tue & Thu 10am-2pm', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', ARRAY['Sourdough', 'Whole Grain', 'Focaccia', 'Baguettes'], 4.7, 1523, true, true, true),

('Sarah''s Sourdough', 'home_baker', 'Home baker specializing in long-fermented sourdough and seasonal specials.', 'Mission District', 'San Francisco', 'CA', '94110', 37.7599, -122.4148, NULL, NULL, '@sarahs_sourdough', 'Order by Wed, pickup Sat', 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800', ARRAY['Sourdough Boules', 'Cinnamon Raisin', 'Seeded Loaves'], 4.9, 89, true, false, true),

('Josey Baker Bread', 'bakery', 'Whole grain focused bakery milling their own flour on-site.', '1434 Haight St', 'San Francisco', 'CA', '94117', 37.7697, -122.4469, '(415) 872-9770', 'https://joseybakerbread.com', '@joseybakerbread', 'Wed-Sun 8am-3pm', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800', ARRAY['Whole Wheat', 'Adventure Bread', 'Danish Rye'], 4.6, 892, true, false, true),

('Bread SRSLY', 'bakery', 'Gluten-free sourdough bakery with incredible texture and flavor.', '503 Divisadero St', 'San Francisco', 'CA', '94117', 37.7749, -122.4378, NULL, 'https://breadsrsly.com', '@breadsrsly', 'Thu-Sun 9am-2pm', 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800', ARRAY['GF Sourdough', 'GF Cinnamon Raisin', 'GF Seeded'], 4.7, 456, true, false, true),

('Marcus''s Micro Bakery', 'home_baker', 'Weekend baker focusing on heritage grains and natural leavening.', 'Noe Valley', 'San Francisco', 'CA', '94114', 37.7502, -122.4337, NULL, NULL, '@marcus_bakes', 'Pre-order only, Sat pickup', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', ARRAY['Einkorn Sourdough', 'Spelt Loaves', 'Focaccia'], 4.8, 34, false, false, true),

-- New York City (5 bakeries)
('Sullivan Street Bakery', 'bakery', 'Renowned NYC bakery famous for their no-knead bread and Italian-style loaves.', '236 9th Ave', 'New York', 'NY', '10001', 40.7465, -74.0014, '(212) 929-5900', 'https://sullivanstreetbakery.com', '@sullivanstreetbakery', 'Mon-Sat 7am-7pm, Sun 7am-6pm', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', ARRAY['Ciabatta', 'Stirato', 'Focaccia', 'Pizza Bianca'], 4.7, 1893, true, true, true),

('Bien Cuit', 'bakery', 'Brooklyn bakery known for dark, crusty bread and laminated pastries.', '120 Smith St', 'Brooklyn', 'NY', '11201', 40.6866, -73.9912, '(718) 852-0200', 'https://biencuit.com', '@biencuit', 'Tue-Sun 8am-5pm', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800', ARRAY['Miche', 'Croissants', 'Pain de Mie', 'Rye'], 4.8, 1245, true, false, true),

('She Wolf Bakery', 'bakery', 'Greenpoint bakery using stone-milled flour and long fermentation.', '106 Ferris St', 'Brooklyn', 'NY', '11231', 40.6747, -74.0067, NULL, 'https://shewolfbakery.com', '@shewolfbakery', 'Tue-Sat 8am-4pm', 'https://images.unsplash.com/photo-1517433670267-30f41f1b6d6b?w=800', ARRAY['Baguettes', 'Sourdough', 'Focaccia', 'Ciabatta'], 4.6, 678, true, false, true),

('Union Square Greenmarket', 'farmers_market', 'NYC flagship farmers market with multiple bread vendors year-round.', 'Union Square', 'New York', 'NY', '10003', 40.7359, -73.9911, NULL, 'https://www.grownyc.org/greenmarket/manhattan-union-square-m', NULL, 'Mon, Wed, Fri, Sat 8am-6pm', 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800', ARRAY['Artisan Breads', 'Pastries', 'Local Grains'], 4.5, 2156, true, false, true),

('Brooklyn Bread Lab', 'home_baker', 'Experimental home baker focusing on ancient grains and wild yeasts.', 'Williamsburg', 'Brooklyn', 'NY', '11211', 40.7081, -73.9571, NULL, NULL, '@brooklynbreadlab', 'Order online, weekend pickup', 'https://images.unsplash.com/photo-1559811814-e2c57b5e91c3?w=800', ARRAY['Kamut Sourdough', 'Emmer Loaves', 'Wild Yeast Breads'], 4.9, 67, true, false, true),

-- Chicago (4 bakeries)
('Publican Quality Bread', 'bakery', 'Artisan bakery from the Publican restaurant group using local grains.', '1759 W Hubbard St', 'Chicago', 'IL', '60622', 41.8899, -87.6710, '(312) 733-9696', 'https://publicanqualitybread.com', '@publicanqualitybread', 'Wed-Sun 8am-4pm', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800', ARRAY['Sourdough', 'Baguettes', 'Croissants', 'Focaccia'], 4.7, 934, true, true, true),

('Hewn', 'bakery', 'Evanston bakery specializing in naturally leavened breads and pastries.', '810 Dempster St', 'Evanston', 'IL', '60202', 42.0411, -87.6854, '(847) 869-4396', 'https://hewnbread.com', '@hewnbread', 'Wed-Sat 7am-3pm, Sun 8am-2pm', 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800', ARRAY['Pain de Campagne', 'Croissants', 'Whole Grain', 'Seasonal Loaves'], 4.8, 567, true, false, true),

('Aya Pastry', 'bakery', 'West Loop bakery with outstanding laminated goods and sourdough.', '1332 W Grand Ave', 'Chicago', 'IL', '60642', 41.8910, -87.6623, '(312) 757-4580', 'https://ayapastry.com', '@ayapastry', 'Tue-Sun 8am-4pm', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800', ARRAY['Croissants', 'Danish', 'Sourdough', 'Brioche'], 4.6, 445, true, false, true),

('Chicago Indoor Garden', 'farmers_market', 'Year-round indoor market featuring local bread artisans.', '1300 W Chicago Ave', 'Chicago', 'IL', '60642', 41.8966, -87.6610, NULL, NULL, '@chicagoindoorgarden', 'Sat 8am-1pm', 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800', ARRAY['Local Breads', 'Pastries', 'Heritage Grains'], 4.4, 289, true, false, true),

-- Los Angeles (4 bakeries)
('Bub and Grandma''s', 'bakery', 'Highland Park bakery known for incredible sourdough and creativity.', '5019 York Blvd', 'Los Angeles', 'CA', '90042', 34.1172, -118.2003, '(323) 302-4820', 'https://bubandgrandmas.com', '@bubandgrandmas', 'Thu-Sun 8am-2pm', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', ARRAY['Sourdough', 'Focaccia', 'Seasonal Specials', 'Pastries'], 4.9, 1567, true, true, true),

('Lodge Bread', 'bakery', 'Culver City bakery with wood-fired oven and grain program.', '11459 Washington Blvd', 'Los Angeles', 'CA', '90066', 33.9985, -118.4050, '(424) 369-3900', 'https://lodgebread.com', '@lodgebread', 'Wed-Mon 8am-4pm', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', ARRAY['Wood-Fired Loaves', 'Whole Grain', 'Pizza', 'Pastries'], 4.7, 1123, true, false, true),

('Clark Street Bread', 'bakery', 'Echo Park bakery specializing in naturally leavened breads.', '1360 Sunset Blvd', 'Los Angeles', 'CA', '90026', 34.0778, -118.2608, '(213) 687-9888', 'https://clarkstreetbread.com', '@clarkstreetbread', 'Wed-Sun 8am-3pm', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800', ARRAY['Country Loaf', 'Baguettes', 'Focaccia', 'Pastries'], 4.6, 834, true, false, true),

('Mar Vista Farmers Market', 'farmers_market', 'Vibrant Sunday market with excellent bread selection.', 'Grand View & Venice Blvd', 'Los Angeles', 'CA', '90066', 34.0016, -118.4291, NULL, 'https://www.mar-vista.com/farmers-market', NULL, 'Sun 9am-2pm', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', ARRAY['Artisan Breads', 'Pastries', 'Local Produce'], 4.5, 567, true, false, true),

-- Seattle (3 bakeries)
('Sea Wolf Bakers', 'bakery', 'Fremont bakery known for beautiful sourdough and laminated pastries.', '3621 Stone Way N', 'Seattle', 'WA', '98103', 47.6502, -122.3427, '(206) 946-1044', 'https://seawolfbakers.com', '@seawolfbakers', 'Wed-Sun 8am-3pm', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', ARRAY['Sourdough', 'Croissants', 'Pain au Chocolat', 'Seasonal Loaves'], 4.8, 1234, true, true, true),

('Tall Grass Bakery', 'bakery', 'Ballard bakery using local and organic ingredients.', '5409 22nd Ave NW', 'Seattle', 'WA', '98107', 47.6684, -122.3859, '(206) 706-0991', 'https://tallgrassbakery.com', '@tallgrassbakery', 'Tue-Sun 7am-3pm', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=800', ARRAY['Whole Grain', 'Sourdough', 'Pastries', 'Cookies'], 4.6, 678, true, false, true),

('Ballard Farmers Market', 'farmers_market', 'Year-round Sunday market with multiple bread vendors.', 'Ballard Ave NW', 'Seattle', 'WA', '98107', 47.6636, -122.3840, NULL, 'https://www.ballardfarmersmarket.org', '@ballardfarmers', 'Sun 10am-3pm', 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800', ARRAY['Local Breads', 'Pastries', 'Artisan Goods'], 4.5, 456, true, false, true),

-- Portland (3 bakeries)
('Ken''s Artisan Bakery', 'bakery', 'Portland institution known for perfect baguettes and croissants.', '338 NW 21st Ave', 'Portland', 'OR', '97209', 45.5264, -122.6941, '(503) 248-2202', 'https://kensartisan.com', '@kensartisan', 'Mon-Sat 7am-5:30pm, Sun 8am-5pm', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800', ARRAY['Baguettes', 'Croissants', 'Pain de Campagne', 'Brioche'], 4.8, 1456, true, true, true),

('Tabor Bread', 'bakery', 'SE Portland bakery with wood-fired oven and commitment to whole grains.', '5051 SE Hawthorne Blvd', 'Portland', 'OR', '97215', 45.5118, -122.6154, '(503) 954-3411', 'https://taborbread.com', '@taborbread', 'Wed-Sun 8am-4pm', 'https://images.unsplash.com/photo-1517433670267-30f41f1b6d6b?w=800', ARRAY['Wood-Fired Bread', 'Whole Grain', 'Sourdough', 'Pastries'], 4.7, 789, true, false, true),

('Nora''s Table Home Bakery', 'home_baker', 'Home baker specializing in heritage grain breads and seasonal offerings.', 'Alberta Arts District', 'Portland', 'OR', '97211', 45.5590, -122.6476, NULL, NULL, '@norastable', 'Order by Thu, Sat pickup', 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800', ARRAY['Heritage Grains', 'Sourdough', 'Seasonal Breads'], 4.9, 45, true, false, true),

-- Austin (3 bakeries)
('Easy Tiger', 'bakery', 'Austin bakery and beer garden known for pretzels and artisan breads.', '709 E 6th St', 'Austin', 'TX', '78701', 30.2659, -97.7378, '(512) 614-4972', 'https://easytigerusa.com', '@easytigerusa', 'Daily 7am-10pm', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', ARRAY['Pretzels', 'Sourdough', 'Rye', 'German-Style Breads'], 4.5, 2345, true, true, true),

('Texas French Bread', 'bakery', 'Austin staple since 1979 with classic French and American breads.', '2906 Guadalupe St', 'Austin', 'TX', '78705', 30.2946, -97.7415, '(512) 478-8794', 'https://texasfrenchbread.com', '@texasfrenchbread', 'Mon-Sat 6:30am-7pm, Sun 7am-6pm', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', ARRAY['French Bread', 'Sourdough', 'Pastries', 'Sandwiches'], 4.4, 1567, true, false, true),

('SFC Farmers Market', 'farmers_market', 'Sustainable food center market with local bread artisans.', '2910 Spyglass Dr', 'Austin', 'TX', '78746', 30.2774, -97.8019, NULL, 'https://www.sustainablefoodcenter.org', '@sfcfarmersmarket', 'Sat 9am-1pm', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800', ARRAY['Local Breads', 'Pastries', 'Organic Goods'], 4.3, 234, true, false, true);
