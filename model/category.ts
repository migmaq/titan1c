import {Collection, CollectionSnapshot} from './model.ts';

/**
 * Categories
 */
export interface Category {
    id: string,
    name: string,
}

export class CategoryCollection extends Collection<Category> {
}

export class CategorySnapshot extends CollectionSnapshot<Category> {
}
