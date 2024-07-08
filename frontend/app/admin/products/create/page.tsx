'use client';

import React, { useState } from 'react';
import Wrapper from '../../../ui/Wrapper';
import axios from '../../../lib/axios';
import General from './partials/General';
import Images from './partials/Images';
import Attributes from './partials/Attributes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import {
   Product,
   SelectedAttribute,
} from '../../../types/product';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../ui/LoadingSpinner';

interface AttributeValue {
   attribute: string;
   values: string[];
}

export default function Create() {
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<Product>();

   const [selectedTab, setSelectedTab] = useState('General');
   const [images, setImages] = useState<File[]>([]);
   const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
   const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);

   const addAttribute = () => {
      setSelectedAttributes([...selectedAttributes, { attribute: '', value: '' }]);
      setAttributeValues([...attributeValues, { attribute: '', values: [] }]);
   };

   const updateValue = (index: number, value: string) => {
      const newAttributes = [...selectedAttributes];
      newAttributes[index].value = value;
      setSelectedAttributes(newAttributes);
   };

   const removeAttribute = (index: number) => {
      const newAttributes = [...selectedAttributes];
      newAttributes.splice(index, 1);
      setSelectedAttributes(newAttributes);

      const newAttributeValues = [...attributeValues];
      newAttributeValues.splice(index, 1);
      setAttributeValues(newAttributeValues);
   };

   const updateAttribute = (index: number, attribute: string) => {
      axios.get('/api/v1/admin/attributes/' + attribute + '/attributeValues').then((response) => {
         const newAttributes = [...selectedAttributes];
         newAttributes[index].attribute = attribute;
         setSelectedAttributes(newAttributes);

         const newAttributeValues = [...attributeValues];
         newAttributeValues[index] = { attribute, values: response.data };
         setAttributeValues(newAttributeValues);
      });
   };

   const fetchCategories = async () => {
      const response = await axios.get('/api/v1/admin/categories');

      return response.data;
   };

   const fetchBrands = async () => {
      const response = await axios.get('/api/v1/admin/brands');

      return response.data;
   };

   const fetchCollections = async () => {
      const response = await axios.get('/api/v1/admin/collections');

      return response.data;
   };

   const fetchAttributes = async () => {
      const response = await axios.get('/api/v1/admin/attributes');

      return response.data;
   };

   const onSubmit = async (data: Product) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('model', data.model);
      formData.append('description', data.description);
      formData.append('short_description', data.short_description);
      formData.append('price', data.price);
      formData.append('category_id', data.category_id);
      formData.append('brand_id', data.brand_id);
      formData.append('collection_id', data.collection_id);

      images.forEach((image, index) => {
         formData.append(`images[${index}]`, image);
      });

      selectedAttributes.forEach((item) => {
         formData.append(`attributes_values[${item.attribute}]`, item.value);
      });

      // try {
      //     await axios.post('/api/v1/admin/products', formData, {
      //         headers: {
      //             'Content-Type': 'multipart/form-data',
      //         },
      //     });
      //     router.push('/admin/products');
      // } catch (error) {
      //     console.error(error);
      // }
   };

   const handleDroppedFiles = (files: FileList | null) => {
      Array.from(files).forEach((file) => {
         if (!file.type.startsWith('image/')) {
            // TODO: show notification
            return;
         }

         setImages((prevImages) => {
            if (!prevImages.some((image) => image.name === file.name)) {
               return [...prevImages, file];
            } else {
               // TODO: show notification
               return prevImages;
            }
         });
      });
   };

   const handleRemoveImage = (index: number) => {
      setImages((prevImages) => prevImages.filter((image, i) => i !== index));
   };

   const {
      data: categories,
      isPending: isCategoriesPending,
      isError: isCategoriesError,
      error: categoriesError,
   } = useQuery({
      queryKey: ['categories'],
      queryFn: fetchCategories,
   });

   const {
      data: brands,
      isPending: isBrandsPending,
      isError: isBrandsError,
      error: brandsError,
   } = useQuery({
      queryKey: ['brands'],
      queryFn: fetchBrands,
   });

   const {
      data: collections,
      isPending: isCollectionsPending,
      isError: isCollectionsError,
      error: collectionsError,
   } = useQuery({
      queryKey: ['collections'],
      queryFn: fetchCollections,
   });

   const {
      data: attributes,
      isPending: isAttributesPending,
      isError: isAttributesError,
      error: attributesError,
   } = useQuery({
      queryKey: ['attributes'],
      queryFn: fetchAttributes,
   });

   if (isCategoriesError) return <p>Error: {categoriesError.message}</p>;
   if (isBrandsError) return <p>Error: {brandsError.message}</p>;
   if (isCollectionsError) return <p>Error: {collectionsError.message}</p>;
   if (isAttributesError) return <p>Error: {attributesError.message}</p>;

   if (isCategoriesPending || isBrandsPending || isCollectionsPending || isAttributesPending)
      return <LoadingSpinner className="h-screen" />;

   return (
      <>
         <div className="p-4">
            <Link href={'/admin/products'} className="btn-default btn btn-outline">
               <ChevronDoubleLeftIcon className="h-6" />
            </Link>
         </div>
         <Wrapper className="space-y-4" maxWidth="max-w-[1920px]" paddingY="py-4">
            <div role="tablist" className="tabs tabs-lifted tabs-lg overflow-auto px-2">
               <a
                  role="tab"
                  className={`tab ${selectedTab === 'General' ? 'tab-active text-info/80' : ''}`}
                  onClick={() => setSelectedTab('General')}
               >
                  General
               </a>
               <a
                  role="tab"
                  className={`tab ${selectedTab === 'Attributes' ? 'tab-active text-info/80' : ''}`}
                  onClick={() => setSelectedTab('Attributes')}
               >
                  Attributes
               </a>
               <a
                  role="tab"
                  className={`tab ${selectedTab === 'Images' ? 'tab-active text-info/80' : ''}`}
                  onClick={() => setSelectedTab('Images')}
               >
                  Images
               </a>
            </div>

            <form
               onSubmit={(event) => {
                  event.preventDefault();
                  handleSubmit(onSubmit);
               }}
            >
               {selectedTab === 'General' && (
                  <General
                     categories={categories}
                     brands={brands}
                     collections={collections}
                     register={register}
                     errors={errors}
                  />
               )}
               {selectedTab === 'Attributes' && (
                  <Attributes
                     attributes={attributes}
                     register={register}
                     // attributeValues={attributeValues}
                     // setAttributeValues={setAttributeValues}
                     updateAttribute={updateAttribute}
                     addAttribute={addAttribute}
                     selectedAttributes={selectedAttributes}
                     updateValue={updateValue}
                     removeAttribute={removeAttribute}
                  />
               )}
               {selectedTab === 'Images' && (
                  <Images
                     images={images}
                     setImages={setImages}
                     handleDroppedFiles={handleDroppedFiles}
                     handleRemoveImage={handleRemoveImage}
                  />
               )}

               <div className="bottom-2 right-2 space-x-2">
                  <div className="flex justify-center pt-4">
                     <button type="submit" className="btn btn-success w-full max-w-3xl text-white">
                        Save
                     </button>
                  </div>
               </div>
            </form>
         </Wrapper>
      </>
   );
}
