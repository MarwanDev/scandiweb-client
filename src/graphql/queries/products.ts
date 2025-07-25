import { gql } from 'graphql-request';

export const GET_ALL_PRODUCTS = gql`
  query {
    products {
      id
      name
      brand
      in_stock
      category
      prices {
        amount
          currency_label
          currency_symbol
          amount
      }
      attributes {
        name
        type
        id
        items {
          display_value
          value
          item_id
        }
      }
      gallery {
        image_url
      }
    }
  }
`;

export const PRODUCTS_BY_CATEGORY = `
  query ProductsByCategory($categoryId: ID!) {
    productsByCategory(categoryId: $categoryId) {
      id
      name
      brand
      in_stock
      category
      prices {
        amount
        currency_label
        currency_symbol
        amount
      }
      attributes {
        name
        type
        id
        items {
          display_value
          value
          item_id
        }
      }
      gallery {
        image_url
      }
    }
  }
`;

export const PRODUCT = `
  query Product($id: String!) {
    product(id: $id) {
      id
      name
      brand
      in_stock
      category
      description
      prices {
        amount
        currency_label
        currency_symbol
        amount
      }
      attributes {
        name
        type
        id
        items {
          display_value
          value
          item_id
        }
      }
      gallery {
        image_url
      }
    }
  }
`;
