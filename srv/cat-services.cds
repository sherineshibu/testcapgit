using my.bookshop as my from '../db/schema';

service CatalogService {

    //entity Books @readonly as projection on my.Books;
    entity Books as projection on my.Books;

}