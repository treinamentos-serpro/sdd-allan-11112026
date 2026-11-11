import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import IdleState from '../../../../src/components/states/IdleState';

describe('IdleState', () => {
  it('AC-06: orienta a buscar uma cidade, sem alerta nem botão', () => {
    render(<IdleState />);

    expect(screen.getByRole('heading', { level: 2, name: 'Busque uma cidade' })).toBeVisible();
    expect(screen.getByText(/próximos 5 dias/)).toBeVisible();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
