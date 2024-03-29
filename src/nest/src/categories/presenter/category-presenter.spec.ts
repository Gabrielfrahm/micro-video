import { instanceToPlain } from 'class-transformer';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './category-presenter';

import { PaginationPresenter } from '../../@share/presenters/pagination.presenter';

describe('category presenter unit test', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: 'd83a0533-5098-463c-8519-fe51864a6c05',
        name: 'Movie',
        description: 'some description',
        is_active: true,
        created_at,
      });
      expect(presenter.id).toBe('d83a0533-5098-463c-8519-fe51864a6c05');
      expect(presenter.name).toBe('Movie');
      expect(presenter.description).toBe('some description');
      expect(presenter.is_active).toBeTruthy();
      expect(presenter.created_at).toBe(created_at);
    });

    it('should presenter data', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: 'd83a0533-5098-463c-8519-fe51864a6c05',
        name: 'Movie',
        description: 'some description',
        is_active: true,
        created_at,
      });
      const data = instanceToPlain(presenter);
      expect(data).toStrictEqual({
        id: 'd83a0533-5098-463c-8519-fe51864a6c05',
        name: 'Movie',
        description: 'some description',
        is_active: true,
        created_at: created_at.toISOString(),
      });
    });
  });
});

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
            name: 'movie',
            description: 'some description',
            is_active: true,
            created_at,
          },
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      });

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        }),
      );
      expect(presenter.data).toStrictEqual([
        new CategoryPresenter({
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at,
        }),
      ]);
    });
  });

  it('should presenter data', () => {
    const created_at = new Date();
    let presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at,
        },
      ],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: created_at.toISOString(),
        },
      ],
    });

    presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at,
        },
      ],
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: created_at.toISOString(),
        },
      ],
    });
  });
});
