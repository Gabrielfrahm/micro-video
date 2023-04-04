import { instanceToPlain } from 'class-transformer';
import { CategoryPresenter } from './category-presenter';

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
