-- Gerado a partir de Tabela de preços 2026.xlsx
delete from price_values;
delete from price_procedures;
delete from price_units;

insert into price_units (key, name, location, sort_order) values
  ('lux', 'Hospital Luxemburgo (LUX BH)', 'Belo Horizonte', 1),
  ('cac', 'Hospital Bom Samaritano (CAC GV)', 'Governador Valadares', 2)
on conflict (key) do update set name = excluded.name, location = excluded.location;

-- Aortografia (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Aortografia', 'Cateterismo da veia aorta', null, '4.08.12.03-0, Angiografia por cateterismo não seletivo de grande vaso', false, 1)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 147000, 'R$ 1.470,00'),
  ('Social', 'parcelado', 170000, 'R$ 1.700,00'),
  ('Clínicas', 'avista', 181500, 'R$ 1.815,00'),
  ('Clínicas', 'parcelado', 217800, 'R$ 2.178,00'),
  ('Particular', 'avista', 281500, 'R$ 2.815,00'),
  ('Particular', 'parcelado', 337800, 'R$ 3.378,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Aortografia';

-- Aortografia + Arteriografia de 1 membro (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Aortografia + Arteriografia de 1 membro', null, null, null, false, 2)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 191100, 'R$ 1.911,00'),
  ('Social', 'parcelado', 215000, 'R$ 2.150,00'),
  ('Clínicas', 'avista', 220000, 'R$ 2.200,00'),
  ('Clínicas', 'parcelado', 264000, 'R$ 2.640,00'),
  ('Particular', 'avista', 320000, 'R$ 3.200,00'),
  ('Particular', 'parcelado', 384000, 'R$ 3.840,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Aortografia + Arteriografia de 1 membro';

-- Aortografia + Arteriografia de 2 membros (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Aortografia + Arteriografia de 2 membros', null, null, null, false, 3)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 280000, 'R$ 2.800,00'),
  ('Social', 'parcelado', 300000, 'R$ 3.000,00'),
  ('Clínicas', 'avista', 300000, 'R$ 3.000,00'),
  ('Clínicas', 'parcelado', 380000, 'R$ 3.800,00'),
  ('Particular', 'avista', 400000, 'R$ 4.000,00'),
  ('Particular', 'parcelado', 480000, 'R$ 4.800,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Aortografia + Arteriografia de 2 membros';

-- Arteriografia Hepática (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Arteriografia Hepática', 'Arteriografia Visceral', null, null, false, 4)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 161700, 'R$ 1.617,00'),
  ('Social', 'parcelado', 185000, 'R$ 1.850,00'),
  ('Clínicas', 'avista', 170000, 'R$ 1.700,00'),
  ('Clínicas', 'parcelado', 204000, 'R$ 2.040,00'),
  ('Particular', 'avista', 270000, 'R$ 2.700,00'),
  ('Particular', 'parcelado', 324000, 'R$ 3.240,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Arteriografia Hepática';

-- Arteriografia Periférica de 1 membro (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Arteriografia Periférica de 1 membro', 'Angiografia Periférica de 1 Membro', '4.08.12.04-9', 'Arteriografia por cateterismo seletivo: 4.08.12.04-9', false, 5)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 161700, 'R$ 1.617,00'),
  ('Social', 'parcelado', 185000, 'R$ 1.850,00'),
  ('Clínicas', 'avista', 190000, 'R$ 1.900,00'),
  ('Clínicas', 'parcelado', 228000, 'R$ 2.280,00'),
  ('Particular', 'avista', 290000, 'R$ 2.900,00'),
  ('Particular', 'parcelado', 348000, 'R$ 3.480,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Arteriografia Periférica de 1 membro';

-- Arteriografia periférica de 2 membros (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Arteriografia periférica de 2 membros', 'Angiografia Periférica de 2 Membros', '2 x 4.08.12.04-9', '2 x Arteriografia por cateterismo seletivo: 4.08.12.04-9', false, 6)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 191100, 'R$ 1.911,00'),
  ('Social', 'parcelado', 215000, 'R$ 2.150,00'),
  ('Clínicas', 'avista', 220000, 'R$ 2.200,00'),
  ('Clínicas', 'parcelado', 264000, 'R$ 2.640,00'),
  ('Particular', 'avista', 320000, 'R$ 3.200,00'),
  ('Particular', 'parcelado', 384000, 'R$ 3.840,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Arteriografia periférica de 2 membros';

-- Arteriografia Renal (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Arteriografia Renal', 'Angiografia Renal', null, null, false, 7)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 161700, 'R$ 1.617,00'),
  ('Social', 'parcelado', 185000, 'R$ 1.850,00'),
  ('Clínicas', 'avista', 190000, 'R$ 1.900,00'),
  ('Clínicas', 'parcelado', 228000, 'R$ 2.280,00'),
  ('Particular', 'avista', 290000, 'R$ 2.900,00'),
  ('Particular', 'parcelado', 348000, 'R$ 3.480,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Arteriografia Renal';

-- Arteriografia Tronco Celiaco (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Arteriografia Tronco Celiaco', 'Angiografia Tronco Celiaco', null, null, false, 8)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 161700, 'R$ 1.617,00'),
  ('Social', 'parcelado', 185000, 'R$ 1.850,00'),
  ('Clínicas', 'avista', 190000, 'R$ 1.900,00'),
  ('Clínicas', 'parcelado', 228000, 'R$ 2.280,00'),
  ('Particular', 'avista', 290000, 'R$ 2.900,00'),
  ('Particular', 'parcelado', 348000, 'R$ 3.480,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Arteriografia Tronco Celiaco';

-- Arteriografia Mesentérica (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Arteriografia Mesentérica', null, null, null, false, 9)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 161700, 'R$ 1.617,00'),
  ('Social', 'parcelado', 185000, 'R$ 1.850,00'),
  ('Clínicas', 'avista', 190000, 'R$ 1.900,00'),
  ('Clínicas', 'parcelado', 228000, 'R$ 2.280,00'),
  ('Particular', 'avista', 290000, 'R$ 2.900,00'),
  ('Particular', 'parcelado', 348000, 'R$ 3.480,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Arteriografia Mesentérica';

-- Arteriografia Cerebral (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Arteriografia Cerebral', null, null, null, true, 10)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Arteriografia de Carótidas (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Arteriografia de Carótidas', null, null, null, true, 11)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Cateterismo Cardíaco (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Cateterismo Cardíaco', 'Cinecoronariografia; (ou) Cateterismo das Arterias Coronarias', '02.11.02.001-0', '30911079 - Cateterismo cardíaco E e/ou D com cineangiocoronariografia e ventriculografia.', false, 12)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 147000, 'R$ 1.470,00'),
  ('Social', 'parcelado', 170000, 'R$ 1.700,00'),
  ('Clínicas', 'avista', 180000, 'R$ 1.800,00'),
  ('Clínicas', 'parcelado', 216000, 'R$ 2.160,00'),
  ('Particular', 'avista', 280000, 'R$ 2.800,00'),
  ('Particular', 'parcelado', 336000, 'R$ 3.360,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Cateterismo Cardíaco';

-- Cateterismo cardíaco com estudo de pontes (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Cateterismo cardíaco com estudo de pontes', 'Cinecoronariografia + Estudo de pontes', '02.11.02.001-0', null, false, 13)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 176400, 'R$ 1.764,00'),
  ('Social', 'parcelado', 190000, 'R$ 1.900,00'),
  ('Clínicas', 'avista', 200000, 'R$ 2.000,00'),
  ('Clínicas', 'parcelado', 240000, 'R$ 2.400,00'),
  ('Particular', 'avista', 300000, 'R$ 3.000,00'),
  ('Particular', 'parcelado', 360000, 'R$ 3.600,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Cateterismo cardíaco com estudo de pontes';

-- Cateterismo de Veia Central (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Cateterismo de Veia Central', null, '02.11.02.001-0', null, false, 14)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 147000, 'R$ 1.470,00'),
  ('Social', 'parcelado', 170000, 'R$ 1.700,00'),
  ('Clínicas', 'avista', 181500, 'R$ 1.815,00'),
  ('Clínicas', 'parcelado', 217800, 'R$ 2.178,00'),
  ('Particular', 'avista', 281500, 'R$ 2.815,00'),
  ('Particular', 'parcelado', 337800, 'R$ 3.378,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Cateterismo de Veia Central';

-- Angioplastia sem stent (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Angioplastia sem stent', 'Angioplastia de arteria coronariana por balão', '04.06.03.001-4', '30912032', false, 15)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 1350000, 'R$ 13.500,00'),
  ('Particular', 'avista', 1500000, 'R$ 15.000,00'),
  ('Particular', 'parcelado', 1800000, 'R$ 18.000,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Angioplastia sem stent';

-- Angioplastia com um stent (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Angioplastia com um stent', 'Angioplastia de arteria coronariana com uso de um stent', '04.06.03.003-0', null, false, 16)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 1620000, 'R$ 16.200,00'),
  ('Particular', 'avista', 1800000, 'R$ 18.000,00'),
  ('Particular', 'parcelado', 2160000, 'R$ 21.600,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Angioplastia com um stent';

-- Angioplastia com dois stents (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Angioplastia com dois stents', 'Angioplastia de arteria coronariana com uso de dois stents', '04.06.03.002-2', null, false, 17)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 1890000, 'R$ 18.900,00'),
  ('Particular', 'avista', 2100000, 'R$ 21.000,00'),
  ('Particular', 'parcelado', 2520000, 'R$ 25.200,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Angioplastia com dois stents';

-- Angioplastia com tres stents (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Angioplastia com tres stents', 'Angioplastia de arteria coronariana com uso de tres stents', null, null, false, 18)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 2160000, 'R$ 21.600,00'),
  ('Particular', 'avista', 2400000, 'R$ 24.000,00'),
  ('Particular', 'parcelado', 2880000, 'R$ 28.800,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'lux' and pr.name = 'Angioplastia com tres stents';

-- Angioplastia periférica (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Angioplastia periférica', 'Angioplastia de arteria periférica', '07.02.04.007-0', null, true, 19)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- TAVI (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'TAVI', 'Implante Transcateter de Válvula Aórtica', null, null, true, 20)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Estudo eletrofisiológico (EEF) (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Estudo eletrofisiológico (EEF)', null, null, null, true, 21)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Ablação (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Ablação', null, null, null, true, 22)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Crioablação (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Crioablação', null, null, null, true, 23)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Valvuloplastia (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Valvuloplastia', null, null, null, true, 24)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Endoprotese (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Endoprotese', 'Correção de aneurisma', null, null, true, 25)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Oclusão de shunts intracardiacos (CIA) (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Oclusão de shunts intracardiacos (CIA)', 'fechamento percutâneo de Comunicação Interatrial (CIA)', null, null, true, 26)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Implante de filtro de veia cava (lux)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('lux', 'Implante de filtro de veia cava', null, null, null, true, 27)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Aortografia (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Aortografia', 'Cateterismo da veia aorta', null, '4.08.12.03-0, Angiografia por cateterismo não seletivo de grande vaso', false, 28)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 240000, 'R$ 2.400,00'),
  ('Social', 'parcelado', 298500, 'R$ 2.985,00'),
  ('Parcerias', 'avista', 255000, 'R$ 2.550,00'),
  ('Parcerias', 'parcelado', 313700, 'R$ 3.137,00'),
  ('Particular balcão', 'avista', 270000, 'R$ 2.700,00'),
  ('Particular balcão', 'parcelado', 300000, 'R$ 3.000,00'),
  ('GCR', 'avista', 235000, 'R$ 2.350,00'),
  ('GCR', 'parcelado', 298500, 'R$ 2.985,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Aortografia';

-- Aortografia + Arteriografia de 1 membro (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Aortografia + Arteriografia de 1 membro', null, null, null, true, 29)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Aortografia + Arteriografia de 2 membros (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Aortografia + Arteriografia de 2 membros', null, null, null, true, 30)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Arteriografia Hepática (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Arteriografia Hepática', 'Arteriografia Visceral', null, null, false, 31)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 264000, 'R$ 2.640,00'),
  ('Social', 'parcelado', 324800, 'R$ 3.248,00'),
  ('Parcerias', 'avista', 280500, 'R$ 2.805,00'),
  ('Parcerias', 'parcelado', 345100, 'R$ 3.451,00'),
  ('Particular balcão', 'avista', 297000, 'R$ 2.970,00'),
  ('Particular balcão', 'parcelado', 330000, 'R$ 3.300,00'),
  ('GCR', 'avista', 247500, 'R$ 2.475,00'),
  ('GCR', 'parcelado', 314400, 'R$ 3.144,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Arteriografia Hepática';

-- Arteriografia Periférica de 1 membro (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Arteriografia Periférica de 1 membro', 'Angiografia Periférica de 1 Membro', '4.08.12.04-9', 'Arteriografia por cateterismo seletivo: 4.08.12.04-9', false, 32)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 264000, 'R$ 2.640,00'),
  ('Social', 'parcelado', 324800, 'R$ 3.248,00'),
  ('Parcerias', 'avista', 280500, 'R$ 2.805,00'),
  ('Parcerias', 'parcelado', 345100, 'R$ 3.451,00'),
  ('Particular balcão', 'avista', 297000, 'R$ 2.970,00'),
  ('Particular balcão', 'parcelado', 330000, 'R$ 3.300,00'),
  ('GCR', 'avista', 247500, 'R$ 2.475,00'),
  ('GCR', 'parcelado', 314400, 'R$ 3.144,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Arteriografia Periférica de 1 membro';

-- Arteriografia periférica de 2 membros (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Arteriografia periférica de 2 membros', 'Angiografia Periférica de 2 Membros', '2 x 4.08.12.04-9', '2 x Arteriografia por cateterismo seletivo: 4.08.12.04-9', false, 33)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 312000, 'R$ 3.120,00'),
  ('Social', 'parcelado', 383800, 'R$ 3.838,00'),
  ('Parcerias', 'avista', 331500, 'R$ 3.315,00'),
  ('Parcerias', 'parcelado', 407800, 'R$ 4.078,00'),
  ('Particular balcão', 'avista', 351000, 'R$ 3.510,00'),
  ('Particular balcão', 'parcelado', 390000, 'R$ 3.900,00'),
  ('GCR', 'avista', 292500, 'R$ 2.925,00'),
  ('GCR', 'parcelado', 371500, 'R$ 3.715,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Arteriografia periférica de 2 membros';

-- Arteriografia Renal (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Arteriografia Renal', 'Angiografia Renal', null, null, false, 34)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 264000, 'R$ 2.640,00'),
  ('Social', 'parcelado', 324800, 'R$ 3.248,00'),
  ('Parcerias', 'avista', 280500, 'R$ 2.805,00'),
  ('Parcerias', 'parcelado', 345100, 'R$ 3.451,00'),
  ('Particular balcão', 'avista', 297000, 'R$ 2.970,00'),
  ('Particular balcão', 'parcelado', 330000, 'R$ 3.300,00'),
  ('GCR', 'avista', 247500, 'R$ 2.475,00'),
  ('GCR', 'parcelado', 314400, 'R$ 3.144,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Arteriografia Renal';

-- Arteriografia Tronco Celiaco (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Arteriografia Tronco Celiaco', 'Angiografia Tronco Celiaco', null, null, false, 35)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 264000, 'R$ 2.640,00'),
  ('Social', 'parcelado', 324800, 'R$ 3.248,00'),
  ('Parcerias', 'avista', 280500, 'R$ 2.805,00'),
  ('Parcerias', 'parcelado', 345100, 'R$ 3.451,00'),
  ('Particular balcão', 'avista', 297000, 'R$ 2.970,00'),
  ('Particular balcão', 'parcelado', 330000, 'R$ 3.300,00'),
  ('GCR', 'avista', 247500, 'R$ 2.475,00'),
  ('GCR', 'parcelado', 314400, 'R$ 3.144,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Arteriografia Tronco Celiaco';

-- Arteriografia Mesentérica (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Arteriografia Mesentérica', 'Angiografia Mesetérica', null, null, false, 36)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 264000, 'R$ 2.640,00'),
  ('Social', 'parcelado', 324800, 'R$ 3.248,00'),
  ('Parcerias', 'avista', 280500, 'R$ 2.805,00'),
  ('Parcerias', 'parcelado', 345100, 'R$ 3.451,00'),
  ('Particular balcão', 'avista', 397000, 'R$ 3.970,00'),
  ('Particular balcão', 'parcelado', 330000, 'R$ 3.300,00'),
  ('GCR', 'avista', 247500, 'R$ 2.475,00'),
  ('GCR', 'parcelado', 314400, 'R$ 3.144,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Arteriografia Mesentérica';

-- Arteriografia Cerebral (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Arteriografia Cerebral', null, null, null, false, 37)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 312000, 'R$ 3.120,00'),
  ('Social', 'parcelado', 383800, 'R$ 3.838,00'),
  ('Parcerias', 'avista', 331500, 'R$ 3.315,00'),
  ('Parcerias', 'parcelado', 407800, 'R$ 4.078,00'),
  ('Particular balcão', 'avista', 351000, 'R$ 3.510,00'),
  ('Particular balcão', 'parcelado', 390000, 'R$ 3.900,00'),
  ('GCR', 'avista', 292500, 'R$ 2.925,00'),
  ('GCR', 'parcelado', 371500, 'R$ 3.715,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Arteriografia Cerebral';

-- Arteriografia de Carótidas (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Arteriografia de Carótidas', null, null, null, false, 38)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 288000, 'R$ 2.880,00'),
  ('Social', 'parcelado', 354300, 'R$ 3.543,00'),
  ('Parcerias', 'avista', 306000, 'R$ 3.060,00'),
  ('Parcerias', 'parcelado', 376400, 'R$ 3.764,00'),
  ('Particular balcão', 'avista', 324000, 'R$ 3.240,00'),
  ('Particular balcão', 'parcelado', 360000, 'R$ 3.600,00'),
  ('GCR', 'avista', 270000, 'R$ 2.700,00'),
  ('GCR', 'parcelado', 342900, 'R$ 3.429,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Arteriografia de Carótidas';

-- Cateterismo Cardíaco (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Cateterismo Cardíaco', 'Cinecoronariografia; (ou) Cateterismo das Arterias Coronarias', '02.11.02.001-0', '30911079 - Cateterismo cardíaco E e/ou D com cineangiocoronariografia e ventriculografia.', false, 39)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 240000, 'R$ 2.400,00'),
  ('Social', 'parcelado', 298500, 'R$ 2.985,00'),
  ('Parcerias', 'avista', 255000, 'R$ 2.550,00'),
  ('Parcerias', 'parcelado', 313700, 'R$ 3.137,00'),
  ('Particular balcão', 'avista', 270000, 'R$ 2.700,00'),
  ('Particular balcão', 'parcelado', 300000, 'R$ 3.000,00'),
  ('GCR', 'avista', 235000, 'R$ 2.350,00'),
  ('GCR', 'parcelado', 298500, 'R$ 2.985,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Cateterismo Cardíaco';

-- Cateterismo cardíaco com estudo de pontes (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Cateterismo cardíaco com estudo de pontes', 'Cinecoronariografia + Estudo de pontes', '02.11.02.001-0', null, false, 40)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 288000, 'R$ 2.880,00'),
  ('Social', 'parcelado', 354300, 'R$ 3.543,00'),
  ('Parcerias', 'avista', 306000, 'R$ 3.060,00'),
  ('Parcerias', 'parcelado', 376400, 'R$ 3.764,00'),
  ('Particular balcão', 'avista', 324000, 'R$ 3.240,00'),
  ('Particular balcão', 'parcelado', 360000, 'R$ 3.600,00'),
  ('GCR', 'avista', 270000, 'R$ 2.700,00'),
  ('GCR', 'parcelado', 342900, 'R$ 3.429,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Cateterismo cardíaco com estudo de pontes';

-- Cateterismo de Veia Central (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Cateterismo de Veia Central', null, '02.11.02.001-0', null, false, 41)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 240000, 'R$ 2.400,00'),
  ('Social', 'parcelado', 298500, 'R$ 2.985,00'),
  ('Parcerias', 'avista', 255000, 'R$ 2.550,00'),
  ('Parcerias', 'parcelado', 313700, 'R$ 3.137,00'),
  ('Particular balcão', 'avista', 270000, 'R$ 2.700,00'),
  ('Particular balcão', 'parcelado', 300000, 'R$ 3.000,00'),
  ('GCR', 'avista', 235000, 'R$ 2.350,00'),
  ('GCR', 'parcelado', 298500, 'R$ 2.985,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Cateterismo de Veia Central';

-- Angioplastia sem stent (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Angioplastia sem stent', 'Angioplastia de arteria coronariana por balão', '04.06.03.001-4', '30912032', false, 42)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 1777500, 'R$ 17.775,00'),
  ('Social', 'parcelado', 2186400, 'R$ 21.864,00'),
  ('Parcerias', 'avista', 1777500, 'R$ 17.775,00'),
  ('Parcerias', 'parcelado', 2186400, 'R$ 21.864,00'),
  ('Particular balcão', 'avista', 1777500, 'R$ 17.775,00'),
  ('Particular balcão', 'parcelado', 2186400, 'R$ 21.864,00'),
  ('GCR', 'avista', 1777500, 'R$ 17.775,00'),
  ('GCR', 'parcelado', 2186400, 'R$ 21.864,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Angioplastia sem stent';

-- Angioplastia com um stent (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Angioplastia com um stent', 'Angioplastia de arteria coronariana com uso de um stent', '04.06.03.003-0', null, false, 43)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 2225300, 'R$ 22.253,00'),
  ('Social', 'parcelado', 2737200, 'R$ 27.372,00'),
  ('Parcerias', 'avista', 2225250, 'R$ 22.252,50'),
  ('Parcerias', 'parcelado', 2737200, 'R$ 27.372,00'),
  ('Particular balcão', 'avista', 2225250, 'R$ 22.252,50'),
  ('Particular balcão', 'parcelado', 2737200, 'R$ 27.372,00'),
  ('GCR', 'avista', 2225300, 'R$ 22.253,00'),
  ('GCR', 'parcelado', 2737200, 'R$ 27.372,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Angioplastia com um stent';

-- Angioplastia com dois stents (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Angioplastia com dois stents', 'Angioplastia de arteria coronariana com uso de dois stents', '04.06.03.002-2', null, false, 44)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 2717600, 'R$ 27.176,00'),
  ('Social', 'parcelado', 3342700, 'R$ 33.427,00'),
  ('Parcerias', 'avista', 2717775, 'R$ 27.177,75'),
  ('Parcerias', 'parcelado', 3342700, 'R$ 33.427,00'),
  ('Particular balcão', 'avista', 2717775, 'R$ 27.177,75'),
  ('Particular balcão', 'parcelado', 3342700, 'R$ 33.427,00'),
  ('GCR', 'avista', 2717600, 'R$ 27.176,00'),
  ('GCR', 'parcelado', 3342700, 'R$ 33.427,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Angioplastia com dois stents';

-- Angioplastia com tres stents (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Angioplastia com tres stents', 'Angioplastia de arteria coronariana com uso de tres stents', null, null, false, 45)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
insert into price_values (procedure_id, table_name, payment_mode, value_cents, value_display)
select pr.id, v.table_name, v.payment_mode, v.value_cents, v.value_display
from price_procedures pr
cross join lateral (values
  ('Social', 'avista', 3259600, 'R$ 32.596,00'),
  ('Social', 'parcelado', 4009300, 'R$ 40.093,00'),
  ('Parcerias', 'avista', 3259553, 'R$ 32.595,53'),
  ('Parcerias', 'parcelado', 4009300, 'R$ 40.093,00'),
  ('Particular balcão', 'avista', 3259553, 'R$ 32.595,53'),
  ('Particular balcão', 'parcelado', 4009300, 'R$ 40.093,00'),
  ('GCR', 'avista', 3259600, 'R$ 32.596,00'),
  ('GCR', 'parcelado', 4009300, 'R$ 40.093,00')
) as v(table_name, payment_mode, value_cents, value_display)
where pr.unit_key = 'cac' and pr.name = 'Angioplastia com tres stents';

-- Angioplastia periférica (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Angioplastia periférica', 'Angioplastia de arteria periférica', '07.02.04.007-0', null, true, 46)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- TAVI (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'TAVI', 'Implante Transcateter de Válvula Aórtica', null, null, true, 47)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Estudo eletrofisiológico (EEF) (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Estudo eletrofisiológico (EEF)', null, null, null, true, 48)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Ablação (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Ablação', null, null, null, true, 49)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Crioablação (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Crioablação', null, null, null, true, 50)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Valvuloplastia (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Valvuloplastia', null, null, null, true, 51)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Endoprotese (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Endoprotese', 'Correção de aneurisma', null, null, true, 52)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Oclusão de shunts intracardiacos (CIA) (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Oclusão de shunts intracardiacos (CIA)', 'fechamento percutâneo de Comunicação Interatrial (CIA)', null, null, true, 53)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- Implante de filtro de veia cava (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', 'Implante de filtro de veia cava', null, null, null, true, 54)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;

-- *Observação: Os valores dos procedimentos não incluem diárias de CTI e nem de internação (cac)
insert into price_procedures (unit_key, name, synonyms, sigtap_code, tuss_code, requires_quote, sort_order)
values ('cac', '*Observação: Os valores dos procedimentos não incluem diárias de CTI e nem de internação', null, null, null, true, 55)
on conflict (unit_key, name) do update set synonyms = excluded.synonyms, sigtap_code = excluded.sigtap_code, tuss_code = excluded.tuss_code, requires_quote = excluded.requires_quote, sort_order = excluded.sort_order;
