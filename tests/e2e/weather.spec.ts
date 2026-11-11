import { expect, type Page, test } from '@playwright/test';

async function mockWeatherRequests(page: Page) {
  await page.route('https://geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({
      json: {
        results: [
          {
            id: 3390760,
            name: 'Recife',
            country: 'Brasil',
            admin1: 'Pernambuco',
            latitude: -8.05,
            longitude: -34.9,
          },
        ],
      },
    });
  });

  await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({
      json: {
        timezone: 'America/Recife',
        current: {
          time: '2026-11-11T18:45',
          temperature_2m: 0,
          weather_code: 0,
        },
        daily: {
          time: ['2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'],
          weather_code: [0, 1, 2, 3, 61],
          temperature_2m_min: [0, 1, 2, 3, 4],
          temperature_2m_max: [5, 6, 7, 8, 9],
        },
      },
    });
  });
}

test('busca uma cidade, exibe a previsão e converte a temperatura para Fahrenheit', async ({
  page,
}) => {
  await mockWeatherRequests(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('Recife');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByText('Recife', { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Previsão para 5 dias' })).toBeVisible();

  await page.getByRole('button', { name: /°F Fahrenheit/ }).click();

  await expect(page.getByRole('region', { name: 'Clima atual' })).toContainText('32,0 °F');
});

test('AC-09: informa quando a busca não encontra cidades', async ({ page }) => {
  let forecastRequests = 0;
  await page.route('https://geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({ json: {} });
  });
  await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
    forecastRequests += 1;
    await route.abort();
  });

  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Buscar cidade' });
  await search.fill('Cidade inexistente');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();
  await expect(search).toHaveValue('Cidade inexistente');
  expect(forecastRequests).toBe(0);
});

for (const failure of [
  { description: 'HTTP 503', response: { status: 503, json: { error: true } } },
  {
    description: 'resposta parcial',
    response: { json: { timezone: 'America/Recife', current: { temperature_2m: 0 } } },
  },
]) {
  test(`AC-10: mostra erro recuperável para ${failure.description} sem dados parciais`, async ({
    page,
  }) => {
    await mockWeatherRequests(page);
    const forecastUrls: string[] = [];
    await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
      forecastUrls.push(route.request().url());
      if (forecastUrls.length === 1) {
        await route.fulfill(failure.response);
      } else {
        await route.fallback();
      }
    });

    await page.goto('/');
    await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('Recife');
    await page.getByRole('button', { name: 'Buscar' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Clima atual' })).toHaveCount(0);
    await expect(page.getByRole('region', { name: 'Previsão para 5 dias' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Tentar novamente' }).click();
    await expect(page.getByRole('region', { name: 'Clima atual' })).toContainText('0,0 °C');
    expect(forecastUrls).toHaveLength(2);
    expect(forecastUrls[1]).toBe(forecastUrls[0]);
  });
}

test('renderiza clima e previsão no viewport mobile de 375 × 812', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockWeatherRequests(page);

  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar cidade' }).fill('Recife');
  await page.getByRole('button', { name: 'Buscar' }).click();

  const currentWeather = page.getByRole('region', { name: 'Clima atual' });
  await expect(currentWeather).toBeVisible();
  await expect(currentWeather.getByText('Recife', { exact: true })).toBeVisible();
  await expect(currentWeather).toContainText('0,0 °C');
  await expect(currentWeather.getByText('Céu limpo')).toBeVisible();
  const forecast = page.getByRole('region', { name: 'Previsão para 5 dias' });
  await expect(forecast).toBeVisible();
  await expect(forecast.getByRole('listitem')).toHaveCount(5);

  await page.getByRole('button', { name: /°F Fahrenheit/ }).click();
  await expect(currentWeather).toContainText('32,0 °F');
});
