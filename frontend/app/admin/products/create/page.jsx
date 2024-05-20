'use client';

import Wrapper from '../../../ui/Wrapper';
import { useEffect, useState } from 'react';
import axios from '../../../lib/axios';
import General from './partials/General';
import Images from './partials/Images';
import Attributes from './partials/Attributes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';

export default function Create() {
   const router = useRouter();
   const [selectedTab, setSelectedTab] = useState('General');

   const [categories, setCategories] = useState([]);
   const [brands, setBrands] = useState([]);
   const [collections, setCollections] = useState([]);

   const [category, setCategory] = useState('');
   const [brand, setBrand] = useState('');
   const [collection, setCollection] = useState('');
   const [name, setName] = useState('');
   const [model, setModel] = useState('');
   const [description, setDescription] = useState('');
   const [shortDescription, setShortDescription] = useState('');
   const [price, setPrice] = useState('');

   const [images, setImages] = useState([]);

   const [attributes, setAttributes] = useState([]);
   const [selectedAttributes, setSelectedAttributes] = useState([]);
   const [attributeValues, setAttributeValues] = useState([]);

   const addAttribute = () => {
      setSelectedAttributes([...selectedAttributes, { attribute: '', value: '' }]);
      setAttributeValues([...attributeValues, { attribute: '', values: [] }]);
   };

   const updateAttribute = (index, attribute) => {
      axios.get('/api/v1/admin/attributes/' + attribute + '/attributeValues').then((response) => {
         const newAttributes = [...selectedAttributes];
         newAttributes[index].attribute = attribute;
         setSelectedAttributes(newAttributes);

         const newAttributeValues = [...attributeValues];
         newAttributeValues[index] = { attribute, values: response.data };
         setAttributeValues(newAttributeValues);
      });
   };

   const updateValue = (index, value) => {
      const newAttributes = [...selectedAttributes];
      newAttributes[index].value = value;
      setSelectedAttributes(newAttributes);
   };

   const removeAttribute = (index) => {
      const newAttributes = [...selectedAttributes];
      newAttributes.splice(index, 1);
      setSelectedAttributes(newAttributes);

      const newAttributeValues = [...attributeValues];
      newAttributeValues.splice(index, 1);
      setAttributeValues(newAttributeValues);
   };

   const handleDroppedFiles = (files) => {
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

   const removeImage = (index) => {
      setImages((prevImages) => prevImages.filter((image, i) => i !== index));
   };

   const fetchCategories = () => {
      axios
         .get('/api/v1/admin/categories')
         .then((response) => {
            setCategories(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   };

   const fetchBrands = () => {
      axios
         .get('/api/v1/admin/brands')
         .then((response) => {
            setBrands(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   };

   const fetchCollections = () => {
      axios
         .get('/api/v1/admin/collections')
         .then((response) => {
            setCollections(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   };

   const fetchAttributes = () => {
      axios
         .get('/api/v1/admin/attributes')
         .then((response) => {
            setAttributes(response.data);
         })
         .catch((error) => {
            console.error('Error:', error);
         });
   };

   const handleSave = () => {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('model', model);
      formData.append('description', description);
      formData.append('short_description', shortDescription);
      formData.append('price', price);
      formData.append('category_id', category);
      formData.append('brand_id', brand);
      formData.append('collection_id', collection);

      images.forEach((image, index) => {
         formData.append(`images[${index}]`, image);
      });

      selectedAttributes.forEach((item) => {
         formData.append(`attributes_values[${item.attribute}]`, item.value);
      });

      axios
         .post('/api/v1/admin/products', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         })
         .then(() => {
            router.push('/admin/products');
         })
         .catch((error) => {
            console.error(error);
         });
   };

   useEffect(() => {
      fetchCategories();
      fetchBrands();
      fetchCollections();
      fetchAttributes();
   }, []);

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

            {selectedTab === 'General' && (
               <General
                  categories={categories}
                  brands={brands}
                  collections={collections}
                  name={name}
                  setName={setName}
                  description={description}
                  setDescription={setDescription}
                  shortDescription={shortDescription}
                  setShortDescription={setShortDescription}
                  price={price}
                  setPrice={setPrice}
                  brand={brand}
                  setBrand={setBrand}
                  category={category}
                  setCategory={setCategory}
                  collection={collection}
                  setCollection={setCollection}
                  model={model}
                  setModel={setModel}
               />
            )}
            {selectedTab === 'Attributes' && (
               <Attributes
                  attributes={attributes}
                  attributeValues={attributeValues}
                  selectedAttributes={selectedAttributes}
                  setSelectedAttributes={setSelectedAttributes}
                  updateAttribute={updateAttribute}
                  updateValue={updateValue}
                  addAttribute={addAttribute}
                  removeAttribute={removeAttribute}
               />
            )}
            {selectedTab === 'Images' && (
               <Images
                  images={images}
                  handleDroppedFiles={handleDroppedFiles}
                  removeImage={removeImage}
                  setImages={setImages}
               />
            )}

            <div className="bottom-2 right-2 space-x-2">
               <div className="flex justify-center pt-4">
                  <button onClick={handleSave} className="btn btn-success w-full max-w-3xl text-white">
                     Save
                  </button>
               </div>
            </div>
         </Wrapper>
      </>
   );
}
