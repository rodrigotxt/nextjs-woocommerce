/*eslint complexity: ["error", 20]*/
// Imports
import { useState, useEffect } from 'react';

// Utils
import { filteredVariantPrice, paddedPrice } from '@/utils/functions/functions';

// Components
import AddToCart, { IProductRootObject } from './AddToCart.component';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.component';

const SingleProduct = ({ product }: IProductRootObject) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedVariation, setSelectedVariation] = useState<number>();
  
  const placeholderFallBack = 'https://via.placeholder.com/600';
  
  let DESCRIPTION_WITHOUT_HTML;

  useEffect(() => {
    setIsLoading(false);
    if (product.variations) {
      const firstVariant = product.variations.nodes[0].databaseId;
      setSelectedVariation(firstVariant);
    }
  }, [product.variations]);

  let { description, image, name, onSale, price, regularPrice, salePrice } =
    product;

  // Add padding/empty character after currency symbol here
  if (price) {
    price = paddedPrice(price, 'kr');
  }
  if (regularPrice) {
    regularPrice = paddedPrice(regularPrice, 'kr');
  }
  if (salePrice) {
    salePrice = paddedPrice(salePrice, 'kr');
  }

  // Strip out HTML from description
  if (process.browser) {
    DESCRIPTION_WITHOUT_HTML = new DOMParser().parseFromString(
      description,
      'text/html',
    ).body.textContent;
  }

  

  return (
    <section className="py-8 bg-white mb-12 sm:mb-2">
      {/* Show loading spinner while loading, and hide content while loading */}
      {isLoading ? (
        <div className="h-56 mt-20">
          <p className="text-2xl font-bold text-center">Laster produkt ...</p>
          <br />
          <LoadingSpinner />
        </div>
      ) : (
        <div className="container flex flex-wrap items-center pt-4 pb-12 mx-auto ">
          <div className="grid grid-cols-1 gap-4 mt-16 lg:grid-cols-2 xl:grid-cols-2 md:grid-cols-2 sm:grid-cols-2">
            {image && (
              <img
                id="product-image"
                src={image.sourceUrl}
                alt={name}
                className="h-auto p-8 transition duration-500 ease-in-out transform xl:p-2 md:p-2 lg:p-2 hover:grow hover:scale-105"
              />
            )}
            {!image && (
              <img
                id="product-image"
                src={
                  process.env.NEXT_PUBLIC_PLACEHOLDER_LARGE_IMAGE_URL ??
                  placeholderFallBack
                }
                alt={name}
                className="h-auto p-8 transition duration-500 ease-in-out transform xl:p-2 md:p-2 lg:p-2 hover:grow hover:shadow-lg hover:scale-105"
              />
            )}
            <div className="ml-8">
              <p className="text-3xl font-bold text-left">{name}</p>
              <br />
              {/* Display sale price when on sale */}
              {onSale && (
                <div className="flex">
                  <p className="pt-1 mt-4 text-3xl text-gray-900">
                    {product.variations && filteredVariantPrice(price, '')}
                    {!product.variations && salePrice}
                  </p>
                  <p className="pt-1 pl-8 mt-4 text-2xl text-gray-900 line-through">
                    {product.variations && filteredVariantPrice(price, 'right')}
                    {!product.variations && regularPrice}
                  </p>
                </div>
              )}
              {/* Display regular price when not on sale */}
              {!onSale && (
                <p className="pt-1 mt-4 text-2xl text-gray-900"> {price}</p>
              )}
              <br />
              <p className="pt-1 mt-4 text-2xl text-gray-900">
                {DESCRIPTION_WITHOUT_HTML}
              </p>
              {Boolean(product.stockQuantity) && (
                <p
                  v-if="data.product.stockQuantity"
                  className="pt-1 mt-4 mb-4 text-2xl text-gray-900"
                >
                  {product.stockQuantity} på lager
                </p>
              )}
              {product.variations && (
                <p className="pt-1 mt-4 text-xl text-gray-900">
                  <span className="py-2">Varianter</span>
                  <select
                    id="variant"
                    name="variant"
                    className="block w-80 px-6 py-2 bg-white border border-gray-500 rounded-lg focus:outline-none focus:shadow-outline"
                    onChange={(e) => {
                      setSelectedVariation(Number(e.target.value));
                    }}
                  >
                    {product.variations.nodes.map(
                      ({ id, name, databaseId, stockQuantity }) => {
                        // Remove product name from variation name
                        const filteredName = name.split('- ').pop();
                        return (
                          <option key={id} value={databaseId}>
                            {filteredName} - ({stockQuantity} på lager)
                          </option>
                        );
                      },
                    )}
                  </select>
                </p>
              )}
              <div className="pt-1 mt-2">
                {
                  // Display default AddToCart button if we do not have variations.
                  // If we do, send the variationId to AddToCart button
                }
                {product.variations && (
                  <AddToCart
                    product={product}
                    variationId={selectedVariation}
                  />
                )}
                {!product.variations && <AddToCart product={product} />}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SingleProduct;
