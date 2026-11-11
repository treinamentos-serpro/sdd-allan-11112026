import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from '../../../src/components/SearchBar';

function setup(props: { disabled?: boolean } = {}) {
  const onSearch = vi.fn();
  render(<SearchBar onSearch={onSearch} {...props} />);
  return { onSearch, user: userEvent.setup() };
}

describe('SearchBar', () => {
  it('expõe a região de busca e o campo com nome acessível', () => {
    setup();

    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Buscar cidade' })).toBeInTheDocument();
    expect(screen.getByLabelText('Buscar cidade')).toBe(screen.getByRole('searchbox'));
  });

  it('envia o termo sem espaços nas pontas ao pressionar Enter', async () => {
    const { onSearch, user } = setup();

    await user.type(screen.getByRole('searchbox'), '  São Paulo  {Enter}');

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });

  it('envia o termo ao clicar no botão', async () => {
    const { onSearch, user } = setup();

    await user.type(screen.getByRole('searchbox'), 'Berlin');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('Berlin');
  });

  it('não dispara busca com o campo vazio', async () => {
    const { onSearch, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    await user.type(screen.getByRole('searchbox'), '{Enter}');

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('não dispara busca com o campo só de espaços', async () => {
    const { onSearch, user } = setup();

    await user.type(screen.getByRole('searchbox'), '   {Enter}');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('desabilita campo e botão com disabled e não dispara busca', async () => {
    const { onSearch, user } = setup({ disabled: true });

    expect(screen.getByRole('searchbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('mantém o texto digitado após a busca', async () => {
    const { user } = setup();

    await user.type(screen.getByRole('searchbox'), 'Recife{Enter}');

    expect(screen.getByRole('searchbox')).toHaveValue('Recife');
  });
});
