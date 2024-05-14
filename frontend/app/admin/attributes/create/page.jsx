'use client';

import React, {useState} from 'react';
import Wrapper from '../../../ui/Wrapper';
import axios from '../../../lib/axios';
import {useRouter} from 'next/navigation';
import InputError from '../../../ui/InputError';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AttributeCreate() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();

        setErrors([]);

        axios
        .post('/api/v1/admin/attributes', {
            name: name,
            description: description,
        })
        .then((response) => {
            toast.success(response.data.message, {
                autoClose: 1000,
                position: 'bottom-right',
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
            });
            router.push('/admin/attributes');
        })
        .catch((error) => {
            if (error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                toast.error(error.response.data.message, {
                    autoClose: 1000,
                    position: 'bottom-right',
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        });
    };

    return (
        <>
            <ToastContainer />
            <h1 className="text-3xl font-bold p-2">Create Attribute</h1>
            <Wrapper maxWidth="max-w-xl">
                <form className="flex justify-center items-center" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <input
                            className={"input input-bordered w-full " + (errors.name ? " input-error" : "")}
                            onChange={(e) => {
                                if (errors.name) {
                                    setErrors(prevErrors => ({...prevErrors, name: ""}));
                                }
                                setName(e.target.value)
                            }
                            }
                            value={name} type="text"
                            placeholder="Name"
                        />
                        <InputError messages={errors.name} className="mt-2"/>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            value={description}
                            className="w-full textarea textarea-bordered" placeholder="Description"
                        />
                        <InputError messages={errors.description} className="mt-2"/>
                        <button
                            className="w-full btn btn-success text-white mt-8"
                            onSubmit={handleSubmit}
                        >Submit
                        </button>
                    </div>
                </form>
            </Wrapper>
        </>
    );
}
