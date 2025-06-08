import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAdvert extends Struct.ComponentSchema {
  collectionName: 'components_shared_adverts';
  info: {
    description: '';
    displayName: 'Advert';
  };
  attributes: {
    CallToAction: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedBlog extends Struct.ComponentSchema {
  collectionName: 'components_shared_blogs';
  info: {
    displayName: 'Blog';
  };
  attributes: {
    blogs: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
    description: Schema.Attribute.Text;
    Title: Schema.Attribute.String;
  };
}

export interface SharedCartItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_cart_items';
  info: {
    description: '';
    displayName: 'CartItem';
  };
  attributes: {
    aftercares: Schema.Attribute.Relation<
      'oneToMany',
      'api::aftercare.aftercare'
    >;
    clothingSize: Schema.Attribute.String;
    color: Schema.Attribute.String;
    ItemType: Schema.Attribute.String;
    jewelries: Schema.Attribute.Relation<'oneToMany', 'api::jewelry.jewelry'>;
    merchandises: Schema.Attribute.Relation<
      'oneToMany',
      'api::merchandise.merchandise'
    >;
    quantity: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
    size: Schema.Attribute.Integer;
    waistbeads: Schema.Attribute.Relation<
      'oneToMany',
      'api::waistbead.waistbead'
    >;
    waistbeadSize: Schema.Attribute.Integer;
  };
}

export interface SharedCategory extends Struct.ComponentSchema {
  collectionName: 'components_shared_categories';
  info: {
    description: '';
    displayName: 'category';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Slug: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface SharedFeaturedProduct extends Struct.ComponentSchema {
  collectionName: 'components_shared_featured_products';
  info: {
    displayName: 'Featured_Product';
  };
  attributes: {
    jewelries: Schema.Attribute.Relation<'oneToMany', 'api::jewelry.jewelry'>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedGreeting extends Struct.ComponentSchema {
  collectionName: 'components_shared_greetings';
  info: {
    displayName: 'Greeting';
  };
  attributes: {
    Title: Schema.Attribute.String;
    Video: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    description: '';
    displayName: 'Hero';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_items';
  info: {
    displayName: 'Item';
  };
  attributes: {
    jewelries: Schema.Attribute.Relation<'oneToMany', 'api::jewelry.jewelry'>;
  };
}

export interface SharedJewelrySize extends Struct.ComponentSchema {
  collectionName: 'components_shared_jewelry_sizes';
  info: {
    description: '';
    displayName: 'Jewelry_size';
  };
  attributes: {
    quantity: Schema.Attribute.Integer;
    Size: Schema.Attribute.Integer;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedReviews extends Struct.ComponentSchema {
  collectionName: 'components_shared_reviews';
  info: {
    displayName: 'Reviews';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    reviews: Schema.Attribute.Relation<'oneToMany', 'api::review.review'>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSize extends Struct.ComponentSchema {
  collectionName: 'components_shared_sizes';
  info: {
    description: '';
    displayName: 'Size';
  };
  attributes: {
    quantity: Schema.Attribute.Integer;
    Size: Schema.Attribute.Enumeration<['Small', 'Medium', 'Large', 'X-Large']>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.advert': SharedAdvert;
      'shared.blog': SharedBlog;
      'shared.cart-item': SharedCartItem;
      'shared.category': SharedCategory;
      'shared.featured-product': SharedFeaturedProduct;
      'shared.greeting': SharedGreeting;
      'shared.hero': SharedHero;
      'shared.item': SharedItem;
      'shared.jewelry-size': SharedJewelrySize;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.reviews': SharedReviews;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.size': SharedSize;
      'shared.slider': SharedSlider;
    }
  }
}
