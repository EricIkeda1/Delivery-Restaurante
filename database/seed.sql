INSERT INTO restaurants(id,name,category,description,image,rating,minutes,fee) VALUES
('bella-massa','Pizzaria Bella Massa','Pizza','Pizza artesanal, feita com amor','/assets/pizza.jpg',4.9,25,6),
('burger-house','Burger House','Hambúrguer','Brasa acesa. Fome resolvida.','/assets/burger.jpg',4.8,20,0),
('sushi-yama','Sushi Yama','Japonesa','O melhor do Japão por aqui','/assets/sushi.jpg',4.9,35,6),
('forno-italia','Forno da Vila','Pizza','Tradição italiana em cada fatia','/assets/hero.jpg',4.8,30,5),
('cantina-urbana','Cantina Urbana','Brasileira','Comida de casa, todo dia','/assets/burger.jpg',4.7,20,0),
('pizza-chef','Pizza do Chef','Pizza','Criatividade que dá água na boca','/assets/pizza.jpg',4.8,25,0)
ON CONFLICT DO NOTHING;
INSERT INTO products(id,restaurant_id,name,description,price,image,category) VALUES
('mussarela','bella-massa','Mussarela','Molho da casa, mussarela cremosa, tomate e orégano fresco.',49.90,'/assets/pizza.jpg','Pizzas'),
('calabresa','bella-massa','Calabresa','Molho de tomate, mussarela, calabresa e cebola roxa.',52.90,'/assets/hero.jpg','Pizzas'),
('portuguesa','bella-massa','Portuguesa','Mussarela, presunto, ovos, cebola e azeitonas selecionadas.',56.90,'/assets/pizza.jpg','Pizzas'),
('quatro-queijos','bella-massa','4 Queijos','Mussarela, provolone, parmesão e catupiry. Cremosa de verdade.',59.90,'/assets/hero.jpg','Pizzas'),
('margherita','bella-massa','Margherita','Tomate fresco, mussarela e manjericão. O clássico perfeito.',54.90,'/assets/pizza.jpg','Pizzas'),
('frango','bella-massa','Frango com catupiry','Frango desfiado, catupiry cremoso e um toque de orégano.',57.90,'/assets/hero.jpg','Pizzas'),
('classic-burger','burger-house','Classic Burger','Pão brioche, hambúrguer artesanal, queijo e molho da casa.',32.90,'/assets/burger.jpg','Lanches'),
('bacon-burger','burger-house','Bacon Burger','Hambúrguer de 180g, bacon crocante e cheddar.',38.90,'/assets/burger.jpg','Lanches'),
('combo-sushi','sushi-yama','Combo da casa • 20 peças','Sushis e sashimis frescos, preparados na hora.',69.90,'/assets/sushi.jpg','Combinados'),
('hot-roll','sushi-yama','Hot Roll • 10 unidades','Salmão, cream cheese e crocância na medida.',29.90,'/assets/sushi.jpg','Combinados'),
('forno-margherita','forno-italia','Margherita do Forno','Massa de fermentação lenta, tomates e manjericão.',58.90,'/assets/hero.jpg','Pizzas'),
('cantina-burger','cantina-urbana','Burger da Cantina','Carne na brasa, queijo e salada fresca.',28.90,'/assets/burger.jpg','Lanches'),
('chef-pizza','pizza-chef','Especial do Chef','Mussarela, calabresa artesanal e cebola caramelizada.',62.90,'/assets/pizza.jpg','Pizzas')
ON CONFLICT DO NOTHING;
INSERT INTO store_settings(restaurant_id,data) VALUES ('bella-massa','{"name":"Pizzaria Bella Massa","description":"A combinação perfeita entre ingredientes selecionados e massa artesanal.","fee":6,"minimum":20,"minutes":25,"open":true,"address":"Rua Santos Dumont, Centro, Ibiporã — PR","hours":"Terça a domingo • 18h às 23h"}') ON CONFLICT DO NOTHING;
