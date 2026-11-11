import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoadingState from '../../../../src/components/states/LoadingState';

describe('LoadingState', () => {
  it('RNF-03: anuncia o carregamento como status educado, com texto padrão', () => {
    render(<LoadingState />);

    const status = screen.getByRole('status');

    expect(status).toHaveTextContent('Carregando…');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('aceita um texto específico', () => {
    render(<LoadingState label="Buscando cidades…" />);

    expect(screen.getByRole('status')).toHaveTextContent('Buscando cidades…');
  });

  it('não usa role="alert" e esconde o indicador visual dos leitores de tela', () => {
    const { container } = render(<LoadingState />);

    expect(screen.queryByRole('alert')).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
