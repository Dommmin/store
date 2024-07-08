export interface Product {
   id: number|string;
   url: string;
   main_image: string;
   collection: Collection;
   is_published: boolean;
   bookmark_id: number;
   name: string;
   model: string;
   description: string;
   short_description: string;
   price: string;
   formatted_price: string;
   category_id: string;
   brand_id: string;
   collection_id: string;
   images: [
      {
         id: number;
         path: string;
         url: string;
      }
   ];
   associations: {
       [key: string]: Association[]
   };
   sizes: Size[];
   attributes: Attribute[];
   attributes_values: AttributeValue[];
   reviews_count: number;
   reviews_avg_rating: number;
   review: {
      id: number;
      name: string;
      comment: string;
      rating: number;
   }
}

export interface Association {
   id: number;
   product_id: number;
   variant_id: number;
   attribute_id: number;
   variant: {
      id: number;
      name: string;
      url: string;
      image: {
         id: number;
         path: string;
         url: string;
      };
      attributes: Attribute[];
      formatted_price: string;
   }
}

export interface Size {
   id: number;
   value: string;
   stock: number;
}

export interface Attribute {
   id: number;
   name: string;
   description: string;
   value: string;
}

export interface AttributeValue {
   id: number;
   name: string;
}

export interface FormInput {
   name: string;
   model: string;
   description: string;
   shortDescription: string;
   price: number;
   category: number;
   brand: number;
   collection: number;
   images: File[];
   selectedAttributes: SelectedAttribute[];
}

export interface SelectedAttribute {
   attribute: string;
   value: string;
}

export interface Category {
   id: number;
   name: string;
}

export interface Brand {
   id: number;
   name: string;
}

export interface Collection {
   id: number;
   name: string;
}
