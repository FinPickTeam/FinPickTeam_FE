import api from '../instance';

export const getWishlist = () => {
  return api
    .get('/v1/wishlist/')
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const addWishlist = (body) => {
  return api
    .post('/v1/wishlist', body)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const deleteWishlist = (body) => {
  return api.delete('/v1/wishlist', { data: body }).catch((err) => {
    throw err;
  });
};

export const getWishlistProductId = (productType) => {
  return api
    .get(`/v1/wishlist/${productType}/names`)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
