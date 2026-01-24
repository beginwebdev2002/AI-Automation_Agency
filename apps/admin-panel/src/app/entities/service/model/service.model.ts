export interface Service {
  id: string;
  name: string;
  category: 'Laser' | 'Injectables' | 'Facials';
  price: number;
}

export const MOCK_SERVICES: Service[] = [
  // Laser
  { id: 'l_w_1', name: 'Лазер: Верхняя губа', category: 'Laser', price: 40 },
  { id: 'l_w_2', name: 'Лазер: Подбородок', category: 'Laser', price: 40 },
  { id: 'l_w_3', name: 'Лазер: Бакенбарды', category: 'Laser', price: 40 },
  { id: 'l_w_4', name: 'Лазер: Межбровье', category: 'Laser', price: 90 },
  { id: 'l_w_5', name: 'Лазер: Лоб', category: 'Laser', price: 60 },
  { id: 'l_w_6', name: 'Лазер: Лицо полностью', category: 'Laser', price: 140 },
  { id: 'l_w_7', name: 'Лазер: Подмышки', category: 'Laser', price: 90 },
  { id: 'l_w_8', name: 'Лазер: Руки до локтя', category: 'Laser', price: 100 },

  // Injectables
  {
    id: 'i_botox_1',
    name: 'Ботокс: Лоб',
    category: 'Injectables',
    price: 1200,
  },
  {
    id: 'i_botox_2',
    name: 'Ботокс: Межбровье',
    category: 'Injectables',
    price: 1200,
  },
  {
    id: 'i_botox_3',
    name: 'Ботокс: Глаза ("Гусиные лапки")',
    category: 'Injectables',
    price: 1200,
  },
  {
    id: 'i_bio_1',
    name: 'Биоревитализация: Лицо (Basic)',
    category: 'Injectables',
    price: 1200,
  },
  {
    id: 'i_bio_2',
    name: 'Биоревитализация: Лицо (Premium)',
    category: 'Injectables',
    price: 2500,
  },
  {
    id: 'i_plasm_1',
    name: 'Плазмолифтинг (PRP)',
    category: 'Injectables',
    price: 250,
  },

  // Facials
  {
    id: 'f_1',
    name: 'Чистка лица "12 этапов"',
    category: 'Facials',
    price: 150,
  },
  { id: 'f_2', name: 'Пилинг PRX-T33', category: 'Facials', price: 450 },
  { id: 'f_3', name: 'Карбокситерапия', category: 'Facials', price: 200 },
  { id: 'f_4', name: 'Массаж лица', category: 'Facials', price: 100 },
  { id: 'f_5', name: 'Альгинатная маска', category: 'Facials', price: 50 },
];
