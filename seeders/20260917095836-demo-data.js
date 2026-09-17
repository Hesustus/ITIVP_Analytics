'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Пользователи
    await queryInterface.bulkInsert('users', [
      { email: 'ivan@mail.ru',  name: 'Иван',  created_at: now },
      { email: 'anna@mail.ru',  name: 'Анна',  created_at: now },
      { email: 'petr@mail.ru',  name: 'Пётр',  created_at: now }
    ], {});

    // 2. Сайты
    await queryInterface.bulkInsert('sites', [
      { name: 'Мой блог',    domain: 'blog.ru',    created_at: now },
      { name: 'Магазин',     domain: 'shop.ru',    created_at: now },
      { name: 'Лендинг',     domain: 'landing.ru', created_at: now }
    ], {});

    // 3. Связи M2M: user ↔ site
    await queryInterface.bulkInsert('site_users', [
      { user_id: 1, site_id: 1, added_at: now },
      { user_id: 1, site_id: 2, added_at: now },
      { user_id: 2, site_id: 2, added_at: now },
      { user_id: 3, site_id: 3, added_at: now }
    ], {});

    // 4. Визиты
    await queryInterface.bulkInsert('visits', [
      {
        site_id: 1,
        visitor_id: 'v-001',
        page_url: '/',
        referrer: 'https://google.com',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0)',
        visited_at: now
      },
      {
        site_id: 1,
        visitor_id: 'v-002',
        page_url: '/blog',
        referrer: 'https://yandex.ru',
        user_agent: 'Mozilla/5.0 (iPhone)',
        visited_at: now
      },
      {
        site_id: 2,
        visitor_id: 'v-003',
        page_url: '/catalog',
        referrer: null,
        user_agent: 'Googlebot/2.1',
        visited_at: now
      }
    ], {});

    // 5. События
    await queryInterface.bulkInsert('events', [
      { visit_id: 1, event_name: 'page_view', page_url: '/',       element: null,      created_at: now },
      { visit_id: 1, event_name: 'click',     page_url: '/',       element: 'buy-btn', created_at: now },
      { visit_id: 2, event_name: 'page_view', page_url: '/blog',   element: null,      created_at: now },
      { visit_id: 2, event_name: 'click',     page_url: '/blog',   element: 'read-more', created_at: now },
      { visit_id: 3, event_name: 'page_view', page_url: '/catalog', element: null,     created_at: now }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Обратный порядок из-за FK
    await queryInterface.bulkDelete('events', null, {});
    await queryInterface.bulkDelete('visits', null, {});
    await queryInterface.bulkDelete('site_users', null, {});
    await queryInterface.bulkDelete('sites', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};