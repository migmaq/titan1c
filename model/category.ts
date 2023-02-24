import {Collection, CollectionSnapshot} from './lib/collection.ts';

/**
 * Category
 */
export interface Category {
    id: string,
    name: string,
}

export class CategoryCollection extends Collection<Category> {
}

export class CategorySnapshot extends CollectionSnapshot<Category> {
}
