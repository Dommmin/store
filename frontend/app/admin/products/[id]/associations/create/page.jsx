'use client';

import Wrapper from '../../../../../ui/Wrapper';
import {useEffect, useState} from 'react';
import LoadingSpinner from '../../../../../ui/LoadingSpinner';
import axios from '../../../../../lib/axios';
import PageNotFound from '../../../../../../app/not-found';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {ChevronDoubleLeftIcon} from '@heroicons/react/24/outline';

export default function Create({ params }) {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [attribute, setAttribute] = useState('');
    const [products, setProducts] = useState([]);
    const [variant, setVariant] = useState('');
    const [errors, setErrors] = useState([]);

    const fetchData = () => {
        axios
        .get('/api/v1/admin/products/' + params.id + '/attributes')
        .then((response) => {
            setData(response.data);
        })
        .catch((error) => {
            setErrors([...errors, error.response.data.message]);
        })
        .finally(() => setIsLoading(false));
    }

    const fetchProducts = () => {
        axios
        .get('/api/v1/admin/products', {
            params: {
                attribute: attribute,
                product: params.id
            }
        })
        .then((response) => {
            setProducts(response.data);
        })
        .catch((error) => {
            setErrors([...errors, error.response.data.message]);
            console.log(error);
        })
        .finally(() => setIsLoading(false));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
        .post('/api/v1/admin/products/' + params.id + '/associations', {
            attribute_id: attribute,
            variant_id: variant
        })
        .then(() => {
            router.push('/admin/products/' + params.id + '/associations');
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        if (attribute) {
            setVariant('');
            fetchProducts();
        }
    }, [attribute]);

    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) return <LoadingSpinner className="h-screen" />

    if (errors.length > 0) return <PageNotFound />

    return (
        <>
            <div className="p-4">
                <Link href={'/admin/products/' + params.id + '/associations'} className="btn btn-default btn-outline">
                    <ChevronDoubleLeftIcon className="h-6"/>
                </Link>
            </div>
            <Wrapper>
                <form onSubmit={handleSubmit} className="flex justify-center items-center max-auto">
                    <div className="w-full max-w-3xl space-y-4">
                        <div className="p-6 flex space-x-4">
                            <label className="form-control w-full max-w-md">
                                <div className="label">
                                    <span className="label-text">Attribute</span>
                                </div>
                                <select
                                    className="select select-bordered"
                                    onChange={(event) => setAttribute(event.target.value)}
                                    value={attribute}
                                >
                                    <option disabled value="">Pick one</option>
                                    {data.map((item) => (
                                        <option key={item.id} value={item.attribute.id}>{item.attribute.name}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="form-control w-full max-w-md">
                                <div className="label">
                                    <span className="label-text">Variant</span>
                                </div>
                                <select
                                    className="select select-bordered"
                                    onChange={(event) => setVariant(event.target.value)}
                                    value={variant}
                                >
                                    <option disabled value="">Pick one</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <button
                            className="btn btn-primary w-full text-white"
                            type="submit"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </Wrapper>
        </>
    );
}
