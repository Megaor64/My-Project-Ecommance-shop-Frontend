export type { Book, ExpressProduct } from "@/features/products/types";
export {
  coverColorFromId,
  filterBooks,
  formatAuthorDescription,
  groupBooksByGenre,
  mapProductToBook,
  parseAuthor,
  parseDescriptionBody,
} from "@/features/products/utils/mapProductToBook";
