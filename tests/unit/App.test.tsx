import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/App';

function setup() {
  return { user: userEvent.setup(), ...render(<App />) };
}

const preview = () => screen.getByRole('complementary', { name: /Pré-visualizar estados/ });
const goTo = (user: ReturnType<typeof userEvent.setup>, label: string) =>
  user.click(within(preview()).getByRole('button', { name: label }));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('monta o cabeçalho com marca, busca e unidade, e o rodapé de atribuição', () => {
    setup();

    const header = screen.getByRole('banner');

    expect(within(header).getByRole('heading', { level: 1, name: /Weather App/ })).toBeVisible();
    expect(within(header).getByRole('search')).toBeVisible();
    expect(within(header).getByRole('group', { name: 'Unidade de temperatura' })).toBeVisible();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Open-Meteo.com');
  });

  it('AC-06: começa em Celsius, sem cidade, com orientação para buscar', () => {
    setup();

    expect(screen.getByRole('button', { name: /Celsius/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: 'Busque uma cidade' })).toBeVisible();
    expect(screen.queryByText('São Paulo')).toBeNull();
  });

  it('alterna entre idle, loading, empty, error e success', async () => {
    const { user } = setup();

    await goTo(user, 'Carregando');
    expect(screen.getByRole('status')).toHaveTextContent('Carregando clima…');

    await goTo(user, 'Vazio');
    expect(screen.getByRole('heading', { name: 'Nenhuma cidade encontrada' })).toBeVisible();

    await goTo(user, 'Erro');
    expect(screen.getByRole('alert')).toBeVisible();

    await goTo(user, 'Sucesso');
    expect(screen.getByRole('heading', { level: 2, name: 'Clima atual' })).toBeVisible();

    await goTo(user, 'Inicial');
    expect(screen.getByRole('heading', { name: 'Busque uma cidade' })).toBeVisible();
  });

  it('mostra o clima do mock ao buscar uma cidade', async () => {
    const { user } = setup();

    await user.type(screen.getByRole('searchbox'), 'São Paulo{Enter}');

    expect(screen.getByText('20,0 °C')).toBeVisible();
    const current = within(screen.getByRole('region', { name: 'Clima atual' }));
    expect(current.getByText('Nublado')).toBeVisible();
    expect(within(screen.getByRole('list')).getAllByRole('listitem')).toHaveLength(5);
  });

  it('AC-05: troca a unidade e converte todas as temperaturas sem requisição', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const { user } = setup();
    await goTo(user, 'Sucesso');

    await user.click(screen.getByRole('button', { name: /Fahrenheit/ }));

    expect(screen.getByText('68,0 °F')).toBeVisible();
    expect(within(screen.getByRole('main')).queryByText(/°C/)).toBeNull();
    expect(screen.getByRole('button', { name: /Fahrenheit/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: /Celsius/ }));

    expect(screen.getByText('20,0 °C')).toBeVisible();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('mantém a unidade escolhida ao trocar de estado', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: /Fahrenheit/ }));
    await goTo(user, 'Sucesso');

    expect(screen.getByText('68,0 °F')).toBeVisible();
  });

  it('AC-10: "Tentar novamente" sai do estado de erro', async () => {
    const { user } = setup();
    await goTo(user, 'Erro');

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Clima atual' })).toBeVisible();
  });

  it('WCAG 2.4.3: move o foco para o conteúdo quando "Tentar novamente" some da tela', async () => {
    const { user } = setup();
    await goTo(user, 'Erro');

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('mantém a busca utilizável enquanto carrega', async () => {
    const { user } = setup();

    await goTo(user, 'Carregando');

    expect(screen.getByRole('searchbox')).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeEnabled();
  });

  it('RNF-03: anuncia o resultado e a troca de unidade em uma região ativa', async () => {
    const { user, container } = setup();
    const liveRegion = () => container.querySelector('div[aria-live="polite"].sr-only');

    expect(liveRegion()).toBeEmptyDOMElement();

    await goTo(user, 'Sucesso');
    expect(liveRegion()).toHaveTextContent('Clima de São Paulo exibido em Celsius.');

    await user.click(screen.getByRole('button', { name: /Fahrenheit/ }));
    expect(liveRegion()).toHaveTextContent('Clima de São Paulo exibido em Fahrenheit.');
  });
});
