import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ErrorState from '../../../../src/components/states/ErrorState';

function setup(message = 'Não foi possível consultar o clima.') {
  const onRetry = vi.fn();
  render(<ErrorState message={message} onRetry={onRetry} />);
  return { onRetry, user: userEvent.setup() };
}

describe('ErrorState', () => {
  it('AC-10: anuncia a mensagem com role="alert" e oferece "Tentar novamente"', () => {
    setup();

    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível consultar o clima.');
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  });

  it('AC-10: chama onRetry exatamente uma vez ao clicar', async () => {
    const { onRetry, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('aciona o botão pelo teclado, com Tab, Enter e Espaço', async () => {
    const { onRetry, user } = setup();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it('RNF-09: renderiza a mensagem como texto, sem interpretar HTML', () => {
    setup('<img src=x onerror=alert(1)>');

    expect(screen.getByRole('alert')).toHaveTextContent('<img src=x onerror=alert(1)>');
    expect(screen.queryByRole('img')).toBeNull();
  });
});
