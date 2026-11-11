import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyState from '../../../../src/components/states/EmptyState';

describe('EmptyState', () => {
  it('AC-09: mostra o título "Nenhuma cidade encontrada" e uma dica', () => {
    render(<EmptyState />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Nenhuma cidade encontrada' }),
    ).toBeVisible();
    expect(screen.getByText('Confira a grafia ou tente buscar por outro nome.')).toBeVisible();
  });

  it('AC-09: não oferece "Tentar novamente", porque ausência de resultado não é erro', () => {
    render(<EmptyState />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('RNF-03: anuncia o resultado vazio como status', () => {
    render(<EmptyState />);

    expect(screen.getByRole('status')).toHaveTextContent('Nenhuma cidade encontrada');
  });
});
